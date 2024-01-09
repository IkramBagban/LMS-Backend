const Order = require("../models/order");
const Customer = require("../models/customer");

exports.postOrder = async (req, res, next) => {
  const {
    branch,
    SpecialRequests,
    custName,
    subtotal,
    deliveryType,
    pickupDate,
    order_source,
    emirate_id,
    orderDelete,
    order_item,
    deliveryDate,
    customerID,
  } = req.body;

  try {
    const order = new Order({
      branch,
      SpecialRequests,
      custName,
      subtotal,
      deliveryType,
      pickupDate,
      order_source,
      emirate_id,
      orderDelete,
      order_item,
      deliveryDate,
      customerID,
    });
    const response = await order.save();

    const customer = await Customer.findById(customerID);
    await customer.addOrder(response._id);
    if (response) {
      res.status(201).json({
        message: "order has been created successfully",
      });
    }
  } catch (err) {
    res.status(500).json({ message: "order failed" });
    console.log(err);
  }
};
