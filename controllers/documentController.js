// controllers/documentController.js

const Document = require('../models/Document');

const getAllDocuments = async (req, res) => {
    try {
        const documents = await Document.find({});
        res.json(documents); // Trả về mảng documents
    } catch (error) {
        console.error('Lỗi khi lấy danh sách document:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách document' });
    }
};

module.exports = {
    getAllDocuments
};
