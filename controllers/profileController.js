const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const { validationResult } = require("express-validator");

exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    const user = await User.findById(profile.user).select("-password");
    res.status(200).json({
      status: "success",
      data: {
        profile,
        name: user.name,
        displayPicture: user.displayPicture,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    role,
    hostel,
    roomInfo,
    laundryNumber,
    rollNumber,
    phoneNumber,
    name,
  } = req.body;
  let profile = {};
  if (laundryNumber) {
    let retrievedProfiles = await Profile.find({
      laundryNumber: laundryNumber.trim().toUpperCase(),
    });
    retrievedProfiles = retrievedProfiles.filter((retProfile) => {
      return retProfile.user.toString() !== req.user.id.toString();
    });
    if (retrievedProfiles.length !== 0) {
      return res
        .status(409)
        .json({ errors: "This Laundry Number is already in use!" });
    }
    profile.laundryNumber = laundryNumber.trim().toUpperCase();
  }
  if (rollNumber) {
    let retrievedProfiles = await Profile.find({ rollNumber: rollNumber });
    retrievedProfiles = retrievedProfiles.filter((retProfile) => {
      return retProfile.user.toString() !== req.user.id.toString();
    });
    if (retrievedProfiles.length !== 0) {
      return res
        .status(409)
        .json({ errors: "This Roll Number is already in use!" });
    }
    profile.rollNumber = rollNumber;
  }
  if (phoneNumber) {
    let retrievedProfiles = await Profile.find({ phoneNumber: phoneNumber });
    retrievedProfiles = retrievedProfiles.filter((retProfile) => {
      return retProfile.user.toString() !== req.user.id.toString();
    });
    if (retrievedProfiles.length !== 0) {
      return res
        .status(409)
        .json({ errors: "This Phone Number is already in use!" });
    }
    profile.phoneNumber = phoneNumber;
  }
  if (roomInfo) profile.roomInfo = roomInfo.trim().toUpperCase();
  profile.hostel = hostel.trim().toUpperCase();
  let roleTrimmed = role.trim();
  profile.role =
    roleTrimmed.slice(0, 1).toUpperCase() +
    roleTrimmed.slice(1, roleTrimmed.length).toLowerCase();
  profile.user = req.user.id;
  try {
    let user = await User.findById(req.user.id).select('-password');
    user.name = name;
    await user.save();
    let newProfile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      profile,
      {
        new: true,
        runValidators: true,
      }
    );
    newProfile.save();
    res.status(200).json({
      status: "success",
      data: {
        newProfile,
        name: user.name
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "<updated tour here>",
    });
  }
};

exports.getCurrentUserProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({
      status: "success",
      data: {
        profile,
        name: user.name,
        displayPicture: user.displayPicture,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
