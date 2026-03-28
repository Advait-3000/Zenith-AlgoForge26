import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // 1. Get the token from the request headers
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access Denied. No valid token currently provided."
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2. Cryptographically verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Inject the `id`, `email`, and `role` securely into the request pipeline
    req.user = decoded;

    // Continue down the chain to the AppWrapper Guards (`isDoctor`, etc.)
    next();

  } catch (error) {
    console.error("❌ JWT Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session token."
    });
  }
};

export default authMiddleware;