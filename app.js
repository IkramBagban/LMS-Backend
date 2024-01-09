const express = require("express");

const app = express();
const PORT = 9090;

const cors = require('cors')
require('dotenv').config();

const customerRoutes = require("./routes/customer");
const productRoutes = require("./routes/product");
const mongoose = require("mongoose");

app.use(express.json())
app.use(cors())

app.use("/auth", customerRoutes);
app.use("/products", productRoutes);
app.get("/", (req, res) => {
  res.json({ email: "test@gmail.com", password: "12312313" });
});

mongoose
  .connect("mongodb://127.0.0.1:27017/ModernLaundry")
  .then(() => {
    app.listen(PORT, () => {
      console.log("server is listening on port " + PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
