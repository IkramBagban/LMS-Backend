const Product = require("../models/product");

const { products } = require("../products.js");

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.postProducts = async (req, res) => {
  await Product.create(products);
  // console.log(products)
  res.json(products);
};
