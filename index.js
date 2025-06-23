import express from 'express'
import bodyparser from 'body-parser'
import mongoose from 'mongoose'
import User from './models/user.models.js'
import { authrouter } from './routes/auth.routes.js';
import dotenv from 'dotenv'
dotenv.config()
import cron from "node-cron"
const app=express();
import { userrouter } from './routes/user.routes.js';
import walletrouter from './routes/wallet.routes.js';
import transactionrouter from './routes/Transaction.routes.js';
import { pingrouter } from './routes/ping.routes.js';
import { use } from 'react';
import Transaction from './models/Transaction.models.js';
import {admin} from './firebaseAdmin.js'
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

app.post('/api/save-fcm-token', async (req, res) => {
    try {
      const { userId, fcmToken } = req.body;
    //   console.log("Incoming data:", req.body);
  
      if (!userId || !fcmToken) {
        return res.status(400).json({ error: "Missing userId or fcmToken" });
      }
  
      const user = await User.findByIdAndUpdate(userId, { fcmToken }, { new: true });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      return res.status(200).json({ message: "FCM token saved successfully" });
    } catch (err) {
      console.error("Server error while saving FCM token:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  
  cron.schedule ('0 10 * * *',async()=>{
    console.log('⏰ Running scheduled job: 10 AM daily');
    try{
      const users = await User.find({ fcmToken: { $ne: null } });

        const now=new Date()
        const start=new Date(now)
        start.setDate(start.getDate()-1)
        start.setHours(0,0,0,0)

        const end=new Date(start)
        end.setHours(23,59,59,999)

        for (const user of users){
          const transaction=await Transaction.find({
            userId:user._id,
            createdAt:{$gte:start,$lte:end},
          })
        // }

        const total = transaction.reduce((sum, txn) => {
  if (txn.type === 'expense') {
    return sum + txn.amount;
  }
  return sum;
}, 0);

const income = transaction.reduce((sum, txn) => {
  if (txn.type === 'income') {
    return sum + txn.amount;
  }
  return sum;
}, 0);

          
            
        const message = {
          token: user.fcmToken,
          notification: {
            title: '🧾 Yesterday\'s Summary',
            body: `You spent ₹${total} and earnt ₹${income} on ${start.toDateString()}`,
          },
        };
    
        try {
          await admin.messaging().send(message);
          console.log(`✅ Notification sent to ${user.email} `);
        } catch (err) {
          console.error(`❌ Failed for ${user.email}:`, err);
        }
      }
    }
    catch (error) {
      console.error('Error sending notification:', error);
      res.status(500).json({ error: 'Failed to send notification' });
    }
  })
