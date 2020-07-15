const express = require("express");
const laundryController = require("../controllers/laundryController");
const router = express.Router();
const auth = require("../middleware/auth");
const { check } = require("express-validator");

router
  .route("/")
  .post(
    [
      auth,
      check(
        "laundryNumber",
        "You must provide the laundry number of the student to create a new entry!"
      )
        .not()
        .isEmpty(),
    ],
    laundryController.createReceipt
  );

router
  .route("/:id")
  .put(auth, laundryController.updateReceipt)
  .delete(auth, laundryController.deleteReceipt);

module.exports = router;
