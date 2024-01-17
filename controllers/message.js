const Message = require('../models/message')
exports.saveMessage = (messageData) =>{
    // const messageData = req.body;

    const message = new Message(messageData)
    console.log('message data')

    message.save();


}