const logout = (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === "production";
        res.clearCookie("token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax"
        });
        res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        console.error("LOGOUT ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
}

export default logout;