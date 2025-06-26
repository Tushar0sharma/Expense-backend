import User from "../models/user.models.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import dotenv from "dotenv"
dotenv.config()
const secretKey=process.env.JWT_SECRET;

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const otp=Math.floor(100000+Math.random()*900000).toString();
        const otpExpiry=Date.now()+5*60*1000;
        const existingUser = await User.findOne({ email });  
        if (existingUser) {
            if(!existingUser.verified) {
                sendverificationemail(existingUser.email,existingUser.otp);
                res.status(200).json({ message: "Registration successful" });
            }
            return res.status(400).json({ message: "User already exists" });
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword,otp,otpExpiry,verified:false }); 

        newUser.verificationToken=crypto.randomBytes(20).toString("hex");

        await newUser.save();

        sendverificationemail(newUser.email,newUser.otp);

        res.status(200).json({ message: "Registration successful" });
    } catch (error) {
        console.error("Error in register function:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const sendverificationemail=async(email,otp)=>{
    //create a nodemailer transporter

    const transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"tusharsharma.gemini@gmail.com",
            pass:process.env.EMAIL_PASS
        }
    })

    //compose email message

    const mailoptions={
        from:"Expense.com",
        to:email,
        subject:"Your Otp Code",
        text:`Your OTP code is: ${otp}. It expires in 5 minutes.`
    }

    try{
        await transporter.sendMail(mailoptions)
    }catch(error){
        console.log("error sending mail",error);
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        
        if(!user.verified){
             return res.status(400).json({ message: "User not Verified" });
        }
        

        const token=jwt.sign({
            _id:user._id,
            
        },secretKey)

        const newUser=user.toObject({getters:true})
        delete newUser.password


        res.status(200).json({ message: "Login successful",token,user:newUser });


    } catch (error) {
        console.error("Error in login function:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.verified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
