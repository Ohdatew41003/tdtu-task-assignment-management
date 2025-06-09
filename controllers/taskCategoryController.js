const TaskCategory = require('../models/TaskCategory');
const { v4: uuidv4 } = require('uuid');

exports.createTaskCategory = async (req, res) => {
    try {
        const newCategory = new TaskCategory({
            ...req.body,
            categoryId: uuidv4(),  // Tạo UUID cho categoryId
        });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllTaskCategories = async (req, res) => {
    try {
        const categories = await TaskCategory.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTaskCategoryById = async (req, res) => {
    try {
        const category = await TaskCategory.findOne({ categoryId: req.params.id });
        if (!category) return res.status(404).json({ message: "Không tìm thấy loại công tác" });
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTaskCategory = async (req, res) => {
    try {
        const updatedCategory = await TaskCategory.findOneAndUpdate(
            { categoryId: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedCategory) return res.status(404).json({ message: "Không tìm thấy loại công tác" });
        res.json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteTaskCategory = async (req, res) => {
    try {
        const deletedCategory = await TaskCategory.findOneAndDelete({ categoryId: req.params.id });
        if (!deletedCategory) return res.status(404).json({ message: "Không tìm thấy loại công tác" });
        res.json({ message: "Đã xóa loại công tác" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
