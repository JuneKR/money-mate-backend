import argon2 from 'argon2';
import Users from '../models/UserModel';
import { Request, Response } from 'express';

export const createUser = async(req: Request, res: Response) => {
    const {first_name, last_name, date_of_birth, username, password, confPassword, is_admin} = req.body;
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
            is_admin: is_admin,
        });
        res.status(201).json({msg: "Successful Register"});
    } catch (error: any) {
        res.status(400).json({msg: error.message});
    }
}

export const getUsers = async(req: Request, res: Response) => {
    try {
        const response = await Users.findAll({
            attributes:['user_id','first_name','last_name','date_of_birth','username','is_admin']
        });
        res.status(200).json(response);
    } catch (error: any) {
        res.status(500).json({msg: error.message});
    }
}