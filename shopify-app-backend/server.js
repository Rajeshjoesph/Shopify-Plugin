import mysql2 from 'mysql2';
import express from 'express';
import connection from './src/config/connection.js';
// import dotenv from 'dotenv';
// dotenv.config();

const app = express();
const port = 8000;
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});