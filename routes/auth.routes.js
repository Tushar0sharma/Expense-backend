import { login, register } from '../controllers/auth.controllers.js';
import express from "express"
export const authrouter=express.Router();

authrouter.post('/register',register)
authrouter.post('/login',login)
