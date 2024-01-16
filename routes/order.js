const express = require('express')

const router = express.Router();

const orderController = require('../controllers/order')


router.get('/:customerID', orderController.getOrder)

router.post('/', orderController.postOrd    er)


module.exports = router;