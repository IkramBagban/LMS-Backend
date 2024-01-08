const express = require('express')

const router = express.Router();

const authController = require('../controllers/auth')

router.post('/signup', authController.postCustomer)

router.post('/login', authController.postLogin)

router.get('/customers', authController.getCustomers)

module.exports = router;