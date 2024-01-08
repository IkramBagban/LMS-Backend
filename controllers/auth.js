const User = require("../models/user");
exports.createUser = async (req, res, next) => {
  const {
    first_name,
    last_name,
    rate_code,
    area,
    street_name,
    apartment,
    address,
    contact_number,
    alter_Contact_Number,
    email,
    Password,
    confirmPassword,
  } = req.body;

  const user = new User({
    first_name ,
    last_name,
    rate_code,
    area,
    street_name,
    apartment,
    address,
    contact_number,
    alter_Contact_Number,
    email,
    Password,
    confirmPassword,
  });

  try {
    const response = await user.save();

    if (response) {
      res.status(201).json({ message: "User created successfully." });
    }
  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
    console.log(err);
  }
};
