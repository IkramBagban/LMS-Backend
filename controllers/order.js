const Order = require("../models/order");
const Customer = require("../models/customer");

exports.getOrder = async (req, res, next) => {
  const customerID = req.params.customerID;
  
  const order = await Order.find({ customerID: customerID });

  res
    .status(200)
    .json({
      message: "Order Fetched Successfully",
      data: order,
      success: true,
    });
};

exports.postOrder = async (req, res, next) => {
  let {
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
        success: true,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "order failed", success: false });
  }
};
