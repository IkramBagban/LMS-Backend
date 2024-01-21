const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  first_name: {
    type: String,
    // required: true,
  },
  last_name: {
    type: String,
    // required: true,
  },
  rate_code: {
    type: String,
    // required: true,
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
  Password: {
    type: String,
    // required: true,
  },
  confirmPassword: {
    type: String,
    // required: true,
  },
  otp: {
    type: String,
    // required: true,
  },
  otpExpiration: {
    type: String,
    // required: true,
  },
  orders : [
    {
      orderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Order",
      },
    }
  ],
  chats : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Message'
    }
  ]
  
});

customerSchema.methods.addOrder = function(orderId) {
  this.orders.push({orderId : orderId})
  return this.save();
}

customerSchema.methods.addMessage = function(messageId){
  this.chats.push(messageId)
  return this.save();
}

module.exports = mongoose.model("Customer", customerSchema);
