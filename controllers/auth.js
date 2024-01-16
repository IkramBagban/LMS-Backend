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
      return res
        .status(404)
        .json({ message: "No customers found.", success: false });
    }

    res.status(200).json({ data: customers, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

exports.getCustomer = async (req, res, next) => {
  const customerId = req.params.customerId;
  try {
    const customer = await Customer.find({ _id: customerId });
    console.log('custoemr')
    // console.log(customer)

    if (!customer || customer.length === 0) {
      return res
        .status(404)
        .json({ message: "No customer found.", success: false });
    }

    res.status(200).json({ data: customer, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
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

  const existingCustomer = await Customer.findOne({ email: email });

  if (existingCustomer) {
    return res
      .status(409)
      .json({ message: "Email already in use", success: false });
  }

  const hashedPassword = await bcrypt.hash(Password, 12);

  if (!hashedPassword) {
    return res.status(500).json({ message: "server error", success: false });
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
      res
        .status(201)
        .json({ message: "customer created successfully.", success: true });
    }
  } catch (err) {
    res.status(500).json({ message: "Signup failed", success: false });
    console.log(err);
  }
};

exports.postLogin = async (req, res, next) => {
  const { email, Password } = req.body;
  try {
    const customer = await Customer.findOne({ email: email });

    if (!customer) {
      res.status(404).json({ message: "customer not found.", success: false });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(Password, customer.Password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ message: "Incorrect password", success: false });
    }

    res.status(200).json({
      message: "Loggedin successfully",
      data: customer,
      success: true,
    });
  } catch (e) {
    res.status(500).json({ message: "server error", success: false });
  }
};

exports.loginAsGuest = async (req, res, next) => {
  const { email, rate_code } = req.body;

  const existingCustomer = await Customer.findOne({ email: email });

  if (existingCustomer) {
    return res
      .status(409)
      .json({ message: "Email already in use", success: false });
  }

  const customer = new Customer({
    email,
    rate_code,
  });

  try {
    const response = await customer.save();

    if (response) {
      res.status(201).json({
        message: "successfully loggedin as guest",
        data: response,
        success: true,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal error", success: false });
    console.log(err);
  }
};

exports.postSendOTP = async (req, res, next) => {
  const email = req.body.email;

  try {
    const customer = await Customer.findOne({ email: email });

    if (!customer) {
      return res
        .status(404)
        .json({ message: "email not found", success: false });
    }
    let otp = customer.otp;

    if (!customer.otp || customer.otpExpiration <= Date.now()) {
      console.log("in");
      otp = Math.floor(Math.random() * 9000 + 1000);
      customer.otp = otp;
      customer.otpExpiration = Date.now() + 300000;
    }

    await customer.save();
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
    res
      .status(200)
      .json({ message: "OTP has sent to your email", otp: otp, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal error", success: false });
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
      return res.status(401).json({ message: "Invalid OTP", success: false });
    }

    if (customer.otpExpiration <= Date.now()) {
      return res.status(401).json({ message: "Otp expired", success: false });
    }
    customer.otp = undefined;
    customer.otpExpiration = undefined;

    const response = await customer.save();
    if (!response) {
      return res.status(500).json({ message: "server error", success: false });
    }
    res
      .status(200)
      .json({ message: "OTP verified successfully", success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error", success: false });
  }
};

exports.postResetPassword = async (req, res, next) => {
  const { email, Password, confirmPassword } = req.body;
  try {
    console.log(req.body);
    const customer = await Customer.findOne({ email: email });

    if (!customer) {
      return res
        .status(404)
        .json({ message: "Email Not Found.", success: false });
    }

    if (Password !== confirmPassword) {
      return res
        .status(401)
        .json({ message: "password don't match.", success: false });
    }

    const hashedPassword = await bcrypt.hash(Password, 12);

    if (!hashedPassword) {
      return res.status(500).json({ message: "server error", success: false });
    }
    customer.Password = hashedPassword;
    customer.confirmPassword = confirmPassword;

    const response = await customer.save();

    if (response) {
      res.status(200).json({ message: "Password Reset.", success: true });
    }
  } catch (err) {
    res.status(500).json({ message: "Password reset failed", success: false });
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
      return res
        .status(404)
        .json({ message: "Customer not found.", success: false });
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
        success: true,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
