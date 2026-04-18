import User from "../../models/user-model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;

    // ✅ validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar: avatar || "#6366f1"
    });

    // 🔐 JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction, // true for production (HTTPS), false for local (HTTP)
      sameSite: isProduction ? "none" : "lax", // none for cross-site prod, lax for local
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      message: "User created successfully",
      userId: user._id
    });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    
    // Check for Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    // Check for MongoDB duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    res.status(500).json({ message: "Server error: " + err.message });
  }
};

export default signup;