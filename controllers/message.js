const Customer = require("../models/customer");
const Message = require("../models/message");

exports.saveMessage = async (messageData) => {
  const message = new Message(messageData);
  //   await Message.deleteMany()
  return await message.save();
};

exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Customer.find().select("first_name last_name email");

    if (!accounts || accounts.length === 0) {
      return res
        .status(404)
        .json({ message: "No customers found", success: false });
    }

    res.status(200).json({
      message: "Accounts Retrived successfully",
      totalAccounts: accounts.length,
      data: accounts,
      success: true,
    });
  } catch (err) {
    
    console.error('getaccounts in catch');
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

exports.getMessages = async (req, res) => {
  const senderId = req.params.senderId;
  //   const recipient = req.params.recipient;
  const messages = await Message.find({
    $or: [{ senderId: senderId }, { recipient: senderId }],
  });
  res.json({ data: messages });
  return messages;
};

exports.getMessages;
