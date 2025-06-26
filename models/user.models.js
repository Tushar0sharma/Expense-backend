import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilepic:{
        type:String,
    },
    verificationToken:{
        type:String,
    },
    verified:{
        type:Boolean,
        default:false
    },
    fcmToken:{
        type:String,
        default:null
    },
    otp:String,
    otpExpiry:Date
},{timestamps:true});

const User=mongoose.model("User",userSchema);
export default User;
