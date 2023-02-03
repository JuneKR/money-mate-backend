import express from "express";
import {
    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser
} from "../controllers/Users";
import { verifyUser, requireAdmin } from '../middleware/AuthUser';

const router = express.Router();

router.get('/users', verifyUser, requireAdmin, getUsers);
router.get('/users/:id', verifyUser, requireAdmin, getUserById);
router.post('/users', verifyUser, requireAdmin, createUser);
router.patch('/users/:id', verifyUser, requireAdmin, updateUser);
router.delete('/users/:id', verifyUser, requireAdmin, deleteUser);

export default router;