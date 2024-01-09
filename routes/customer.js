const express = require('express')

const router = express.Router();

const authController = require('../controllers/auth')

router.get('/customers', authController.getCustomers)

router.post('/signup', authController.postCustomer)

router.post('/login', authController.postLogin)

router.post('/guest', authController.loginAsGuest)

router.post('/sendotp', authController.postSendOTP)

router.post('/verifyOtp', authController.postVerifyOtp)

router.patch('/resetpassword', authController.postResetPassword)


module.exports = router;