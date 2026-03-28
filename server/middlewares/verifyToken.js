
import jwt from "jsonwebtoken";

export default function(req, res, next) {
    // Get token from the header
    const token = req.header('x-auth-token');

    // Check if no token exists
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Adds user ID and Role to the request object
        next(); // Move on to the next function (e.g., accessing the dashboard)
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
