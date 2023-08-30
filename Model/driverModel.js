const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  email: String,
  phoneNo: String,
  password: String,
});

const Driver =  mongoose.model('driver', driverSchema);
module.exports = Driver ;
