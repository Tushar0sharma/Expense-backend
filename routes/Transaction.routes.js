import express from 'express'
import upload from '../utils/multer.mjs';
import { createtransaction, deleteTransaction, getMonthlyTransactions, getusertransactions, getWeeklyTransactions, getYearlyTransactions, updateTransaction } from '../controllers/transaction.controllers.js';
 const transactionrouter=express.Router();

 

 transactionrouter.post("/create",  upload.single('image'), createtransaction);
  transactionrouter.get("/user/:userid",getusertransactions)
transactionrouter.put("/update/:transactionid",upload.single('image'),updateTransaction)
transactionrouter.delete('/delete/:transactionid',deleteTransaction)
transactionrouter.get('/weekly/:userid',getWeeklyTransactions)
transactionrouter.get('/monthly/:userid',getMonthlyTransactions)
transactionrouter.get('/yearly/:userid',getYearlyTransactions)
export default transactionrouter