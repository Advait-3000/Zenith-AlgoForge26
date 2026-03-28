const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { hashPassword, verifyPassword } = require('../utils/cryptoUtils');

exports.registerUser = async (req, res) => {
    try {
        const { email, password, role, full_name } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Hash password using PBKDF2
        const { salt, hash } = hashPassword(password);

        // Create new user securely
        user = new User({
            email,
            password_hash: hash,
            password_salt: salt,
            role,
            full_name
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully.' });

    } catch (error) {
        res.status(500).send('Server error');
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

        // Verify password using PBKDF2
        const isMatch = verifyPassword(password, user.password_salt, user.password_hash);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        // Generate JWT Token
        const payload = { user: { id: user._id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, role: user.role });
        });

    } catch (error) {
        res.status(500).send('Server error');
    }
};
