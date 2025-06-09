const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskCategorySchema = new Schema({
  categoryId: { type: String, required: true, unique: true }, // UUID chuỗi
  name: { type: String, required: true, maxlength: 100 },
  description: { type: String, default: null },
  parentCategoryId: { type: String, default: null }, // Tham chiếu đệ quy
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TaskCategory', taskCategorySchema);
