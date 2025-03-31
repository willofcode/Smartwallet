const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  // first name
  // last name
  name: {
    type: String,
    required: true,
  },
 
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

  /*plaidAccessToken:
  { type: String,
    required: false
  }*/

});
const User = mongoose.model('User', userSchema);
module.exports = User;
