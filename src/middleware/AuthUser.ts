import Users from "../models/UserModel";
import { Request, Response, NextFunction } from "express";

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.session.userId) {   
        return res.status(401).json({msg: "Please login to your account!"})
    }
    const user = await Users.findOne({
        where: {
            user_id: req.session.userId
        }
    });
    if(!user) {
        return res.status(404).json({msg: "User not found"})
    }
    
    req.sessionID = user.id;
    next();
}

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) =>{
    const user = await Users.findOne({
        where: {
            user_id: req.session.userId
        }
    });
    if(!user) return res.status(404).json({msg: "User not found"});
    if(!user.is_admin) return res.status(403).json({msg: "Forbidden Access"});
    next();
}