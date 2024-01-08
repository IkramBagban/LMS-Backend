const express = require('express')

const router = express.Router();

const authController = require('../controllers/auth')

router.get('/customers', authController.getCustomers)

router.post('/signup', authController.postCustomer)

router.post('/login', authController.postLogin)

router.post('/guest', authController.loginAsGuest)



module.exports = router;