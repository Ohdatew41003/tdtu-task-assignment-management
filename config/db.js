//D:\DACNTT\config\db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);  // Thoát ứng dụng nếu kết nối thất bại
  }
};

module.exports = connectDB;
