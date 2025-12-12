const Student = require('../models/Student');
const { jsPDF } = require('jspdf');
require('jspdf-autotable');
const XLSX = require('xlsx');

// Create a new student record
exports.createStudent = async (req, res) => {
    try {
        const { name, attendance, cgpa, assignmentCompletion } = req.body;
        
        // Create new student
        const student = new Student({
            name,
            attendance: parseInt(attendance),
            cgpa: parseFloat(cgpa),
            assignmentCompletion: parseInt(assignmentCompletion)
        });

        // Save to database (the pre-save middleware will calculate the probability)
        await student.save();
        
        res.status(201).json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating student record',
            error: error.message
        });
    }
};

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching student records',
            error: error.message
        });
    }
};

// Generate PDF report
exports.generatePdfReport = async (req, res) => {
    try {
        const students = await Student.find().sort({ dropoutProbability: -1 });
        
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });
        
        // Title
        doc.setFontSize(20);
        doc.text('Student Dropout Risk Report', 14, 22);
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
        
        // Prepare table data
        const tableData = students.map(student => [
            student.name,
            `${student.attendance}%`,
            student.cgpa.toFixed(2),
            `${student.assignmentCompletion}%`,
            `${student.dropoutProbability}%`,
            student.riskLevel
        ]);
        
        // Add table
        doc.autoTable({
            head: [['Name', 'Attendance %', 'CGPA', 'Assignments %', 'Dropout Risk %', 'Risk Level']],
            body: tableData,
            startY: 40,
            styles: { 
                cellPadding: 3,
                fontSize: 9,
                valign: 'middle',
                overflow: 'linebreak',
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                font: 'helvetica'
            },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontStyle: 'bold',
                halign: 'center'
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },
            columnStyles: {
                0: { cellWidth: 40, halign: 'left' },
                1: { cellWidth: 25, halign: 'center' },
                2: { cellWidth: 20, halign: 'center' },
                3: { cellWidth: 30, halign: 'center' },
                4: { cellWidth: 30, halign: 'center' },
                5: { 
                    cellWidth: 25, 
                    halign: 'center',
                    cellCallback: function(cell, data) {
                        if (data.row.raw[5] === 'High') {
                            cell.styles.fillColor = [255, 0, 0];
                            cell.styles.textColor = [255, 255, 255];
                        } else if (data.row.raw[5] === 'Medium') {
                            cell.styles.fillColor = [255, 165, 0];
                            cell.styles.textColor = [0, 0, 0];
                        } else {
                            cell.styles.fillColor = [0, 128, 0];
                            cell.styles.textColor = [255, 255, 255];
                        }
                    }
                }
            },
            didDrawPage: function(data) {
                // Footer
                const pageSize = doc.internal.pageSize;
                const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                doc.setFontSize(8);
                doc.setTextColor(100);
                doc.text(
                    'Page ' + doc.internal.getNumberOfPages(),
                    data.settings.margin.left,
                    pageHeight - 10
                );
            }
        });
        
        // Add summary
        const highRisk = students.filter(s => s.riskLevel === 'High').length;
        const mediumRisk = students.filter(s => s.riskLevel === 'Medium').length;
        const lowRisk = students.filter(s => s.riskLevel === 'Low').length;
        
        const finalY = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Summary', 14, finalY);
        
        doc.setFontSize(10);
        doc.text(`Total Students: ${students.length}`, 14, finalY + 10);
        doc.text(`High Risk: ${highRisk}`, 14, finalY + 20);
        doc.text(`Medium Risk: ${mediumRisk}`, 60, finalY + 20);
        doc.text(`Low Risk: ${lowRisk}`, 106, finalY + 20);
        
        // Generate the PDF as a buffer
        const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
        
        // Set headers for file download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=student_dropout_report.pdf');
        res.setHeader('Content-Length', pdfBuffer.length);
        
        // Send the PDF
        res.send(pdfBuffer);
        
    } catch (error) {
        console.error('Error generating PDF report:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating PDF report',
            error: error.message
        });
    }
};

// Generate Excel report
exports.generateExcelReport = async (req, res) => {
    try {
        const students = await Student.find().sort({ dropoutProbability: -1 });
        
        // Format data for Excel
        const data = students.map(student => ({
            'Name': student.name,
            'Attendance %': student.attendance,
            'CGPA': student.cgpa.toFixed(2),
            'Assignments %': student.assignmentCompletion,
            'Dropout Risk %': student.dropoutProbability,
            'Risk Level': student.riskLevel,
            'Date Added': student.createdAt.toLocaleDateString()
        }));
        
        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(data);
        
        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Students Dropout Report');
        
        // Generate Excel file
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=student_dropout_report.xlsx');
        res.send(excelBuffer);
        
    } catch (error) {
        console.error('Error generating Excel report:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating Excel report',
            error: error.message
        });
    }
};
