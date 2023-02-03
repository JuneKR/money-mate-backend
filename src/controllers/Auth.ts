import Users from "../models/UserModel";
import argon2 from "argon2";
import { Request, Response } from "express";

declare module "express-session" {
    interface SessionData {
      userId: string;
      is_admin: boolean;
    }
}

export const registerUser = async(req: Request, res: Response) => {
    const {first_name, last_name, date_of_birth, username, password, confPassword } = req.body;
    if (password !== confPassword) {
        return res.status(400).json({msg: "Password and Confirm Password do not match"});
    }
    const hashPassword = await argon2.hash(password);
    try {
        await Users.create({
            first_name: first_name,
            last_name: last_name,
            date_of_birth: date_of_birth,
            username: username,
            password: hashPassword,
            is_admin: false,
        });
        res.status(201).json({msg: "Successful Register"});
    } catch (error: any) {
        res.status(400).json({msg: error.message});
    }
}

export const login = async (req: Request, res: Response) => {
    const user = await Users.findOne({
        where: {
            username: req.body.username
        }
    });
    if (!user) {
        return res.status(404).json({ msg: "User not found" })
    }
    const match = await argon2.verify(user.password, req.body.password);
    if (!match) {
        return res.status(400).json({ msg: "Wrong Password" });
    }
    req.session.userId = user.user_id;
    const user_id = user.user_id;
    const first_name = user.first_name;
    const last_name = user.last_name;
    const username = user.username;
    const is_admin = user.is_admin
    res.status(200).json({ user_id, first_name, last_name, username, is_admin });
}

export const getUserProfile = async (req: Request, res: Response) => {

    if (!req.session.userId) {
        return res.status(401).json({ msg: "Please login to your account" });
    }
    const user = await Users.findOne({
        attributes: ['user_id', 'first_name', 'last_name', 'username', 'date_of_birth', 'is_admin'],
        where: {
            user_id: req.session.userId
        }
    })
    if (!user) {
        return res.status(404).json({ msg: "User not found" })
    }
    res.status(200).json(user);
}

export const logout = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(400).json({ msg: "Unable to logout" })
        }
        res.status(200).json({ msg: "Logout successful" })
    })
}