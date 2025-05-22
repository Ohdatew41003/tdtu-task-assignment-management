// controllers/extensionController.js

// Demo dữ liệu tạm thời. Trong thực tế, bạn sẽ truy vấn từ CSDL.
const extensionRequests = []; // Danh sách yêu cầu gia hạn (demo)

exports.getExtensionRequestPage = (req, res) => {
    const userId = req.user.userId;

    // Giả sử hệ thống lấy 1 task được giao cho người dùng hiện tại
    const task = {
        taskId: "4c57f3e3-9259-4c81-833d-f6a1ab0cad57",
        title: "Tổ chức hội thảo chuyên đề",
        description: "Chuẩn bị và tổ chức hội thảo chuyên đề về công nghệ AI",
        startDate: new Date(1746662400000),  // Ví dụ: 06/07/2025
        endDate: new Date(1747267200000),    // Ví dụ: 13/07/2025
        deadlineType: "Soft",
        isRecurring: false,
        recurringPattern: null
    };

    // Giả sử có một bản ghi assignment của người dùng cho task này
    const assignment = {
        assignedDate: new Date(1747563660000)
    };

    // Lấy lịch sử yêu cầu gia hạn của user (demo)
    const history = extensionRequests.filter(r => r.userId === userId);

    res.render('extension_request_form', {
        title: 'Yêu cầu gia hạn công việc',
        user: req.user,
        task,
        assignment,
        history,
        formatDate: function (date) {
            return new Date(date).toLocaleString();
        }
    });
};

exports.postExtensionRequest = (req, res) => {
    const userId = req.user.userId;
    const { currentDeadline, proposedDeadline, reason, currentProgress, plan } = req.body;

    // Tạo yêu cầu gia hạn mới (demo lưu tạm vào mảng)
    extensionRequests.push({
        id: Date.now().toString(),
        userId,
        currentDeadline,
        proposedDeadline,
        reason,
        currentProgress,
        plan,
        status: 'Chờ phê duyệt',
        date: new Date().toLocaleString()
    });

    // TODO: Gửi thông báo tới người phê duyệt

    res.redirect('/extension/request');
};

exports.getApprovalPage = (req, res) => {
    // Lấy tất cả yêu cầu gia hạn có trạng thái "Chờ phê duyệt" (demo)
    const pendingRequests = extensionRequests.filter(r => r.status === 'Chờ phê duyệt');

    res.render('extension_approve', {
        title: 'Phê duyệt yêu cầu gia hạn',
        requests: pendingRequests,
        formatDate: function (date) {
            return new Date(date).toLocaleString();
        }
    });
};

exports.postApproval = (req, res) => {
    const { id } = req.params;
    const { action, comment } = req.body; // action: 'approve' hoặc 'reject'

    const request = extensionRequests.find(r => r.id === id);
    if (!request) return res.status(404).send('Không tìm thấy yêu cầu');

    if (action === 'approve') {
        request.status = 'Đã phê duyệt';
        request.comment = comment || '';
    } else if (action === 'reject') {
        request.status = 'Bị từ chối';
        request.comment = comment || '';
    } else {
        return res.status(400).send('Hành động không hợp lệ');
    }

    // TODO: Gửi thông báo cho người đề nghị

    res.redirect('/extension/approve');
};
