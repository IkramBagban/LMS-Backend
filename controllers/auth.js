const Customer = require("../models/customer");

exports.getCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find();

    if (!customers || customers.length === 0) {
      return res.status(404).json({ message: "No customers found" });
    }

    res.status(200).json({ data: customers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.postCustomer = async (req, res, next) => {
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

  const customer = new Customer({
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
  });

  try {
    const response = await customer.save();

    if (response) {
      res.status(201).json({ message: "customer created successfully." });
    }
  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
    console.log(err);
  }
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  const customer = await Customer.findOne({ email: email });
  console.log("customer", customer);

  if (!customer) {
    res.status(404).json({ message: "customer not found." });
    return;
  }

  if (customer.password !== password) {
    return res.status(401).send("Incorrect password");
  }

  res.status(200).json({ message: "Loggedin successfully", data: customer });
};


exports.loginAsGuest = async (req, res, next) => {
    const {
        email,
        rate_code
    } = req.body;
  
    const customer = new Customer({
        email,
        rate_code
    });
  
    try {
      const response = await customer.save();
  
      if (response) {
        console.log('res', response)
        res.status(201).json({ message: "successfully loggedin as guest" , data : response });
      }
    } catch (err) {
      res.status(500).json({ message: "Signup failed" });
      console.log(err);
    }
  };
  