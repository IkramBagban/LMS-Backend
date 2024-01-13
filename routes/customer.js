const express = require("express");

const { body } = require("express-validator");

const router = express.Router();

const authController = require("../controllers/auth");

router.get("/customers", authController.getCustomers);

router.post(
  "/signup",
  // [
  //   body("first_name").isString().withMessage("firstname should be string."),
  //   body("last_name").isString().withMessage("last_name should be string."),
  //   body("rate_code").isString().withMessage("rate_code should be string."),
  //   body("area").isString().withMessage("area should be string."),
  //   body("street_name").isString().withMessage("street_name should be string."),
  //   body("apartment").isString().withMessage("apartment should be string."),
  //   body("address").isString().withMessage("address should be string."),
  //   body("contact_number")
  //     .isLength({ min: 10 })
  //     .withMessage("contact number should be 10 digit long."),
  //   body("alter_Contact_Number")
  //     .isLength({ min: 10 })
  //     .withMessage("contact number should be 10 digit long."),
  //   body("email").isEmail().withMessage("Not a valid email."),
  //   body("Password")
  //     .isLength({ min: 5 })
  //     .withMessage("Password should be atleast 5 char long."),
  //   body("confirmPassword")
  //     .isLength({ min: 5 })
  //     .withMessage("confirmPassword should be atleast 5 char long."),
  // ],
  authController.postCustomer
);

router.post("/login", authController.postLogin);

router.post("/guest", authController.loginAsGuest);

router.post("/sendotp", authController.postSendOTP);

router.post("/verifyOtp", authController.postVerifyOtp);

router.patch("/resetpassword", authController.postResetPassword);

router.put("/update/:customerId", authController.postUpdateCustomer);

module.exports = router;
