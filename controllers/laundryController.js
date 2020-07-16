const Laundry = require("../models/laundryModel");
const Profile = require("../models/profileModel");
const { validationResult } = require("express-validator");

exports.updateReceipt = async (req, res) => {
  try {
    const receipt = await Laundry.findById(req.params.id);
    const userProfile = await Profile.findOne({ user: req.user.id });
    if (userProfile.role == "Laundry attendant") {
      receipt.laundryWorkerStatus = true;
      await receipt.save();
    } else if (userProfile.laundryNumber == receipt.laundryNumber) {
      receipt.studentStatus = true;
      await receipt.save();
    } else
      return res
        .status(401)
        .json({
          error:
            "This laundry reciept doesn't belong to you or you are not a Laundry attendant",
        });
    if (receipt.studentStatus == true && receipt.laundryWorkerStatus == true) {
      const deletedReciept = await Laundry.findByIdAndDelete(req.params.id);
      console.log(deletedReciept);
      return res.json({
        message:
          "The reciept has successfully been deleted due to confirmation of delivery by the student!",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        receipt,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.createReceipt = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }
    const creatorProfile = await Profile.findOne({ user: req.user.id });
    if (creatorProfile.role !== "Laundry attendant")
      return res
        .status(401)
        .json({
          errors:
            "You are not a Laundry attendant and are not authorised to do this!",
        });
    const { laundryNumber, torn, clothes } = req.body;
    let receipt = {};
    receipt.laundryNumber = laundryNumber.toUpperCase().trim();
    receipt.creator = req.user.id;
    const studentProfile = await Profile.findOne({
      laundryNumber: laundryNumber,
    });
    receipt.studentPhone = studentProfile.phoneNumber;
    if (torn) receipt.torn = torn;
    receipt.clothesAmount = 0;
    clothes.map((clothCategory) => {
      receipt.clothesAmount += clothCategory.amount;
    });
    receipt.clothes = clothes;
    const newReceipt = await new Laundry(receipt).save();
    res.status(201).json({
      status: "success",
      data: {
        receipt: newReceipt,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getReceipts = async (req, res) => {
  try {
    const currentUser = await Profile.findOne({ user: req.user.id });
    const reciepts = await Laundry.find({
      laundryNumber: currentUser.laundryNumber,
    });
    if (reciepts.length === 0)
      return res.json({
        message: "You currently have no pending laundry deliveries! Yay :)",
      });
    res.status(200).json({
      status: "success",
      data: {
        reciepts,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.searchReciept = async (req, res) => {
  try {
    const currentUserProfile = await Profile.findOne({user:req.user.id});
    if(currentUserProfile.role!=='Laundry attendant')
      return res.status(401).json({error:'You are not allowed to search laundry reciepts as you\'re not a laundry attendant!'});
    const sanitisedSearchQuery = req.body.searchQuery.toUpperCase().trim();
    const reciepts = await Laundry.find({
      laundryNumber: sanitisedSearchQuery,
    });
    if (reciepts.length === 0)
      return res.json({
        message: "There are no pending laundry deliveries for this laundry number!",
      });
    res.status(200).json({
      status: "success",
      data: {
        reciepts,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
