import mongoose from "mongoose";

const walletSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    amount: {
        type: Number,
        default: 0,
      },
      totalIncome: {
        type: Number,
        default: 0,
      },
      totalExpenses: {
        type: Number,
        default: 0,
      },
      image: {
        type: String, 
      },
      uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      created: {
        type: Date,
        default: Date.now,
      },
},{timestamps:true})

const Wallet=mongoose.model("Wallet",walletSchema)
export default Wallet;