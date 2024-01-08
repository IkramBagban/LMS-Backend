const express = require("express");

const app = express();
const PORT = 9090;

require('dotenv').config();

const customerRoutes = require("./routes/customer");
const mongoose = require("mongoose");

app.use(express.json())

app.use("/auth", customerRoutes);
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
