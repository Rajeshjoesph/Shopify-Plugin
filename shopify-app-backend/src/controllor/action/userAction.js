import SocialLink from "./userActionModel.js";

const userAction = (req, res) => {
  try {
    const requireFields = [
      "platform",
      "label",
      "url",
      "tooltip",
      "display_order",
      "is_active",
    ];

    const socialLinks = req.body; // array from frontend

    if (!Array.isArray(socialLinks) || socialLinks.length === 0) {
      return res
        .status(400)
        .json({ message: "Payload must be a non-empty array" });
    }

    // Loop through each object
    for (let i = 0; i < socialLinks.length; i++) {
      const item = socialLinks[i];

      for (let field of requireFields) {
        if (
          item[field] === undefined ||
          item[field] === null ||
          item[field] === ""
        ) {
          return res.status(400).json({
            message: `Field '${field}' is required in item ${i + 1}`,
          });
        }
      }
      item.shop_id = req.user._id; // Attach shop_id from authenticated shop

    }

    res.status(200).json({ message: "User action accessed successfully", data: socialLinks });
  } catch (error) {
    return res.json({
      message: error.message,
      stack: error.stack,
    });
  }
};

export { userAction };
