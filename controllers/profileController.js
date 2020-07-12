const User = require('../models/userModel');
const Profile = require('../models/profileModel');
const auth = require('../middleware/auth');

exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        profile,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    profile.save();
    res.status(200).json({
      status: 'success',
      data: {
        profile,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: '<updated tour here>',
    });
  }
};
