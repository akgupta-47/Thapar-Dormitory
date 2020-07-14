const Laundry = require('../models/laundryModel');

exports.getReceipt = async (req, res) => {
  try {
    const receipt = await Laundry.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        receipt,
      },
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

exports.createReceipt = async (req, res) => {
  try {
    const newReceipt = await Laundry.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        receipt: newReceipt,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteReceipt = async (req, res) => {
  try {
    await Laundry.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};
