const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    },
    attachments: {
        type: [
            {
            url: String,
            localPath: String,
           }
    ],
        default: []
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatRoom'
    }  
}, { timestamps: true });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
module.exports = ChatMessage;