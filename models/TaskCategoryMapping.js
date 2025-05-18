import mongoose from 'mongoose';
const { Schema } = mongoose;



const taskCategoryMappingSchema = new Schema({
    taskId: { type: String, required: true }, // UUID chuỗi, FK Task
    categoryId: { type: String, required: true } // UUID chuỗi, FK TaskCategory
});

// Đảm bảo cặp (taskId, categoryId) duy nhất
taskCategoryMappingSchema.index({ taskId: 1, categoryId: 1 }, { unique: true });

export const TaskCategoryMapping = mongoose.model('TaskCategoryMapping', taskCategoryMappingSchema);