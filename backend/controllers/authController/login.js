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
        res.cookie("token", token, {
            httpOnly: true,   // cannot access via JS (security)
            secure: false,    // true in production (https)
            sameSite: "lax"
        });
        res.status(200).json({
            message: "Login successful",
            userId: user._id
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
}

export default login;
