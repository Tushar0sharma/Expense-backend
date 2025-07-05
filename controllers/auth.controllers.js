import User from '../models/user.models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { log } from 'console';
dotenv.config();
const secretKey = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const {name, email, password} = req.body;

    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({message: 'User already exists'});
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
      verified: false,
    });

    newUser.verificationToken = crypto.randomBytes(20).toString('hex');

    await newUser.save();

    await sendverificationemail(newUser.email, newUser.otp);
     const user = await User.findOne({email});
     const newUser1 = user.toObject({getters: true});
    delete newUser1.password;

    res.status(200).json({message: 'Registration successful', user: newUser1});

    // res.status(200).json({message: 'Registration successful'});
  } catch (error) {
    console.error('Error in register function:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};

export const forgotpass = async (req, res) => {
  try {
    const {email} = req.body;

    const existingUser = await User.findOne({email});
    if (!existingUser) {
      return res.status(400).json({message: "User doesn't exist"});
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    existingUser.otp = otp;
    existingUser.otpExpiry = otpExpiry;
    await existingUser.save();

    sendverificationemail(existingUser.email, existingUser.otp);

    res.status(200).json({message: 'Otp sent Successful'});
  } catch (error) {
    console.error('Error in forgot pass function:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};

export const setpass = async (req, res) => {
  try {
    const {email, code, password} = req.body;

    const user = await User.findOne({email});
    if (!user || user.otp !== code || user.otpExpiry < Date.now()) {
      return res.status(400).json({message: 'Invalid or expired OTP'});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({message: 'Password saved Successful'});
  } catch (error) {
    console.error('Error in forgot pass function:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};

const sendverificationemail = async (email, otp) => {
  //create a nodemailer transporter

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tusharsharma.gemini@gmail.com',
      pass: process.env.EMAIL_PASS,
    },
  });

  //compose email message

  const mailoptions = {
    from: 'Expense.com',
    to: email,
    subject: 'Your Otp Code',
    text: `Your OTP code is: ${otp}. It expires in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailoptions);
  } catch (error) {
    console.log('error sending mail', error);
  }
};
export const sendfeedbackemail = async (req, res) => {
  const {email, name, selectedEmojiChar, selectedIssue, comment} = req.body.data;

  console.log(req.body);
//   

  // create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tusharsharma.gemini@gmail.com',
      pass: process.env.EMAIL_PASS,
    },
  });

  const issuesText =
    Array.isArray(selectedIssue) && selectedIssue.length > 0
      ? selectedIssue.map((issue, idx) => `${idx + 1}. ${issue}`).join('\n')
      : 'None selected';

    //   console.log(issuesText);
      

  const mailoptions = {
    from: 'Expense.com',
    to: 'tusharsharma.gemini@gmail.com',
    subject: `Feedback from ${name || 'Anonymous'} (${email || 'No Email'})`,
    text: `
You have received new feedback from the Expense App:

Name: ${name || 'Anonymous'}
Email: ${email || 'Not provided'}
Emoji: ${selectedEmojiChar || 'None'}
Issues:
${issuesText}
Comment:
${comment || 'No comment provided.'}
        `,
  };

  try {
    await transporter.sendMail(mailoptions);
    res.status(200).json({message: 'Feedback sent successfully'});
  } catch (error) {
    console.log('error sending mail', error);
    res.status(500).json({message: 'Failed to send feedback'});
  }
};

export const login = async (req, res) => {
  try {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({message: 'User not found'});
    }
    if (!user.verified) {
      return res.status(400).json({message: 'User not Verified'});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({message: 'Invalid credentials'});
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      secretKey,
    );

    const newUser = user.toObject({getters: true});
    delete newUser.password;

    res.status(200).json({message: 'Login successful', token, user: newUser});
  } catch (error) {
    console.error('Error in login function:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};

export const verifyOtp = async (req, res) => {
  const {email, otp} = req.body;

  try {
    const user = await User.findOne({email});

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({message: 'Invalid or expired OTP'});
    }

    user.verified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    const newUser = user.toObject({getters: true});
    delete newUser.password;
    console.log(newUser);

    res.status(200).json({message: 'Email verified successfully', newUser});
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};

export const deleteuser = async (req, res) => {
  try {
    // console.log(req);

    const {id} = req.body;
    const deleteduser = await User.findByIdAndDelete(id);
    res.status(200).json({message: 'User deleted successfully', deleteduser});
  } catch (error) {
    console.error('Error in deleting user', error),
      res.status.json({message: 'Internal Server error'});
  }
};
