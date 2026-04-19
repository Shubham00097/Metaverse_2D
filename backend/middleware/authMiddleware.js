import jwt from "jsonwebtoken";
import User from "../models/user-model.js";

const authMiddleware = async (req, res, next) => {
  try {
    // 🍪 get token from cookie or Authorization header
    let token = req.cookies.token;

    if (!token && req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    // 🔐 verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 👤 find user
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // attach user to request
    req.user = user;

    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;