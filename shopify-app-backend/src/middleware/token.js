import jwt from "jsonwebtoken";
import db from "../config/connection.js";
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

const verifyToken = (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "Access Denied" });
    console.log(token);

    token = token.replace("Bearer ", "");

    const verified = jwt.verify(token, SECRET_KEY);
    const { email, shopify_domain } = verified;
    const query = `SELECT * FROM shops WHERE email = ? AND shopify_domain = ?
  `;
    db.query(query, [email, shopify_domain], (err, results) => {
      if (err) {
        // console.error(err);
        return res.status(500).json({ message: "Server error" });
      }
      if (results.length === 0) {
        return res.status(401).json({ message: "Access Denied" });
      }
      req.user = results[0];
      // console.log("results",req.user);

      return next();
    });
    req.shop = { email, shopify_domain };
    // console.log("token:", verified);

    if (!verified) {
      return res.status(401).json({ message: "Access Denied" });
    }
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
