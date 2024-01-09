const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  itemID: {
    type: String,
    // required: true,
  },
  image_url: {
    type: String,
    // required: true,
  },
  itemCode: {
    type: String,
    // required: true,
  },
  RateCodeNAMe: {
    type: String,
    // required: true,
  },
  item_name: {
    type: String,
    // required: true,
  },
  id: {
    type: String,
    // required: true,
  },
  rateCode: {
    type: String,
    // required: true,
  },
  pricing: [
    {
      item_code: {
        type: String,
        // required: true,
      },
      item: {
        type: String,
        // required: true,
      },
      service: {
        type: String,
        // required: true,
      },
      price: {
        type: String,
        // required: true,
      },
      deliveryType: {
        type: String,
        // required: true,
      },
      discount: {
        type: String,
        // required: true,
      },
      branch: {
        type: String,
        // required: true,
      },
      emirate_id: {
        type: String,
        // required: true,
      },
    },
  ],
  item_cat1: {
    type: String,
    // required: true,
  },
  itemImage: {
    type: String,
    // required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
