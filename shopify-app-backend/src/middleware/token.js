import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import shopsModel from "../controllor/user/userModule.js";
// import db from "../config/connection.js";
const SECRET_KEY = "mysecretkey";
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      email: user.email,
      shopify_domain: user.shopify_domain,
    },
    SECRET_KEY,
    { expiresIn: "5day" } // Token valid for 1 hour
  );
};

// console.log(generateAccessToken({"email":"rajeshkannan123@gmail.com",
// "shopify_domain":"www.rajeshkannan123.com",}));

const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "Access Denied" });
    // console.log(token);

    token = token.replace("Bearer ", "");

    const verified = jwt.verify(token, SECRET_KEY);
    // console.log("verified",verified);
    
    const { email, shopify_domain } = verified;
    // console.log(email, shopify_domain);
    

      if (!verified) {
      return res.status(401).json({ message: "Access Denied" });
    }

    const verifyShop = await shopsModel.findOne({ email, shopify_domain });

    // console.log(verifyShop);
    

    if (!verifyShop) {
      return res.status(401).json({ message: "Access Denied" });
    }
    
    req.user=verifyShop;
    // console.log(verifyShop.tree,"verified");
    
    next();

  
  } catch (error) {
    return res.json({
      message: error.message,
      stack: error.stack,
    });
  }
};

const refreshToken = (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "Access Denied" });
    console.log(token);
    token = token.replace("Bearer ", "");
    const verified = jwt.verify(token, SECRET_KEY);
    console.log("token:", verified);
  } catch (error) {
    return res.json({
      message: error.message,
      stack: error.stack,
    });
  }
};

export { generateAccessToken, verifyToken };
