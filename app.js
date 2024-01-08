const express = require("express");

const app = express();
const PORT = 9090;


const userRoutes = require("./routes/user");
const mongoose = require("mongoose");

app.use(express.json())

app.use("/auth", userRoutes);
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
