// constants/index.js
const Role = Object.freeze({
    ADMIN: 'ADMIN',
    DEPT_HEAD: 'DEPT_HEAD',
    DEPUTY_HEAD: 'DEPUTY_HEAD',
    DIVISION_HEAD: 'DIVISION_HEAD',
    COORDINATOR: 'COORDINATOR',
    STAFF: 'STAFF',
    USER: 'USER'
});

const UserStatus = Object.freeze({
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    PENDING: 'PENDING',
    LOCKED: 'LOCKED'
});

const Position = Object.freeze({
    DEPT_HEAD: 'DEPT_HEAD',
    DEPUTY_HEAD: 'DEPUTY_HEAD',
    DIVISION_HEAD: 'DIVISION_HEAD',
    LECTURER: 'LECTURER',
    STAFF: 'STAFF',
    USER: 'USER'
});

module.exports = {
    Role,
    UserStatus,
    Position
};

// models/user.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { UserStatus } = require('../constants');

const UserSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true, maxlength: 50 },
    password: { type: String, required: true },
    fullName: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    avatar: { type: String },
    status: { type: String, enum: Object.values(UserStatus), default: UserStatus.PENDING },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastLogin: { type: Date }
});

module.exports = mongoose.model('User', UserSchema);

// seed/user.json
{
    "userId": "USR-001",
        "username": "jdoe",
            "password": "$2b$10$abc123hashed",
                "fullName": "John Doe",
                    "email": "john.doe@example.com",
                        "phone": "0912345678",
                            "avatar": "/uploads/avatar1.jpg",
                                "status": "ACTIVE",
                                    "createdAt": "2024-01-01T08:00:00Z",
                                        "updatedAt": "2024-01-01T08:00:00Z",
                                            "lastLogin": "2024-04-01T10:00:00Z"
}

// models/role.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Role } = require('../constants');

