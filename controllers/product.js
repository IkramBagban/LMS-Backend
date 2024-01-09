
const Product = require("../models/product");

exports.getProducts = async (req,res) =>{
    await Product.create(data)
    res.json(data);
}