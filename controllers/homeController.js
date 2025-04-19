// D:\DACNTT\controllers\homeController.js
exports.getHome = (req, res) => {
    res.render('home/index', {
        title: 'Trang chủ',
        user: req.user,  // Đảm bảo rằng middleware đã cung cấp thông tin người dùng
        success: req.flash('success')  // Kiểm tra nếu có thông báo thành công
    });
};
