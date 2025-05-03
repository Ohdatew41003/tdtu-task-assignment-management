// utils/otp.js
const nodemailer = require('nodemailer');

// Hàm tạo mã OTP ngẫu nhiên
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000); // Tạo mã OTP 6 chữ số
};

// Hàm gửi OTP đến email người dùng
const sendOtpToUser = async (user, otpCode) => {
    // Cấu hình transporter để gửi email qua Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com', // Thay bằng email của bạn
            pass: 'your-email-password'   // Thay bằng mật khẩu email của bạn
        }
    });

    // Tạo nội dung email
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: user.email,
        subject: 'Mã OTP đăng nhập',
        text: `Mã OTP của bạn là: ${otpCode}`
    };

    // Gửi email
    await transporter.sendMail(mailOptions);
};

module.exports = { generateOtp, sendOtpToUser };
