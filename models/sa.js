// models/user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Role, UserStatus, Position } = require('../constants');
const { v4: uuidv4 } = require('uuid');
const UserRole = require('./UserRole');
const RoleModel = require('./Role'); // đảm bảo đường dẫn đúng

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    username: {
        type: String,
        unique: true,
        required: true,
        maxlength: 50
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true,
        maxlength: 100
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: String,
    avatar: { type: String },
    status: {
        type: String,
        enum: Object.values(UserStatus),
        default: UserStatus.PENDING
    },
    lastLoginTime: Date,
    refreshToken: {
        type: String,
        default: null
    }
}, { timestamps: true }); // ✅ Tự động tạo createdAt và updatedAt

// Băm mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
    if (!this.userId) {
        this.userId = `USR-${uuidv4()}`;
    }
    // phần hash password giữ nguyên
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


userSchema.statics.createAdminIfNotExists = async function () {
    const adminRole = await RoleModel.findOne({ roleName: Role.ADMIN }); // Role.ADMIN là enum từ constants

    if (!adminRole) {
        throw new Error('Admin role chưa được tạo trong DB');
    }

    const adminUser = await this.findOne({ username: process.env.ADMIN_USERNAME || 'admin' });

    if (!adminUser) {
        const newAdminUser = new this({
            userId: `USR-${uuidv4()}`,
            username: process.env.ADMIN_USERNAME || 'admin',
            password: process.env.ADMIN_PASSWORD || 'admin',
            email: process.env.ADMIN_EMAIL || 'admin@gmail.com',
            fullName: 'System Administrator',
            phone: null,
            avatar: null,
            lastLoginTime: null,
            refreshToken: null,
            status: UserStatus.ACTIVE
        });

        await newAdminUser.save();

        const userRole = new UserRole({
            userId: newAdminUser.userId,
            roleId: adminRole.roleId,
            assignedDate: new Date(),
            expiryDate: null
        });

        await userRole.save();

        console.log('✅ Default admin account and role assignment created');
    } else {
        const adminUserRole = await UserRole.findOne({
            userId: adminUser.userId,
            roleId: adminRole.roleId
        });

        if (!adminUserRole) {
            const userRole = new UserRole({
                userId: adminUser.userId,
                roleId: adminRole.roleId,
                assignedDate: new Date(),
                expiryDate: null
            });
            await userRole.save();
            console.log('✅ Admin role assigned to existing admin user');
        }
    }
};

