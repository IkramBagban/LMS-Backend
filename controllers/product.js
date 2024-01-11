
const Product = require("../models/product");
const { data } = require("../productdata");

exports.getProducts = async (req,res) =>{
    // await Product.create(data)
   const products =  await Product.find()
   console.log('data', data.length)
   
    res.json(data);
}