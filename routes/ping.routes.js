import express from 'express'
import { ping } from '../controllers/ping.controller.js';
export const pingrouter = express.Router()

pingrouter.get("/ping",ping);
