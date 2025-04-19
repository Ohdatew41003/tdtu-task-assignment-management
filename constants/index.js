//D:\DACNTT\constants\index.js
const Role = Object.freeze({
    ADMIN: 'ADMIN',
    DEPARTMENT_HEAD: 'DEPARTMENT_HEAD',
    DEPUTY_HEAD: 'DEPUTY_HEAD',
    DIVISION_HEAD: 'DIVISION_HEAD',
    COORDINATOR: 'COORDINATOR',
    STAFF: 'STAFF'
});

// User status definitions
const UserStatus = Object.freeze({
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    PENDING: 'PENDING',
    LOCKED: 'LOCKED'
});

// Position definitions
const Position = Object.freeze({
    DEPARTMENT_HEAD: 'DEPARTMENT_HEAD',
    DEPUTY_HEAD: 'DEPUTY_HEAD',
    DIVISION_HEAD: 'DIVISION_HEAD',
    LECTURER: 'LECTURER',
    STAFF: 'STAFF'
});

module.exports = {
    Role,
    UserStatus,
    Position
};
