import { deleteuser, forgotpass, login, register,setpass,verifyOtp,sendfeedbackemail } from '../controllers/auth.controllers.js';
import express from "express"
export const authrouter=express.Router();

authrouter.post('/register',register)
authrouter.post('/login',login)
authrouter.post('/verifyotp',verifyOtp)
authrouter.post('/forgotpass',forgotpass)
authrouter.post('/setpass',setpass)
authrouter.post('/sendfeedback',sendfeedbackemail)
authrouter.delete('/deleteuser',deleteuser)
