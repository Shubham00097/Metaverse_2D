import express from "express";
import signup from "../controllers/authController/signup.js";
import login from "../controllers/authController/login.js";
import logout from "../controllers/authController/logout.js";
import me from "../controllers/authController/me.js";
import updateAvatar from "../controllers/authController/updateAvatar.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, me);
router.put("/avatar", authMiddleware, updateAvatar);

export default router;