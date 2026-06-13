const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const bcrypt = require("bcrypt");

const updateProfile = async (req, res) => {
  try {
    const { name, address, profilePhoto } = req.body;

    // 1. Get existing user first
    const existingUser = await User.findById(req.user.id);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2. Delete old image from Cloudinary if new image is provided
    if (
      profilePhoto?.public_id &&
      existingUser.profilePhoto?.public_id &&
      profilePhoto.public_id !== existingUser.profilePhoto.public_id
    ) {
      await cloudinary.uploader.destroy(
        existingUser.profilePhoto.public_id
      );
    }

    // 3. Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        address,
        profilePhoto,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

     const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProfileController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "_id name email mobile profilePhoto address role"
    ).lean();


    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      _id: id,
      name,
      email,
      mobile,
      profilePhoto,
      address,
      role,
    } = user;

    res.status(200).json({
      success: true,
      user: {
        id,
        name,
        email,
        mobile,
        profilePhoto,
        address,
        role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeProfilePhotoController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.profilePhoto?.public_id) {
      return res.status(400).json({
        success: false,
        message: "No profile photo found",
      });
    }

    await cloudinary.uploader.destroy(
      user.profilePhoto.public_id
    );

    user.profilePhoto = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile photo removed successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {updateProfile,changePassword,getProfileController,removeProfilePhotoController};
