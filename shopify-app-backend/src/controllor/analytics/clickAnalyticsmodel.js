import mongoose from "mongoose";

const clickAnalyticsSchema = new mongoose.Schema(
  {
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    icon_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SocialLink",
      required: true,
    },
    platform: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    user_agent: String,
    ip_address: String,
  },
//   { versionKey: false }
);

// Indexes for faster analytics queries
// clickAnalyticsSchema.index({ shop_id: 1 });
// clickAnalyticsSchema.index({ icon_id: 1 });
// clickAnalyticsSchema.index({ platform: 1 });

const ClickAnalyticsModel = mongoose.model("ClickAnalytics", clickAnalyticsSchema);
export default ClickAnalyticsModel;
