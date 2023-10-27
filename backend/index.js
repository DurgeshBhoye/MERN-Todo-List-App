const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// An instance of Express app
const app = express();
const port = 5050;

// Connect to the MongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/todolist", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// CORS for cross-origin requests
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Define the task schema
const TaskSchema = new mongoose.Schema({
    name: String,
    checked: {
        type: Boolean,
        default: false
    }
});

// Create the task model
const Task = mongoose.model("Task", TaskSchema);

// Route to retrieve tasks from the database
app.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to add a new task to the database
app.post("/api/task", async (req, res) => {
    try {
        const task = new Task({ name: req.body.task });
        await task.save();
        res.json({ success: true, id: task._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to update a task in the database
app.put("/api/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, {
            name: req.body.task,
        });
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to delete a task from the database
app.delete("/api/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to delete all tasks from the database
app.delete("/api/tasks", async (req, res) => {
    try {
        await Task.deleteMany({});
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to mark a task as checked or unchecked
app.put("/api/tasks/:id/checked", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        task.checked = req.body.checked;
        await task.save();

        res.json({ success: task.checked });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
