import express from 'express'
import { createWallet,deletewallet,getuserwallets, updateWallet } from '../controllers/wallet.controller.js'
import upload from '../utils/multer.mjs'
const walletrouter=express.Router()

walletrouter.post("/create",upload.single("image"),createWallet)
walletrouter.get("/user/:userid",getuserwallets);
walletrouter.put("/update/:walletid",upload.single("image"),updateWallet);
walletrouter.delete("/delete/:walletid",deletewallet)
export default walletrouter