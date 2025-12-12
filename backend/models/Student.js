const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    attendance: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value for attendance percentage.'
        }
    },
    cgpa: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    assignmentCompletion: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value for assignment completion percentage.'
        }
    },
    dropoutProbability: {
        type: Number,
        min: 0,
        max: 100
    },
    riskLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate dropout probability before saving
studentSchema.pre('save', async function() {
    // Weights for different factors (can be adjusted based on research/requirements)
    const WEIGHTS = {
        attendance: 0.4,      // 40% weight
        cgpa: 0.4,           // 40% weight (normalized to 0-100 scale)
        assignment: 0.2       // 20% weight
    };

    // Normalize CGPA to 0-100 scale (assuming 10-point scale)
    const normalizedCGPA = (this.cgpa / 10) * 100;
    
    // Calculate weighted score (lower is better for dropout risk)
    const weightedScore = 
        ((100 - this.attendance) * WEIGHTS.attendance) + 
        ((100 - normalizedCGPA) * WEIGHTS.cgpa) + 
        ((100 - this.assignmentCompletion) * WEIGHTS.assignment);

    // Convert to probability percentage (0-100%)
    this.dropoutProbability = Math.min(100, Math.max(0, Math.round(weightedScore)));
    
    // Determine risk level
    if (this.dropoutProbability >= 70) {
        this.riskLevel = 'High';
    } else if (this.dropoutProbability >= 30) {
        this.riskLevel = 'Medium';
    } else {
        this.riskLevel = 'Low';
    }
});

module.exports = mongoose.model('Student', studentSchema);
