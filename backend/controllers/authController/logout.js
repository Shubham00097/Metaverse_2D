const logout = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        console.error("LOGOUT ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
}

export default logout;