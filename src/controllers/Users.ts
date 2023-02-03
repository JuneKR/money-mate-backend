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

export const getUserById = async(req: Request, res: Response) => {
    const user = await Users.findOne({
        where: {
            user_id: req.params.id
        }
    });

    /* Check User */
    if(!user) {
        return res.status(404).json({msg: "User not found"});
    }
    
    try {
        const response = await Users.findOne({
            attributes:['user_id','first_name','last_name','date_of_birth','username','is_admin'],
            where: {
                user_id: req.params.id,
            }
        });
        res.status(200).json(response);
    } catch (error: any) {
        res.status(500).json({msg: error.message});
    }
}

export const updateUser = async(req: Request, res: Response) => {
    const user = await Users.findOne({
        where: {
            user_id: req.params.id
        }
    });

    /* Check User */
    if(!user) {
        return res.status(404).json({msg: "User not found"});
    }

    /* Check Password */
    const {first_name, last_name, date_of_birth, username, password, confPassword, is_admin} = req.body;
    let hashPassword;
    if(password === "" || password === null) {
        hashPassword = user.password;
    } else {
        hashPassword = await argon2.hash(password);
    }
    if (password !== confPassword) {
        return res.status(400).json({msg: "Password and Confirm Password do not match"})
    }

    try {
        await Users.update({
            first_name: first_name,
            last_name: last_name,
            date_of_birth: date_of_birth,
            username: username,
            password: hashPassword
        }, {
            where:{
                // id: user.id
                user_id: req.params.id
            }
        });
        res.status(200).json({msg: "User Updated Successfully"})
    } catch (error: any) {
        return res.status(400).json({msg: error.message});
    }
}

export const deleteUser = async(req: Request, res: Response) => {
    const user = await Users.findOne({
        where: {
            user_id: req.params.id
        }
    });

    /* Check User */
    if(!user) {
        return res.status(404).json({msg: "User not found"});
    }

    try {
        await Users.destroy({
            where: {
                user_id: req.params.id
            }
        })
        res.status(200).json({msg: "User Deleted Successfully"})
    } catch (error: any) {
        return res.status(400).json({msg: error.message});
    }
}