import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
dotenv.config()
const secretKey = process.env.JWT_SECRET

export const authenticate=(req,res,next)=>{
    const token=req.headers.authorization?.split(' ')[1];
    if(!token) return res.status(401).json({message:"No token Provided"})

    try{
        const decoded=jwt.verify(token,secretKey);
        req.userid=decoded.id;
        next();
    }
    catch(err){
        return res.status(401).json({message:"Invalid token"})
    }
}