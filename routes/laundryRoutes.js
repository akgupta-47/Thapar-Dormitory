const express = require('express');
const laundryController = require('../controllers/laundryController');
const router = express.Router();
const auth = require('../middleware/auth');

router.route('/').post(auth, laundryController.createReceipt);

router
  .route('/:id')
  .get(auth, laundryController.getReceipt)
  .delete(auth, laundryController.deleteReceipt);

module.exports = router;
