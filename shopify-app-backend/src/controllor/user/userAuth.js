import mysql2 from "mysql2";
import db from "../../config/connection.js";
import { generateAccessToken } from "../../middleware/token.js";

const createUser = async (req, res) => {
  try {
    let { email, password, shopify_domain, plan } = req.body;
    if (!email || !password || !shopify_domain) {
      return res
        .status(400)
        .json({ message: "Email, password and shopify_domain are required" });
    }
    console.log(email, password, shopify_domain, plan);
    const access_token = generateAccessToken({ email, shopify_domain });
    // console.log(access_token);

    const query = `
    INSERT INTO shops (email, password, access_token,shopify_domain, plan)
    VALUES (?, ?, ?,?, ?)
  `;

    db.query(
      query,
      [email, password, access_token,shopify_domain, plan || "Free"],
      (err, result) => {
        if (err) {
          console.error(err);
          if (err.code === "ER_DUP_ENTRY") {
            return res
              .status(409)
              .json({ message: "Shop already registered." });
          }
          // console.error(err);

          return res.status(500).json({ message: "Server error" });
        }
        return res.status(201).json({ message: "Shop registered successfully!" });
      }
    );

    // res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    console.log("Error creating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const userLogin = async (req, res) => {
  try {
    console.log(req.body);
    
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    const query = `
    SELECT * FROM shops WHERE email = ? AND password = ?
  `;

    db.query(
      query,
      [email, password],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Server error" });
        }
        if (results.length === 0) {
          return res.status(401).json({ message: "Invalid email or password" });
        }
        return res.status(200).json({ message: "Login successful", user: results[0] });
      }
    );

  } catch (error) {
    console.log("error",error);
    
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { createUser,userLogin };
