import mongoose from "mongoose";
import SocialLinkModel from "./userActionModel.js";
import { json } from "express";

const createSocialIcon = async (req, res) => {
  try {
    // console.log(req.user);

    const { platform, label, url, tooltip, display_order, is_active } =
      req.body;
    const requireFields = [
      "Facebook",
      "Instagram",
      "Twitter",
      "LinkedIn",
      "Threads",
      "Pinterest",
    ];

    if (!requireFields.includes(platform)) {
      res.status(400).json({ message: "Invalid platform name" });
    }

    const checkFields = await SocialLinkModel.find({
      shop_id: req.user._id,
      platform,
    });
    console.log(checkFields);

    if (checkFields.length !== 0) {
      res.status(400).json({ message: "Already exists" });
    }

    const createSocialIcon = await SocialLinkModel.create({
      shop_id: req.user._id,
      platform: platform,
      label: label,
      url: url,
      tooltip: tooltip,
      display_order: display_order,
      is_active: is_active,
    });

    if (!createSocialIcon) {
      res.status(400).json({ message: "not created" });
    }

    res.status(200).json({
      message: "User action accessed successfully",
      data: createSocialIcon,
    });
  } catch (error) {
    return res.json({
      message: error.message,
      stack: error.stack,
    });
  }
};

const updateSocialIcon = async (req, res) => {
  try {
    const { platformName } = req.query;
    const { platform, label, url, tooltip, display_order, is_active } =
      req.body;

    console.log(platform);

    const findSocialIcon = await SocialLinkModel.find({
      shop_id: req.user._id,
      platform,
    });
    // console.log(findSocialIcon);

    if (findSocialIcon.length === 0) {
      res.status(400).json({ message: "not found" });
    }
    const updateSocialIcon = await SocialLinkModel.findOneAndUpdate(
      { shop_id: req.user._id, platform },
      {
        label,
        url,
        tooltip,
        display_order,
        is_active,
      },
      { new: true } // returns the updated document
    );
    console.log(updateSocialIcon);

    if (!updateSocialIcon) {
      res.status(400).json({ message: "not update" });
    }

    res.status(200).json({ message: "Update SuccessFully",data:updateSocialIcon });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export { createSocialIcon, updateSocialIcon };
