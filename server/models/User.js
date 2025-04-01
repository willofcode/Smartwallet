const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  firstName: 
  { type: String,
    required: true },

  lastName:
  { type: String, 
    required: true },
 
  email: 
  { type: String, 
    required: true, 
    unique: true },
    
  password: 
  { type: String,
    required: true },

  userId: 
  { type: String, 
    required: true, 
    unique: true, 
    default: uuidv4 },

});
const User = mongoose.model('User', userSchema);
module.exports = User;
