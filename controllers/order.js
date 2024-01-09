    const bcrypt = require("bcrypt");
    const Order = require("../models/order");
    const Customer = require("../models/customer");

    exports.postOrder = async (req, res, next) => {
    //   const {
    //     branch,
    //     SpecialRequests,
    //     custName,
    //     subtotal,
    //     deliveryType,
    //     pickupDate,
    //     order_source,
    //     emirate_id,
    //     orderDelete,
    //     order_item,
    //     deliveryDate,
    //     customerID,
    //   } = req.body;

    //   const order = new Order({
    //     branch,
    //     SpecialRequests,
    //     custName,
    //     subtotal,
    //     deliveryType,
    //     pickupDate,
    //     order_source,
    //     emirate_id,
    //     orderDelete,
    //     order_item,
    //     deliveryDate,
    //     customerID,
    //   });


    const dummyData = {
        branch: "YourDefaultBranchId",
        SpecialRequests: "Some special requests",
        customerID: "659c176d535467ac2730c931", // Replace with the actual customer ID
        custName: "YourCustomerId", // Replace with the actual customer name or ID
        subtotal: "100.00", // Replace with the actual subtotal
        deliveryType: "YourDeliveryType", // Replace with the actual delivery type
        pickupDate: "2022-01-15", // Replace with the actual pickup date
        order_source: "Mobile",
        emirate_id: "YourEmirateId", // Replace with the actual Emirate ID
        orderDelete: "-",
        order_item: [
        {
            item: "YourItemId1", // Replace with the actual item ID
            service: "YourServiceId1", // Replace with the actual service ID
            DELIVERY: "YourDeliveryType1", // Replace with the actual delivery type
            qty: "2", // Replace with the actual quantity
            Price: "50.00", // Replace with the actual price
        },
        {
            item: "YourItemId2", // Replace with the actual item ID
            service: "YourServiceId2", // Replace with the actual service ID
            DELIVERY: "YourDeliveryType2", // Replace with the actual delivery type
            qty: "3", // Replace with the actual quantity
            Price: "30.00", // Replace with the actual price
        },
        // Add more items as needed
        ],
        deliveryDate: "2022-01-20", // Replace with the actual delivery date
    };

    try {
        const order = new Order(dummyData)
        const response = await order.save();

        console.log('rres',response)
        // await Customer.addOrder(response._id)
        const customer = await Customer.findById(dummyData.customerID);
    await customer.addOrder(response._id);
        if (response) {
        res.status(201).json({ message: "order has been created successfully." });
        }
    } catch (err) {
        res.status(500).json({ message: "order failed" });
        console.log(err);
    }
    };
