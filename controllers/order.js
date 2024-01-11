const Order = require("../models/order");
const Customer = require("../models/customer");


exports.getOrder = async (req, res, next) => {
  // id,
  // subtotal,
  // pickupDate,
  // deliveryDate,
  // emirate_id,
  // deliveryType,
  // orderStatus,
  // "Total Items": [
  //   {
  //     item,
  //     qty,
  //     service,
  //     DELIVERY,
  //     Price,
  //   },
  // ],
  // subtotal,

  const customerID = req.params.customerID;
  // 
  const order = await Order.find({customerID : customerID})
  console.log(order.length)
  res.status(200).json({message : "Order Fetched Successfully", data : order})
}

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

  console.log('req.body', req.body)
  customerID = customerID || "659fd037814c3d2d47337600"
  console.log('customer id' , customerID)

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
