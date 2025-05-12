const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerifyToken: {
    type: String
  },
  emailVerifyExpires: {
    type: Date
  },

  plaidAccessToken: {
    type: String,
  },

  userId: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4
  }

}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
