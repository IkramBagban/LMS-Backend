const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  branch: {
    type: String,
    // required: true,
  },
  SpecialRequests: {
    type: String,
    // required: true,
  },
  custName: {
    type: String,
    // required: true,
  },
  subtotal: {
    type: String,
    // required: true,
  },
  deliveryType: {
    type: String,
    // required: true,
  },
  pickupDate: {
    type: String,
    // required: true,
  },
  order_source: {
    type: String,
    // required: true,
  },
  emirate_id: {
    type: String,
    // required: true,
  },
  orderDelete: {
    type: String,
    // required: true,
  },
  order_item: [
    {
      item: {
        type: String,
        // required: true,
      },
      service: {
        type: String,
        // required: true,
      },
      DELIVERY: {
        type: String,
        // required: true,
      },
      qty: {
        type: String,
        // required: true,
      },
      Price: {
        type: String,
        // required: true,
      },
    },
  ],
  deliveryDate: {
    type: String,
    // required: true,
  },

  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Customer',
    required: true,
  },
},{timestamps: true});

module.exports = mongoose.model("Order", orderSchema);
