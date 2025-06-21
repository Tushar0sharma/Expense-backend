import mongoose from "mongoose";

const transactionSchema=new mongoose.Schema({
    type: {
        type: String,
        enum: ['income', 'expense'], 
        required: true,
      },
    amount: {
        type: Number,
        required:true
      }, category: {
        type: String,
      },
      date: {
        type: Date,
        required: true,
      },
      description: {
        type: String,
      },
      image: {
        type: String, 
      },
      uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      walletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wallet",
        required: true,
      },
    },
    { timestamps: true }
  )

const Transaction=mongoose.model("Transaction",transactionSchema)
export default Transaction;