import express from "express";
import {
    registerUser,
    login,
    logout,
    getUserProfile
} from "../controllers/Auth";

const router = express.Router();

router.post('/register', registerUser);
router.get('/profile', getUserProfile);
router.post('/login', login);
router.delete('/logout', logout);

export default router;