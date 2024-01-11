const bcrypt = require("bcrypt");
const Customer = require("../models/customer");

const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

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
    Password,
    confirmPassword,
  } = req.body;

  const hashedPassword = await bcrypt.hash(Password, 12);

  if (!hashedPassword) {
    return res.status(500).json({ message: "server error" });
  }

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
    Password: hashedPassword,
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
  const { email, Password } = req.body;
  try {
    const customer = await Customer.findOne({ email: email });

    if (!customer) {
      res.status(404).json({ message: "customer not found." });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(Password, customer.Password);
    if (!isPasswordMatch) {
      return res.status(401).send("Incorrect password");
    }

    res.status(200).json({ message: "Loggedin successfully", data: customer });
  } catch (e) {
    res.status(500).send("server error");
  }
};

exports.loginAsGuest = async (req, res, next) => {
  const { email, rate_code } = req.body;

  const customer = new Customer({
    email,
    rate_code,
  });

  try {
    const response = await customer.save();

    if (response) {
      res
        .status(201)
        .json({ message: "successfully loggedin as guest", data: response });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal error" });
    console.log(err);
  }
};

exports.postSendOTP = async (req, res, next) => {
  const email = req.body.email;

  try {
    const customer = await Customer.findOne({ email: email });

    if (!customer) {
      return res.status(404).json({ message: "email not found" });
    }
    let otp = customer.otp;

    if (!customer.otp || customer.otpExpiration <= Date.now()) {
      console.log("in");
      otp = Math.floor(Math.random() * 9000 + 1000);
      customer.otp = otp;
      customer.otpExpiration = Date.now() + 300000;
    }

    await customer.save();
    console.log(otp + " " + email);
    transporter.sendMail({
      to: email,
      from: "bagbanikram@gmail.com",
      subject: "OTP to forget password.",
      html: `
            <div>
                <h3>OTP</h3>
                ${otp}
            </div>
            `,
    });
    res.status(200).json({ message: "OTP has sent to your email", otp: otp });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal error" });
  }
};

exports.postVerifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const customer = await Customer.findOne({
      email: email,
      otp: otp,
    });
    console.log("customer", customer);

    if (!customer) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    if (customer.otpExpiration <= Date.now()) {
      return res.status(401).json({ message: "Otp expired" });
    }
    customer.otp = undefined;
    customer.otpExpiration = undefined;

    const response = await customer.save();
    if (!response) {
      return res.status(500).json({ message: "server error" });
    }
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }
};

exports.postResetPassword = async (req, res, next) => {
  const { email, newPassword, confirmPassword } = req.body;
  try {
    const customer = await Customer.findOne({ email: email });

    if (!customer) {
      return res.status(404).json({ message: "Email Not Found." });
    }

    if (newPassword !== confirmPassword) {
      return res.status(401).json({ message: "password don't match." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    if (!hashedPassword) {
      return res.status(500).json({ message: "server error" });
    }
    customer.Password = hashedPassword;

    const response = await customer.save();

    if (response) {
      res.status(201).json({ message: "Password Reset." });
    }
  } catch (err) {
    res.status(500).json({ message: "Password reset failed" });
    console.log(err);
  }
};

exports.postUpdateCustomer = async (req, res, next) => {
  const customerId = req.params.customerId; // Assuming you can get the customer ID from the route parameters
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
  } = req.body;

  try {
    // Fetch the existing customer record
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    customer.first_name = first_name || customer.first_name;
    customer.last_name = last_name || customer.last_name;
    customer.rate_code = rate_code || customer.rate_code;
    customer.area = area || customer.area;
    customer.street_name = street_name || customer.street_name;
    customer.apartment = apartment || customer.apartment;
    customer.address = address || customer.address;
    customer.contact_number = contact_number || customer.contact_number;
    customer.alter_Contact_Number =
      alter_Contact_Number || customer.alter_Contact_Number;

    const response = await customer.save();

    if (response) {
      res.status(200).json({
        message: "Customer profile updated successfully.",
        data: response,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
