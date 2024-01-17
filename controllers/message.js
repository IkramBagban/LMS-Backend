const Message = require('../models/message')
exports.saveMessage = async (messageData) =>{
    // const messageData = req.body;

    const message = new Message(messageData)
    // await Message.deleteMany({})
    return await message.save();
}
exports.getMessages =async (messageData) =>{
    // const messageData = req.body;

    // const message = new Message(messageData)
    const messages = await Message.find()
    return messages
    // message.save();
}

exports.getMessages