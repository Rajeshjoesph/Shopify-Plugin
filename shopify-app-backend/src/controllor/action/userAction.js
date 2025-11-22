import mongoose from "mongoose";
import SocialLinkModel from "./userActionModel.js";
import settingsModel from "./iconsSettingModel.js";
import shopsModel from "../../controllor/user/userModule.js";
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
    // console.log(checkFields);
    // return
    let createSocialIcon;
    if (checkFields.length !== 0) {
      createSocialIcon = await SocialLinkModel.findOneAndUpdate(
        { shop_id: req.user._id, platform: platform },
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
      console.log(createSocialIcon);

      if (!createSocialIcon) {
        return res.status(400).json({ message: "not created" });
      }
      return res.status(200).json({
        message: "Icon already exist, so icon updated successfully",
        data: createSocialIcon,
      });
    }

    createSocialIcon = await SocialLinkModel.create({
      shop_id: req.user._id,
      platform: platform,
      label: label,
      url: url,
      tooltip: tooltip,
      display_order: display_order,
      color: color,
      is_active: is_active,
    });

    if (!createSocialIcon) {
      return res.status(400).json({ message: "not created" });
    }

    return res.status(200).json({
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

    console.log(platformName, req.user._id);

    const findSocialIcon = await SocialLinkModel.findOne({
      shop_id: req.user._id,
      platform: platformName,
    });
    // console.log(findSocialIcon);

    if (findSocialIcon.length === 0) {
      return res.status(400).json({ message: "not found" });
    }
    const updateSocialIcon = await SocialLinkModel.findOneAndUpdate(
      { shop_id: req.user._id, platform: platformName },
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

// ** Get All Social Icons **
// ** =======================
const getAllSocialIcons = async (req, res) => {
  try {
    const { shopify_domain } = req.query;
    if (!shopify_domain) {
      return res.status(400).json({ message: "shopify_domain is required" });
    }
    const verifyShop = await shopsModel.findOne({ shopify_domain });

    req.user = verifyShop;
    const allSocialIcons = await SocialLinkModel.find({
      shop_id: req.user._id,
    });
    const settings = await settingsModel.findOne({ shop_id: req.user._id });
    res.status(200).json({
      message: "Success",
      data: { icons: allSocialIcons, settings: settings },
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// ** Update Reorder Social Icons **
// ** ==============================
const updateReorder = async (req, res) => {
  try {
    const icons = req.body.icons; // ✅ correct

    if (!icons || !Array.isArray(icons)) {
      return res.status(400).json({ message: "icons array missing" });
    }

    const reOrder = await SocialLinkModel.bulkWrite(
      icons.map((item) => ({
        updateOne: {
          filter: { shop_id: req.user._id, platform: item.platform },
          update: { $set: { display_order: item.display_order } },
        },
      }))
    );
    // console.log(reOrder);

    if (!reOrder) {
      res.status(400).json({ message: "not update" });
    }

    const updated = await SocialLinkModel.find({ shop_id: req.user._id }).sort(
      "display_order"
    );

    res.status(200).json({ message: "Reorder Success", data: updated });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error });
  }
};

// ** Post icon style **
// ** =====================
const postIconStyle = async (req, res) => {
  try {
    const {
      containerPosition,
      arrangement,
      iconSize,
      spacing,
      borderWidth,
      borderColor,
      borderRadius,
      animation,
      animationDuration,
      iconColorMode,
      globalIconColor,
    } = req.body;

    if (!containerPosition || !arrangement || !iconSize) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    // ✅ Create or Update in one query
    const updatedSettings = await settingsModel.findOneAndUpdate(
      { shop_id: req.user._id }, // where condition
      {
        containerPosition,
        arrangement,
        iconSize,
        spacing,
        borderWidth,
        borderColor,
        borderRadius,
        animation,
        animationDuration,
        iconColorMode,
        globalIconColor,
      },
      {
        new: true, // return updated document
        upsert: true, // create if not exist
        setDefaultsOnInsert: true,
      }
    );

    return res
      .status(200)
      .json({ message: "Icon settings saved", data: updatedSettings });
  } catch (error) {
    return res.status(500).json({ message: error.message || error });
  }
};

export {
  createSocialIcon,
  updateSocialIcon,
  getAllSocialIcons,
  updateReorder,
  postIconStyle,
};
