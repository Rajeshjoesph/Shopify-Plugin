import mysql2 from "mysql2";
import db from "../../config/connection.js";
import { generateAccessToken } from "../../middleware/token.js";
import mongoose from "mongoose";
import shopsModel from "./userModule.js";

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
    const createShop=await shopsModel.create({
      email,
      password,
      shopify_domain,
      plan:plan ||"Free",
      access_token
    })
    console.log("Created Shop:",createShop);

    if(!createShop){
      return res.status(500).json({ message: "Failed to create shop" });
    }

    return res.status(200).json({ message: "User created successfully" });
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
    
    const shop = await shopsModel.findOne({ email, password });
    if (!shop) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    return res.status(200).json({ message: "Login successful", shop });

  } catch (error) {
    console.log("error",error);
    
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { createUser,userLogin };
