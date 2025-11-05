import mongoose from "mongoose";
import SocialLinkModel from "./userActionModel.js";
import { json } from "express";

// ** Create Social Icon **
// ** =======================
const createSocialIcon = async (req, res) => {
  try {
    console.log(req.user, "body data");

    const { platform, label, url, tooltip, display_order, color, is_active } =
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
      
    }

    // const createSocialIcon = await SocialLinkModel.create({
    //   shop_id: req.user._id,
    //   platform: platform,
    //   label: label,
    //   url: url,
    //   tooltip: tooltip,
    //   display_order: display_order,
    //   color: color,
    //   is_active: is_active,
    // });

    const createSocialIcon = await SocialLinkModel.findOneAndUpdate(
      { shop_id: req.user._id, platform:platform },
      {
        label,
        url,
        tooltip,
        display_order,
        color,
        is_active,
      },
      { new: true } // returns the updated document
    );

    if (!createSocialIcon) {
      res.status(400).json({ message: "not created" });
    }

    res.status(200).json({
      message: "User action accessed successfully",
      data: createSocialIcon,
    });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message,
      stack: error.stack,
    });
  }
};

// ** Update Social Icon **
// ** =======================
const updateSocialIcon = async (req, res) => {
  try {
    const { platformName } = req.query;
    const { platform, label, url, tooltip, display_order, color, is_active } =
      req.body;

    console.log(platformName,req.user._id);

    const findSocialIcon = await SocialLinkModel.findOne({
      shop_id: req.user._id,
      platform:platformName,
    });
    // console.log(findSocialIcon);

    if (findSocialIcon.length === 0) {
      return res.status(400).json({ message: "not found" });
    }
    const updateSocialIcon = await SocialLinkModel.findOneAndUpdate(
      { shop_id: req.user._id, platform:platformName },
      {
        label,
        url,
        tooltip,
        display_order,
        color,
        is_active,
      },
      { new: true } // returns the updated document
    );
    console.log(updateSocialIcon);

    if (!updateSocialIcon) {
      return res.status(400).json({ message: "not update" });
    }

    return res
      .status(200)
      .json({ message: "Update SuccessFully", data: updateSocialIcon });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error });
  }
};

const getAllSocialIcons = async (req, res) => {
  try {
    const allSocialIcons = await SocialLinkModel.find({
      shop_id: req.user._id,
    });
    res.status(200).json({ message: "Success", data: allSocialIcons });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
export { createSocialIcon, updateSocialIcon, getAllSocialIcons };