module.exports = mongoose.model('User', userSchema);
const RoleSchema = new Schema({
    roleId: { type: String, required: true, unique: true }, // UUID
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
}); const userRoleSchema = new Schema({
    userId: {
        type: String,  // UUID string
        required: true,
        ref: 'User'
    },
    roleId: {
        type: String,  // UUID string
        required: true,
        ref: 'Role'
    },
    assignedDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    expiryDate: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
const departmentSchema = new Schema({
        departmentId: { type: String, required: true, unique: true }, // UUID dạng chuỗi
        name: { type: String, required: true, maxlength: 100 },
        description: { type: String, default: null },
        parentDepartmentId: { type: String, default: null }, // Tham chiếu đệ quy, UUID chuỗi
        managerId: { type: String, default: null }, // Tham chiếu đến User UUID
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    });
    const userDepartmentSchema = new Schema({
        userId: { type: String, required: true }, // UUID chuỗi
        departmentId: { type: String, required: true }, // UUID chuỗi
        position: { type: String, required: true, maxlength: 100 },
        joinDate: { type: Date, required: true },
        isActive: { type: Boolean, default: true }
    });

    const taskSchema = new Schema({
        taskId: { type: String, required: true, unique: true }, // UUID chuỗi
        title: { type: String, required: true, maxlength: 200 },
        description: { type: String, required: true }, // text
        objective: { type: String, default: null },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        priority: {
            type: String,
            enum: ['Urgent', 'High', 'Medium', 'Low', 'Planned'],
            required: true
        },
        status: {
            type: String,
            enum: ['NotStarted', 'Assigned', 'InProgress', 'Completed', 'Paused', 'Cancelled'],
            required: true
        },
        isRecurring: { type: Boolean, default: false },
        recurringPattern: { type: Schema.Types.Mixed, default: null }, // JSON, có thể null
        createdById: { type: String, default: null }, // FK User, UUID
        departmentId: { type: String, default: null }, // FK Department, UUID
        deadlineType: {
            type: String,
            enum: ['Hard', 'Soft'],
            required: true
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    });
    const taskCategorySchema = new Schema({
        categoryId: { type: String, required: true, unique: true }, // UUID chuỗi
        name: { type: String, required: true, maxlength: 100 },
        description: { type: String, default: null },
        parentCategoryId: { type: String, default: null }, // Tham chiếu đệ quy
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    });
    const taskCategoryMappingSchema = new Schema({
        taskId: { type: String, required: true }, // UUID chuỗi, FK Task
        categoryId: { type: String, required: true } // UUID chuỗi, FK TaskCategory
    });
    const TaskAssignmentSchema = new Schema({
        assignmentId: { type: String, required: true, unique: true }, // UUID
        taskId: { type: String, ref: 'Task', required: true }, // UUID
        assigneeId: { type: String, required: true }, // UUID
        assigneeType: { type: String, enum: ['User', 'Group'], required: true },
        assignedById: { type: String, ref: 'User' }, // UUID
        assignedDate: { type: Date, default: Date.now }
    });
    const TaskProgressSchema = new Schema({
        progressId: { type: String, required: true, unique: true }, // UUID
        taskId: { type: String, ref: 'Task', required: true }, // UUID
        reportedById: { type: String, ref: 'User', required: true }, // UUID
        progressPercentage: { type: Number, min: 0, max: 100 },
        description: { type: String },
        attachment: { type: String },
        reportDate: { type: Date, default: Date.now },
        issues: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    });

    const EvaluationSchema = new Schema({
        evaluationId: { type: String, required: true, unique: true }, // UUID
        taskId: { type: String, ref: 'Task', required: true }, // UUID
        evaluatorId: { type: String, ref: 'User', required: true }, // UUID
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
    const ResourceSchema = new Schema({
        resourceId: { type: String, required: true, unique: true }, // UUID
        name: { type: String, required: true, maxlength: 100 },
        type: { type: String, enum: ['Room', 'Equipment', 'Software'], required: true },
        description: { type: String },
        location: { type: String },
        specifications: { type: String },
        status: { type: String, enum: ['Available', 'InUse', 'Maintenance', 'Unavailable'], default: 'Available' },
        managedById: { type: String, ref: 'User' }, // UUID
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    });
    const resourceBookingSchema = new Schema({
        bookingId: { type: String, required: true, unique: true }, // UUID

        resourceId: { type: String, required: true }, // FK Resource
        requestedById: { type: String, required: true }, // FK User
        taskId: { type: String, default: null }, // FK Task (nullable)

        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },

        purpose: { type: String, required: true }, // text

        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
            required: true,
            default: 'Pending'
        },

        approvedById: { type: String, default: null }, // FK User
        approvalDate: { type: Date, default: null },
        rejectionReason: { type: String, default: null },

        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    }); const GroupSchema = new Schema({
        groupId: { type: String, required: true, unique: true }, // UUID
        name: { type: String, required: true, maxlength: 100 },
        description: { type: String },
        purpose: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        departmentId: { type: String, ref: 'Department' }, // UUID hoặc chuỗi id tùy hệ thống
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    }); const GroupMemberSchema = new Schema({
        groupId: { type: String, ref: 'Group', required: true }, // UUID
        userId: { type: String, ref: 'User', required: true }, // UUID
        role: { type: String, maxlength: 50 },
        joinDate: { type: Date },
        isActive: { type: Boolean, default: true }
    }, { _id: false }); const DocumentSchema = new Schema({
        documentId: { type: String, required: true, unique: true }, // UUID
        title: { type: String, required: true },
        description: { type: String },
        filePath: { type: String, required: true },
        uploadedById: { type: String, ref: 'User', required: true }, // UUID
        uploadDate: { type: Date, default: Date.now },
        relatedTaskId: { type: String, ref: 'Task' } // UUID
    }); const NotificationSchema = new Schema({
        notificationId: { type: String, required: true, unique: true }, // UUID
        userId: { type: String, ref: 'User', required: true }, // UUID
        type: { type: String, enum: ['TaskAssignment', 'Reminder', 'StatusUpdate', 'Approval', 'Comment'], required: true },
        content: { type: String },
        relatedEntityId: { type: String },
        relatedEntityType: { type: String },
        isRead: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    });