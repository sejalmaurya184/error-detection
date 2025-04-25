const { pool } = require('../config/db');

// @desc    Create a new health record
// @route   POST /api/records
// @access  Private
const createRecord = async (req, res) => {
  try {
    const { title, description, diagnosis, prescription, date } = req.body;
    const userId = req.user.id; // From auth middleware

    const [result] = await pool.query(
      'INSERT INTO records (userId, title, description, diagnosis, prescription, recordDate) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, title, description, diagnosis, prescription, date]
    );

    const [newRecord] = await pool.query(
      'SELECT * FROM records WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Health record created successfully',
      record: newRecord[0]
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error creating health record',
      error: error.message
    });
  }
};

// @desc    Get user's health records
// @route   GET /api/records
// @access  Private
const getRecords = async (req, res) => {
  try {
    const userId = req.user.id;

    const [records] = await pool.query(
      'SELECT * FROM records WHERE userId = ? ORDER BY recordDate DESC',
      [userId]
    );

    res.status(200).json(records);
  } catch (error) {
    res.status(400).json({
      message: 'Error retrieving health records',
      error: error.message
    });
  }
};

// @desc    Get single health record
// @route   GET /api/records/:id
// @access  Private
const getRecord = async (req, res) => {
  try {
    const recordId = req.params.id;
    const userId = req.user.id;

    const [records] = await pool.query(
      'SELECT * FROM records WHERE id = ? AND userId = ?',
      [recordId, userId]
    );

    if (records.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.status(200).json(records[0]);
  } catch (error) {
    res.status(400).json({
      message: 'Error retrieving health record',
      error: error.message
    });
  }
};

// @desc    Update health record
// @route   PUT /api/records/:id
// @access  Private
const updateRecord = async (req, res) => {
  try {
    const recordId = req.params.id;
    const userId = req.user.id;
    const { title, description, diagnosis, prescription, date } = req.body;

    // Check if record exists and belongs to user
    const [existingRecord] = await pool.query(
      'SELECT * FROM records WHERE id = ? AND userId = ?',
      [recordId, userId]
    );

    if (existingRecord.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }

    await pool.query(
      'UPDATE records SET title = ?, description = ?, diagnosis = ?, prescription = ?, recordDate = ? WHERE id = ? AND userId = ?',
      [title, description, diagnosis, prescription, date, recordId, userId]
    );

    const [updatedRecord] = await pool.query(
      'SELECT * FROM records WHERE id = ?',
      [recordId]
    );

    res.status(200).json({
      message: 'Health record updated successfully',
      record: updatedRecord[0]
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating health record',
      error: error.message
    });
  }
};

// @desc    Delete health record
// @route   DELETE /api/records/:id
// @access  Private
const deleteRecord = async (req, res) => {
  try {
    const recordId = req.params.id;
    const userId = req.user.id;

    // Check if record exists and belongs to user
    const [existingRecord] = await pool.query(
      'SELECT * FROM records WHERE id = ? AND userId = ?',
      [recordId, userId]
    );

    if (existingRecord.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }

    await pool.query(
      'DELETE FROM records WHERE id = ? AND userId = ?',
      [recordId, userId]
    );

    res.status(200).json({
      message: 'Health record deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error deleting health record',
      error: error.message
    });
  }
};

module.exports = {
  createRecord,
  getRecords,
  getRecord,
  updateRecord,
  deleteRecord
}; 