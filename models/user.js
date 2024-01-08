const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    // required: true,
  },
  rate_code: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    // required: true,
  },
  street_name: {
    type: String,
    // required: true,
  },
  apartment: {
    type: String,
    // required: true,
  },
  address: {
    type: String,
    // required: true,
  },
  contact_number: {
    type: String,
    // required: true,
  },
  alter_Contact_Number: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    // required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
