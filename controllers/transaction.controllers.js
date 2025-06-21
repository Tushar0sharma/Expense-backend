import Transaction from '../models/Transaction.models.js';

export const createtransaction = async (req, res) => {
  try {
    const {amount, type, category, date, description, walletId, uid, image} =
      req.body;
    if (!amount || !type || !date || !uid) {
      return res.status(400).json({message: 'Missing required fields'});
    }

    const transactiondata = {
      amount,
      type,
      category,
      date: new Date(date),
      description,
      uid,
      walletId,
      image,
    };
    
    if (req.file && req.file.path) {
      transactiondata.image = req.file.path;
    } else {
      transactiondata.image = '';
    }
    // console.log('Transaction data:', transactiondata);

    const newtransaction = await Transaction.create(transactiondata);

    return res.status(201).json({
      message: 'Transaction created',
      data: newtransaction,
    });
  } catch (err) {
    // console.log("crete new transaction",err);
    return res.status(500).json({message: 'server error', error: err.message});
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const {amount, type, category, date, description, walletId, uid} = req.body;

    let image = '';
    if (req.file && req.file.path) {
      image = req.file.path;
    } else {
      image = '';
    }
    // console.log('image',image);
    const id = req.params.transactionid;

    const updateData = {
        amount, type, category, date, description, walletId, uid,image,id
    };

    // console.log('ife', id);

    const updatedTransaction = await Transaction.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedTransaction) {
      return res.status(404).json({message: 'Wallet not found'});
    }
    console.log('Sending response', updatedTransaction);
    return res.status(201).json(updatedTransaction);
  } catch (err) {
    return res
      .status(500)
      .json({message: 'Error updating wallet', error: err.message});
  }
};
export const getusertransactions = async (req, res) => {
  try {
    const {userid} = req.params;
    const transactions = await Transaction.find({uid: userid}).sort({createdAt:-1});
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({message: 'Error fetching wallets', err});
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const id = req.params.transactionid;
      console.log(id);
      
    const deletetransaction = await Transaction.findByIdAndDelete(id);

    if (!deletetransaction)
      return res.status(404).json({message: 'Wallet not found'});
    res
      .status(200)
      .json({message: 'Wallet deleted successfully', Transaction: deletetransaction});
  } catch (err) {
    console.error('Error deleting wallet:', err);
    res.status(500).json({message: 'Failed to delete wallet', error: err});
  }
};


export const getWeeklyTransactions = async (req, res) => {
  try{
    const userId=req.params.userid;
    const startdate=new Date()
    startdate.setDate(startdate.getDate()-7)
    const transactions=await Transaction.find({
      uid: userId,
      date: {$gte: startdate}
    })
    .sort({date: -1});
    res.status(200).json(transactions);

  }
  catch(err){
    console.error('Error fetching weekly transactions:', err);
    res.status(500).json({message: 'Failed to fetch weekly transactions', error: err});
  } 
}

export const getMonthlyTransactions = async (req, res) => {
  try{
    const userId=req.params.userid;
    const startdate=new Date()
    startdate.setMonth(startdate.getMonth()-1)
    const transactions=await Transaction.find({
      uid: userId,
      date: {$gte: startdate}
    })
    .sort({date: -1});
    res.status(200).json(transactions);

  }
  catch(err){
    console.error('Error fetching monthly transactions:', err);
    res.status(500).json({message: 'Failed to fetch monthly transactions', error: err});
  } 
}

export const getYearlyTransactions = async (req, res) => {
  try{
    const userId=req.params.userid;
    const startdate=new Date()
    startdate.setFullYear(startdate.getFullYear()-1)
    const transactions=await Transaction.find({
      uid: userId,
      date: {$gte: startdate}
    })
    .sort({date: -1});
    res.status(200).json(transactions);

  }
  catch(err){
    console.error('Error fetching yearly transactions:', err);
    res.status(500).json({message: 'Failed to fetch yearly transactions', error: err});
  } 
}