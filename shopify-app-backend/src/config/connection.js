import mysql2 from 'mysql2';
import dotenv from "dotenv";
import mongoose from 'mongoose';
dotenv.config();
const { SQLUSER, SQLDB, SQLPWD,DB_HOST } = process.env;
// console.log(SQLUSER, SQLDB, SQLPWD);

const connection = mysql2.createConnection({
   host: "localhost",
  user: SQLUSER,
  password: SQLPWD,
  database: SQLDB,
});

// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the database:', err);
//     return;
//   }else
//   {
//     console.log('Connected to the MySQL database.');
//   }
// });

const dbConnection =()=> mongoose.connect(DB_HOST)
  .then(() => {
    console.log("MongoDB connected successfully....!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


export default dbConnection;