//D:\DACNTT\constants\index.js
const Role = Object.freeze({
    ADMIN: 'ADMIN',
    DEPT_HEAD: 'DEPT_HEAD',       // Trưởng Khoa
    DEPUTY_HEAD: 'DEPUTY_HEAD',   // Phó Trưởng Khoa
    DIVISION_HEAD: 'DIVISION_HEAD', // Trưởng Bộ Môn
    COORDINATOR: 'COORDINATOR',   // Điều phối viên
    LECTURER: 'LECTURER',         // Giảng Viên
    STAFF: 'STAFF',               // Nhân Viên
    USER: 'USER'                 // Người Dùng
});

// Position definitions
const Position = Object.freeze({
    DEPT_HEAD: 'DEPT_HEAD',       // Trưởng Khoa
    DEPUTY_HEAD: 'DEPUTY_HEAD',   // Phó Trưởng Khoa
    DIVISION_HEAD: 'DIVISION_HEAD', // Trưởng Bộ Môn
    COORDINATOR: 'COORDINATOR',   // Điều phối viên
    LECTURER: 'LECTURER',         // Giảng Viên
    STAFF: 'STAFF',               // Nhân Viên
    USER: 'USER'                 // Người Dùng
});

// User status definitions
const UserStatus = Object.freeze({
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    PENDING: 'PENDING',
    LOCKED: 'LOCKED'
});
const Permission = Object.freeze({
    // Quản lý người dùng
    USER_CREATE: 'USER_CREATE',
    USER_UPDATE: 'USER_UPDATE',
    USER_DELETE: 'USER_DELETE',
    USER_VIEW: 'USER_VIEW',

    // Phân quyền và tổ chức
    ROLE_ASSIGN: 'ROLE_ASSIGN',
    DEPARTMENT_MANAGE: 'DEPARTMENT_MANAGE',

    // Quản lý công việc
    TASK_CREATE: 'TASK_CREATE',
    TASK_ASSIGN: 'TASK_ASSIGN',
    TASK_PROGRESS_UPDATE: 'TASK_PROGRESS_UPDATE',
    TASK_EVALUATE: 'TASK_EVALUATE',
    TASK_VIEW: 'TASK_VIEW',

    // Đề nghị và phê duyệt gia hạn
    EXTEND_REQUEST: 'EXTEND_REQUEST',
    EXTEND_APPROVE: 'EXTEND_APPROVE',
    EXTEND_VIEW: 'EXTEND_VIEW',

    // Đánh giá công việc
    EVALUATION_SUBMIT: 'EVALUATION_SUBMIT',
    EVALUATION_REVIEW: 'EVALUATION_REVIEW',
    EVALUATION_STATISTIC: 'EVALUATION_STATISTIC',

    // Quản lý báo cáo & file đính kèm
    REPORT_UPLOAD: 'REPORT_UPLOAD',
    REPORT_VIEW: 'REPORT_VIEW',

    // Thống kê và báo cáo
    DASHBOARD_VIEW: 'DASHBOARD_VIEW',
    STATISTICS_VIEW: 'STATISTICS_VIEW',

    // Thông báo
    NOTIFICATION_SEND: 'NOTIFICATION_SEND',
    NOTIFICATION_VIEW: 'NOTIFICATION_VIEW'
});

module.exports = {
    Role,
    Position,
    UserStatus,
    Permission
};
