import express from 'express'
import upload from '../utils/multer.mjs'
import { updateuser } from '../controllers/user.controller.js'
export const userrouter=express.Router()

userrouter.put('/update'
,upload.single('profilepic'),updateuser)
