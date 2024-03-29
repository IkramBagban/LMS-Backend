const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    // required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: 'Customer' 
  },
  recipient: {  
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: 'Customer'  
  },
  name  : {
    type : String
  },
  to:{
    type : String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
