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
// router.use(protect);

// router.route('/')
//   .post(createRecord)
//   .get(getRecords);

// router.route('/:id')
//   .get(getRecord)
//   .put(updateRecord)
//   .delete(deleteRecord);

// module.exports = router; router.get("/records", getRecords); // Fetch all records for a user
router.get("/records", getRecords); // Fetch all records for a user
router.get("/records/:id", getRecord); // Fetch a single record

// Private routes (keep these protected)
router.post("/records", createRecord); // Create a new record
router.put("/records/:id", updateRecord); // Update a record
router.delete("/records/:id", deleteRecord); // Delete a record

module.exports = router;