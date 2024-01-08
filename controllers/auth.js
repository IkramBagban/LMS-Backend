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
    password,
    confirmPassword,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

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
    password: hashedPassword,
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
  try {
    const customer = await Customer.findOne({ email: email });

    if (!customer) {
      res.status(404).json({ message: "customer not found." });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, customer.password);
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
    const response = await Customer.findOne({ email: email });

    if (!response) {
      return res.status(404).json({ message: "email not found" });
    }

    const otp = Math.floor(Math.random() * 9000 + 1000);
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
