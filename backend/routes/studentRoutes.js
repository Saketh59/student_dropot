const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Create a new student
router.post('/', studentController.createStudent);

// Get all students
router.get('/', studentController.getAllStudents);

// Generate PDF report
router.get('/report/pdf', studentController.generatePdfReport);

// Generate Excel report
router.get('/report/excel', studentController.generateExcelReport);

module.exports = router;
