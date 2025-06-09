const TaskCategoryMapping = require('../models/TaskCategoryMapping');

exports.getAllTaskCategoryMappings = async (req, res) => {
    try {
        const mappings = await TaskCategoryMapping.find({});
        res.status(200).json(mappings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createTaskCategoryMapping = async (req, res) => {
    const { taskId, categoryId } = req.body;
    if (!taskId || !categoryId) {
        return res.status(400).json({ message: 'taskId và categoryId là bắt buộc' });
    }

    try {
        const existing = await TaskCategoryMapping.findOne({ taskId, categoryId });
        if (existing) {
            return res.status(400).json({ message: 'Mapping này đã tồn tại' });
        }

        const newMapping = new TaskCategoryMapping({ taskId, categoryId });
        await newMapping.save();
        res.status(201).json(newMapping);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
