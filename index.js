import express from 'express'
import bodyparser from 'body-parser'
import mongoose from 'mongoose'
import User from './models/user.models.js'
import { authrouter } from './routes/auth.routes.js';
import dotenv from 'dotenv'
dotenv.config()
const app=express();
import { userrouter } from './routes/user.routes.js';
import walletrouter from './routes/wallet.routes.js';
import transactionrouter from './routes/Transaction.routes.js';
import { pingrouter } from './routes/ping.routes.js';
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

mongoose.connect(process.env.MONGODB_CONN).then(()=>{
    console.log("Database Connected");
}).catch((err)=>{
    console.log("Error connecting to the db",err);
})

app.listen(process.env.PORT,'0.0.0.0',()=>{
    console.log("server is listening on ",process.env.PORT);  
})

app.use('/api/auth',authrouter)
app.use('/api/user',userrouter)
app.use('/api/wallet',walletrouter)
app.use('/api/transaction',transactionrouter)
app.use('/api',pingrouter)

app.get("/verify/:token",async(req,res)=>{
    try{
        const token=req.params.token;
        const user=await User.findOne({verificationToken:token})
        if(!user){
            return res.status(404).json({message:"Invalid Token"});
        }

        user.verified=true;
        user.verificationToken=undefined;
        await user.save();
        res.status(200).json({message:"Email Verified Successfully"})

    }catch(error){
        console.log("error getting token",error);
        res.status(500).json({message:"Email Verification Failed"})
    }
})

app.post('/api/save-fcm-token',async(req,res)=>{
    try{
        const {userId,fcmToken}=req.bodyparser
        if(!userId || !fcmToken) return res.status(400).json({error:"Missing userid or fcmtoken"})

        const user=await User.findByIdAndUpdate(userId,{fcmToken},{new:true});

        if(!user)      { return res.status(404).json({ error: 'User not found' });}
        return res.status(200).json({message:"FCM token saved successfully"})

    }catch(err){
        console.log(err);
        res.status(500).json({error:"Internal server error"});
    }
})
