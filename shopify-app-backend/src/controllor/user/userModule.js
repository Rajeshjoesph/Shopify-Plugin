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

module.exports = shopsTable;
