const Task = require('../models/task');

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

const createTask = async (req, res) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findOneAndUpdate(
            { taskId: req.params.id },  // tìm theo taskId, không phải _id
            req.body,
            { new: true }
        );

        if (!updatedTask) return res.status(404).json({ message: "Không tìm thấy task" });
        res.json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ taskId: req.params.id });
        if (!deletedTask) return res.status(404).json({ message: "Không tìm thấy task" });
        res.json({ message: "Đã xóa task" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ taskId: req.params.id });
        if (!task) return res.status(404).json({ message: "Không tìm thấy task" });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// export theo kiểu CommonJS
module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskById
};
