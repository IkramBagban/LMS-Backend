const express = require("express");

const { body } = require("express-validator");

const router = express.Router();

const authController = require("../controllers/auth");

router.get("/customers", authController.getCustomers);
router.get("/customers/:customerId", authController.getCustomer);

router.post(
  "/signup",
  authController.postCustomer
);

router.post("/login", authController.postLogin);

router.post("/guest", authController.loginAsGuest);

router.post("/sendotp", authController.postSendOTP);

router.post("/verifyOtp", authController.postVerifyOtp);

router.patch("/resetpassword", authController.postResetPassword);

router.put("/update/:customerId", authController.postUpdateCustomer);

module.exports = router;
