const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createRecord,
  getRecords,
  getRecord,
  updateRecord,
  deleteRecord
} = require('../controllers/recordController');

// All routes are protected
router.use(protect);

router.route('/')
  .post(createRecord)
  .get(getRecords);

router.route('/:id')
  .get(getRecord)
  .put(updateRecord)
  .delete(deleteRecord);

module.exports = router; 