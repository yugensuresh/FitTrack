const mongoose = require('mongoose');

const WorkoutSessionSchema = new mongoose.Schema({
    Member_ID: { type: String, required: true },
    Trainer_ID: { type: String, required: true },
    Session_DateTime: { type: Date, required: true },
    Workout_Type: { type: String, required: true },
    Duration: { type: Number, required: true },
    Status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    Attendance: { type: Boolean, default: false },
    Notes: { type: String, default: '' },
    Progress: [{ 
        exercise: { type: String },
        sets: { type: Number },
        reps: { type: Number },
        weight: { type: Number }
    }]
}, { timestamps: true });

module.exports = mongoose.model('WorkoutSession', WorkoutSessionSchema);