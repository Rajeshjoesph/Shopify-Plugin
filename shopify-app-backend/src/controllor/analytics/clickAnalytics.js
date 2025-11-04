import express from "express";
import ClickAnalyticsModel from "./clickAnalyticsmodel.js";
const router = express.Router();

// ➕ Create a new click event
const trackClick = async (req, res) => {
  try {
    const { icon_id, platform } = req.query;

    if (!icon_id || !platform) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newClick = new ClickAnalyticsModel({
      shop_id: req.user._id,
      icon_id,
      platform,
      user_agent: req.headers["user-agent"],
      ip_address:
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket.remoteAddress,
    });

    await newClick.save();

    res.status(201).json({ message: "Click tracked successfully" });
  } catch (error) {
    console.error("Error tracking click:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const clickCount = async (req, res) => {
  try {
    const result = await ClickAnalyticsModel.aggregate([
      {
        $match: {
          shop_id: req.user._id,
        //   createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: "$platform",
          totalClicks: { $sum: 1 },
        },
      },
      { $sort: { totalClicks: -1 } },
      {
        $project: {
          platform: "$_id",
          totalClicks: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching click summary:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching analytics summary",
    });
  }
};

export { trackClick, clickCount };
