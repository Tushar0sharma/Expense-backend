import Transaction from "../models/Transaction.models.js";
import Wallet from "../models/wallet.model.js";

export const createWallet=async(req,res)=>{
    try{
        console.log("Uploaded to Cloudinary:", req.file);
        const { name, uid, amount, totalIncome, totalExpenses } = req.body;
        let image=req.file?.path;
        console.log(image);
        

        const newwallet=new Wallet({
            name,
            uid,
            amount,
            totalIncome,
            totalExpenses,
            image,
        });
        await newwallet.save();
        res.status(201).json(newwallet);
    }
    catch(err){
        res.status(500).json({message:"Error Creating wallet",err})
    }
}
export const updateWallet=async(req,res)=>{
    try{
        // console.log("Uploaded to Cloudinary:", req.file);
        const { name, uid, amount, totalIncome, totalExpenses } = req.body;
        let image=req.file?.path;
        console.log(image);
        const id=req.params.walletid
        

        const updateData = {
            name,
            uid,
            amount,
            totalIncome,
            totalExpenses,
          };
      
          if (image) {
            updateData.image = image;
          }
          console.log("ife",id);
          
          const updatedWallet = await Wallet.findByIdAndUpdate(id, updateData, {
            new: true,
          });
          if (!updatedWallet) {
            return res.status(404).json({ message: "Wallet not found" });
          }
          console.log("Sending response", updatedWallet);
        return res.status(201).json(updatedWallet);

        // res.status(201).json(updatedWallet);
    }
    catch(err){
        // console.log("Update error:", err);
  return res.status(500).json({ message: "Error updating wallet", error: err.message });
    }
}
export const getuserwallets=async(req,res)=>{
    try{
        const {userid}=req.params;
        const wallets=await Wallet.find({uid:userid}).sort({createdAt:-1})
        res.status(200).json(wallets)
    }
    catch(err){
        res.status(500).json({message:"Error fetching wallets",err})
    }
}

export const deletewallet=async(req,res)=>{
    try{
        const {walletid}=req.params

        const deletewallet=await Wallet.findByIdAndDelete(walletid);

        if(!deletewallet) return res.status(404).json({message:"Wallet not found"})
            const deletetransactions=await Transaction.deleteMany({walletId:walletid})
            res.status(200).json({ message: "Wallet deleted successfully", wallet: deletewallet,deletedTransactions: deletetransactions });
    } catch (err) {
      console.error("Error deleting wallet:", err);
      res.status(500).json({ message: "Failed to delete wallet", error: err });
    }
}