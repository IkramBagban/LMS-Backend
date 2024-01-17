const Message = require("../models/message");

exports.saveMessage = async (messageData) => {
  const message = new Message(messageData);
  return await message.save();
};
exports.getMessages = async (req, res) => {
  const senderId = req.params.senderId;
  const messages = await Message.find({
    $or: [{ senderId: senderId }, { recipient: senderId }],
  });
  res.json({ data: messages });
  return messages;
};

exports.getMessages;
