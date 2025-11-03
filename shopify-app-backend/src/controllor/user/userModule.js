import mongoose from "mongoose";

// shopsTable.js

const shopsTable = `
CREATE TABLE IF NOT EXISTS shops (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  shopify_domain VARCHAR(255) NOT NULL UNIQUE,
  access_token VARCHAR(255) NOT NULL,
  installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  plan VARCHAR(50) DEFAULT 'Free',
  uninstalled BOOLEAN DEFAULT FALSE
);
`;

const shopeSchema = new mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, required: true },
  password: { type: String, required: true },
  shopify_domain: { type: String, required: true, unique: true },
  access_token: { type: String, required: true },
  installed_at: { type: Date, default: Date.now },
  plan: { type: String, default: "Free" },
  uninstalled: { type: Boolean, default: false },
});

const shopsModel = mongoose.model("shops", shopeSchema);
export default shopsModel;
