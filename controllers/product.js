const Product = require("../models/product");
// const { data } = require("../productdata");

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};
