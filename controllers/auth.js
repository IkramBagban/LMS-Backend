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
    password,
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
    password,
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

exports.postLogin = async (req, res, next) => {
    const {email, password} = req.body;

    const user = await User.findOne({email : email});
    console.log('user', user)

    if(!user){
        res.status(404).json({message : "user not found."})
        return;
    }

    if(user.password !== password){
       return res.status(401).send("Incorrect password");
    }

    res.status(200).json({message : "Loggedin successfully", data : user})
    
}