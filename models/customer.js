const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  rate_code: {
    type: String,
  },
  area: {
    type: String,
  },
  street_name: {
    type: String,
  },
  apartment: {
    type: String,
  },
  address: {
    type: String,
  },
  contact_number: {
    type: String,
  },
  alter_Contact_Number: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
  },
  confirmPassword: {
    type: String,
  },
  otp: {
    type: String,
  },
  otpExpiration: {
    type: String,
  },
  orders: [
    {
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    },
  ],
  isStartedChatting: {
    type: Boolean,
    default: false,
  },
  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

customerSchema.methods.addOrder = function (orderId) {
  this.orders.push({ orderId: orderId });
  return this.save();
};

customerSchema.methods.addMessage = function (messageId) {
  this.chats.push(messageId);
  return this.save();
};

customerSchema.methods.setIsStartedChatting = function () {
  if (this.isStartedChatting) {
    console.log("Already Started Chatting");
    return;
  }
  console.log("Starting new converstaion");
  this.isStartedChatting = true;
  return this.save();
};
module.exports = mongoose.model("Customer", customerSchema);
