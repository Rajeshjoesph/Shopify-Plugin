import mysql2 from 'mysql2';
import express, { Router } from 'express';
import dbConnection from './src/config/connection.js';
import rootRouter from "./src/rootRouter.js"
import cors from 'cors';
import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// dotenv.config();

const app = express();
const port = 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors(
    {
      origin: '*', // Allow all origins, you can specify specific origins if needed
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
      allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
      credentials: true, // Allow credentials if needed
    }
  )
)
app.use(rootRouter);
dbConnection();
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});