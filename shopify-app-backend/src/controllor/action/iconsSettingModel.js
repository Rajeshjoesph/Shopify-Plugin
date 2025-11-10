import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
    },
    containerPosition: {
      type: String,
      enum: [
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
        "center",
        "left",
        "right",
      ],
      required: true,
    },

    arrangement: {
      type: String,
      enum: ["row", "column"],
      required: true,
    },

    iconSize: {
      type: Number,
      default: 25,
    },

    spacing: {
      type: Number,
      default: 18,
    },

    borderWidth: {
      type: Number,
      default: 0,
    },

    borderColor: {
      type: String,
      default: "#E5E7EB",
    },

    borderRadius: {
      type: Number,
      default: 0,
    },

    animation: {
      type: String,
      enum: ["none", "pulse", "bounce", "shake", "spin"],
      default: "none",
    },

    animationDuration: {
      type: Number,
      default: 200,
    },

    iconColorMode: {
      type: String,
      enum: ["per-icon", "global"],
      default: "global",
    },

    globalIconColor: {
      type: String,
      default: "#111827",
    },
  },
  {
    timestamps: true,
  }
);

const settingsModel = mongoose.model("iconSetting", settingsSchema);

export default settingsModel;
