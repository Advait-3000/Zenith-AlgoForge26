const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Example of a Protected Route using the Middleware
router.get('/dashboard', authMiddleware, (req, res) => {
    res.json({ message: `Welcome User ID: ${req.user.id}, Role: ${req.user.role}` });
});

module.exports = router;