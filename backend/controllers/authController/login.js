import User from "../../models/user-model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ✅ validation
        if (!email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        // ✅ check user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // ✅ compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // ✅ generate JWT
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
        res.status(200).json({
            message: "Login successful",
            userId: user._id,
            token: token // Return token for fallback storage
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
}

export default login;
