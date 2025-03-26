const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user.model');

// GET endpoint to fetch user by ID
router.get('/:id', async (req, res) => {
  const userId = req.params.id;

  // Set response content type to JSON
  res.setHeader('Content-Type', 'application/json');

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }

  try {
    const user = await User.findOne({ _id: userId, age: { $gt: 21 } });

    if (!user) {
      return res.status(404).json({ error: 'User not found or age is 21 or below' });
    }

    // Convert Mongoose document to plain object and send as JSON
    const userObject = user.toObject();
    return res.status(200).json(userObject);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router; 