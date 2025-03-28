const express = require("express");
const router = express.Router();
const WorkoutSession = require('../models/workoutSession.js');

// CREATE: Create a new workout session
router.post("/create", async (req, res) => {
    try {
        const { Member_ID, Trainer_ID, Session_DateTime, Workout_Type, Duration, Status, Attendance, Notes, Progress } = req.body;
        const newSession = new WorkoutSession({
            Member_ID,
            Trainer_ID,
            Session_DateTime,
            Workout_Type,
            Duration,
            Status,
            Attendance,
            Notes,
            Progress,
        });
        await newSession.save();
        res.status(201).json({ message: "Workout session created successfully!", session: newSession });
    } catch (error) {
        console.error("🔥 ERROR:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});

// READ: Get all workout sessions with optional filtering
router.get("/sessions", async (req, res) => {
    try {
        const { member_id, trainer_id, status, upcoming } = req.query;
        const query = {};
        
        // Apply filters if provided
        if (member_id) query.Member_ID = member_id;
        if (trainer_id) query.Trainer_ID = trainer_id;
        if (status) query.Status = status;
        
        // Filter for upcoming sessions
        if (upcoming === 'true') {
            query.Session_DateTime = { $gt: new Date() };
            query.Status = { $ne: 'cancelled' };
        }
        
        const sessions = await WorkoutSession.find(query).sort({ Session_DateTime: upcoming === 'true' ? 1 : -1 });
        res.status(200).json(sessions);
    } catch (error) {
        console.error("🔥 ERROR:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});

// READ: Get a specific workout session by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const session = await WorkoutSession.findById(id);
        
        if (!session) {
            return res.status(404).json({ message: "Workout session not found" });
        }
        
        res.status(200).json(session);
    } catch (error) {
        console.error("🔥 ERROR:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});

// UPDATE: Update a workout session
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const updatedSession = await WorkoutSession.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!updatedSession) {
            return res.status(404).json({ message: "Workout session not found" });
        }
        
        res.status(200).json({ 
            message: "Workout session updated successfully", 
            session: updatedSession 
        });
    } catch (error) {
        console.error("🔥 ERROR:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});

// UPDATE: Update session status and attendance
router.patch("/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { Status, Attendance } = req.body;
        
        if (Status && !['pending', 'completed', 'cancelled'].includes(Status)) {
            return res.status(400).json({ 
                message: "Invalid status. Must be 'pending', 'completed', or 'cancelled'" 
            });
        }
        
        const updateData = {};
        if (Status) updateData.Status = Status;
        if (Attendance !== undefined) updateData.Attendance = Attendance;
        
        const updatedSession = await WorkoutSession.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!updatedSession) {
            return res.status(404).json({ message: "Workout session not found" });
        }
        
        res.status(200).json({ 
            message: "Session updated successfully", 
            session: updatedSession 
        });
    } catch (error) {
        console.error("🔥 ERROR:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});

// UPDATE: Add progress to a workout session
router.patch("/:id/progress", async (req, res) => {
    try {
        const { id } = req.params;
        const progressData = req.body;
        
        const session = await WorkoutSession.findById(id);
        
        if (!session) {
            return res.status(404).json({ message: "Workout session not found" });
        }
        
        session.Progress.push(progressData);
        await session.save();
        
        res.status(200).json({ 
            message: "Progress added successfully", 
            session 
        });
    } catch (error) {
        console.error("🔥 ERROR:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});

// DELETE: Delete a workout session
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSession = await WorkoutSession.findByIdAndDelete(id);
        
        if (!deletedSession) {
            return res.status(404).json({ message: "Workout session not found" });
        }
        
        res.status(200).json({ 
            message: "Workout session deleted successfully", 
            session: deletedSession 
        });
    } catch (error) {
        console.error("🔥 ERROR:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});

// Get Member Stats - Quick summary
router.get("/stats/member/:memberId", async (req, res) => {
    try {
        const { memberId } = req.params;
        
        const totalSessions = await WorkoutSession.countDocuments({ Member_ID: memberId });
        const completedSessions = await WorkoutSession.countDocuments({ 
            Member_ID: memberId, 
            Status: 'completed' 
        });
        const upcomingSessions = await WorkoutSession.countDocuments({
            Member_ID: memberId,
            Session_DateTime: { $gt: new Date() },
            Status: { $ne: 'cancelled' }
        });
        
        res.status(200).json({
            totalSessions,
            completedSessions,
            upcomingSessions
        });
    } catch (error) {
        console.error("🔥 ERROR:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});

module.exports = router;