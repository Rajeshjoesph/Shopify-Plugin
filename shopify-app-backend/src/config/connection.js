import mysql2 from 'mysql2';
import dotenv from "dotenv";
dotenv.config();
const { SQLUSER, SQLDB, SQLPWD } = process.env;
// console.log(SQLUSER, SQLDB, SQLPWD);

const connection = mysql2.createConnection({
   host: "localhost",
  user: SQLUSER,
  password: SQLPWD,
  database: SQLDB,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }else
  {
    console.log('Connected to the MySQL database.');
  }
});
export default connection;