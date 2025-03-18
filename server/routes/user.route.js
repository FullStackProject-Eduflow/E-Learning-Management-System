import express from 'express';
import { register, login } from '../controllers/user.controller.js'; // ✅ Import register & login

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);

router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "User route is working!"
    });
});

// ✅ Export the router
export default router;