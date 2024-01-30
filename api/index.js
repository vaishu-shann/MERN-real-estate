import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import config from './config.js';
import cors from "cors"
dotenv.config();
const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
mongoose
  .connect("mongodb+srv://vaishnavi:Vaishnavi30@cluster0.ls1ernz.mongodb.net/real-estate?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });


app.use(express.json());

app.use(cookieParser());





app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});


app.listen(5000, () => {
  console.log('Server is running on port 5000!');
  console.log("----", config.JWT_TOKEN);
});