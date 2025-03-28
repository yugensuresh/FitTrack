const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const workoutRoutes = require("./routes/workouts"); // ✅ Import routes

const app = express();

app.use(cors());
app.use(express.json()); // ✅ Ensure JSON body parser is used
app.use("/api/workout", workoutRoutes); // ✅ Mount routes with correct prefix

mongoose
    .connect("mongodb://127.0.0.1:27017/your_database_name", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

app.listen(8070, () => console.log("🚀 Server running on port 8070"));
