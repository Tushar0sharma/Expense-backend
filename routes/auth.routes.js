import { login, register,verifyOtp } from '../controllers/auth.controllers.js';
import express from "express"
export const authrouter=express.Router();

authrouter.post('/register',register)
authrouter.post('/login',login)
authrouter.post('/verifyotp',verifyOtp)