const RoleSchema = new Schema({
    roleId: { type: String, required: true, unique: true },
    roleName: {
        type: String,
        enum: Object.values(Role),
        required: true,
        unique: true
    },
    description: { type: String },
    permissions: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Role', RoleSchema);

// seed/role.json
{
    "roleId": "ROLE-ADMIN",
        "roleName": "ADMIN",
            "description": "Quản trị viên toàn hệ thống",
                "permissions": ["MANAGE_USERS", "VIEW_REPORTS"],
                    "createdAt": "2024-01-01T08:00:00Z",
                        "updatedAt": "2024-01-01T08:00:00Z"
}

// models/taskAssignment.model.js
const TaskAssignmentSchema = new Schema({
    assignmentId: { type: String, required: true, unique: true },
    taskId: { type: String, ref: 'Task', required: true },
    assigneeId: { type: String, required: true },
    assigneeType: { type: String, enum: ['User', 'Group'], required: true },
    assignedById: { type: String, ref: 'User' },
    assignedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TaskAssignment', TaskAssignmentSchema);

// seed/taskAssignment.json
{
    "assignmentId": "ASSIGN-001",
        "taskId": "TASK-001",
            "assigneeId": "USR-001",
                "assigneeType": "User",
                    "assignedById": "USR-002",
                        "assignedDate": "2025-04-22T08:00:00Z"
}

// models/taskProgress.model.js
const TaskProgressSchema = new Schema({
    progressId: { type: String, required: true, unique: true },
    taskId: { type: String, ref: 'Task', required: true },
    reportedById: { type: String, ref: 'User', required: true },
    progressPercentage: { type: Number, min: 0, max: 100 },
    description: { type: String },
    attachment: { type: String },
    reportDate: { type: Date, default: Date.now },
    issues: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TaskProgress', TaskProgressSchema);

// seed/taskProgress.json
{
    "progressId": "PROG-001",
        "taskId": "TASK-001",
            "reportedById": "USR-001",
                "progressPercentage": 80,
                    "description": "Đã hoàn thành slide thuyết trình.",
                        "attachment": "/files/slide.pdf",
                            "reportDate": "2025-04-25T09:00:00Z",
                                "issues": "Chưa nhận được phản hồi từ chuyên gia."
}

// models/evaluation.model.js
const EvaluationSchema = new Schema({
    evaluationId: { type: String, required: true, unique: true },
    taskId: { type: String, ref: 'Task', required: true },
    evaluatorId: { type: String, ref: 'User', required: true },
    rating: {
        type: String,
        enum: ['NotCompleted', 'Weak', 'Completed', 'Active', 'Good', 'Excellent']
    },
    comment: { type: String },
    improvementSuggestions: { type: String },
    evaluationDate: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Evaluation', EvaluationSchema);

// seed/evaluation.json
{
    "evaluationId": "EVAL-001",
        "taskId": "TASK-001",
            "evaluatorId": "USR-003",
                "rating": "Good",
                    "comment": "Công việc được thực hiện đúng hạn và đầy đủ.",
                        "improvementSuggestions": "Tăng cường giao tiếp nội bộ.",
                            "evaluationDate": "2025-05-01T10:00:00Z"
}
// models/group.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const GroupSchema = new Schema({
    groupId: { type: String, required: true, unique: true },
    name: { type: String, required: true, maxlength: 100 },
    description: { type: String },
    purpose: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    departmentId: { type: String, ref: 'Department' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Group', GroupSchema);

// seed/group.json
{
    "groupId": "GRP-001",
        "name": "Nhóm Nghiên cứu AI",
            "description": "Nhóm nghiên cứu ứng dụng AI trong giáo dục",
                "purpose": "Tạo môi trường học thuật và nghiên cứu",
                    "startDate": "2025-01-15T00:00:00Z",
                        "endDate": null,
                            "departmentId": "DEPT-KTPM",
                                "createdAt": "2025-01-10T08:00:00Z",
                                    "updatedAt": "2025-01-10T08:00:00Z"
}

// models/groupMember.model.js
const GroupMemberSchema = new Schema({
    groupId: { type: String, ref: 'Group', required: true },
    userId: { type: String, ref: 'User', required: true },
    role: { type: String, maxlength: 50 },
    joinDate: { type: Date },
    isActive: { type: Boolean, default: true }
}, { _id: false });

GroupMemberSchema.index({ groupId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('GroupMember', GroupMemberSchema);

// seed/groupMember.json
{
    "groupId": "GRP-001",
        "userId": "USR-001",
            "role": "Trưởng nhóm",
                "joinDate": "2025-01-15T08:00:00Z",
                    "isActive": true
}

// models/resource.model.js
const ResourceSchema = new Schema({
    resourceId: { type: String, required: true, unique: true },
    name: { type: String, required: true, maxlength: 100 },
    type: { type: String, enum: ['Room', 'Equipment', 'Software'], required: true },
    description: { type: String },
    location: { type: String },
    specifications: { type: String },
    status: { type: String, enum: ['Available', 'InUse', 'Maintenance', 'Unavailable'], default: 'Available' },
    managedById: { type: String, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', ResourceSchema);

// seed/resource.json
{
    "resourceId": "RES-001",
        "name": "Phòng họp A101",
            "type": "Room",
                "description": "Phòng họp lớn có máy chiếu",
                    "location": "Tòa nhà A, tầng 1",
                        "specifications": "Sức chứa 30 người, có điều hòa",
                            "status": "Available",
                                "managedById": "USR-004",
                                    "createdAt": "2025-01-01T08:00:00Z",
                                        "updatedAt": "2025-01-01T08:00:00Z"
}

// models/notification.model.js
const NotificationSchema = new Schema({
    notificationId: { type: String, required: true, unique: true },
    userId: { type: String, ref: 'User', required: true },
    type: { type: String, enum: ['TaskAssignment', 'Reminder', 'StatusUpdate', 'Approval', 'Comment'], required: true },
    content: { type: String },
    relatedEntityId: { type: String },
    relatedEntityType: { type: String },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);

// seed/notification.json
{
    "notificationId": "NOTI-001",
        "userId": "USR-001",
            "type": "TaskAssignment",
                "content": "Bạn được phân công công việc: Tổ chức seminar học kỳ",
                    "relatedEntityId": "TASK-001",
                        "relatedEntityType": "Task",
                            "isRead": false,
                                "createdAt": "2025-04-22T08:30:00Z"
}
// models/document.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const DocumentSchema = new Schema({
    documentId: { type: String, required: true, unique: true },
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String },
    filePath: { type: String, required: true },
    fileSize: { type: Number },
    fileType: { type: String },
    uploadedById: { type: String, ref: 'User', required: true },
    taskId: { type: String, ref: 'Task' },
    groupId: { type: String, ref: 'Group' },
    tags: [{ type: String }],
    versionNumber: { type: String },
    accessPermissions: { type: Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', DocumentSchema);

// seed/document.json
{
    "documentId": "DOC-001",
        "title": "Kế hoạch tổ chức seminar học kỳ",
            "description": "Chi tiết nội dung và lịch trình seminar",
                "filePath": "/docs/seminar-plan.pdf",
                    "fileSize": 152043,
                        "fileType": "application/pdf",
                            "uploadedById": "USR-001",
                                "taskId": "TASK-001",
                                    "groupId": "GRP-001",
                                        "tags": ["seminar", "học kỳ", "kế hoạch"],
                                            "versionNumber": "1.0",
                                                "accessPermissions": {
        "read": ["USR-001", "USR-002"],
            "edit": ["USR-001"]
    },
    "createdAt": "2025-04-22T10:00:00Z",
        "updatedAt": "2025-04-22T10:00:00Z"
}
