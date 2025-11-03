import mongoose from "mongoose";

const socialLinkSchema = new mongoose.Schema(
  {
    shop_id: {
      type: mongoose.Schema.Types.ObjectId, // Foreign key → shops._id
      ref: "Shop",
      required: true,
    },
    platform: {
      type: String,
      required: true,
      enum: ["Instagram", "Facebook", "Twitter", "LinkedIn", "YouTube", "Other"],
    },
    label: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      required: true,
    },
    tooltip: {
      type: String,
      default: "",
    },
    display_order: {
      type: Number,
      default: 0,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

// Optional: index for faster lookups
socialLinkSchema.index({ shop_id: 1, platform: 1 });

const SocialLink = mongoose.model("SocialLink", socialLinkSchema);

export default SocialLink;
