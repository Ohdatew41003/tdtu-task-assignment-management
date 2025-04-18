const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Middleware for JWT authentication
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // ...existing code for user validation...
    const user = { username }; // Replace with actual user data
    const accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ accessToken });
});

// Logout route
app.post('/logout', (req, res) => {
    // ...existing code for logout logic...
    res.sendStatus(200);
});

// User management routes
app.get('/users', authenticateToken, (req, res) => {
    // ...existing code to fetch users...
    res.json([]);
});

app.post('/users', authenticateToken, (req, res) => {
    // ...existing code to create a user...
    res.sendStatus(201);
});

// Role-based access control
function authorizeRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) return res.sendStatus(403);
        next();
    };
}

// Example route for role-based access
app.get('/department-head', authenticateToken, authorizeRole('department-head'), (req, res) => {
    res.send('Welcome, Department Head!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
