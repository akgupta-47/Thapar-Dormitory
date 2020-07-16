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
      check(
        "clothes",
        "You must provide the info about the clothes to create a reciept!"
      )
        .not()
        .isEmpty(),
    ],
    laundryController.createReceipt
  )
  .get(auth, laundryController.getReceipts);

router
  .route("/search")
  .post(
    [
      auth,
      check(
        "searchQuery",
        "You must provide a laundry Number to search for reciepts!"
      )
        .not()
        .isEmpty(),
    ],
    laundryController.searchReciept
  );

router.route("/:id").put(auth, laundryController.updateReceipt);

module.exports = router;
