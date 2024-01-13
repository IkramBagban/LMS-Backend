const express = require("express");

const app = express();
const PORT = process.env.PORT ||  9090;

const cors = require('cors')
require('dotenv').config();

const customerRoutes = require("./routes/customer");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const mongoose = require("mongoose");

app.use(express.json())

app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use("/auth", customerRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.get("/", (req, res) => {
  res.json({ email: "test@gmail.com", password: "12312313" });
});

app.listen(PORT, () => {
  console.log("server is listening on PORT " + PORT);
});
  
mongoose
  .connect(process.env.mongoURI)
  .then(() => {
    console.log('connected')
  })

  .catch((err) => {
    console.log(err);
  });
