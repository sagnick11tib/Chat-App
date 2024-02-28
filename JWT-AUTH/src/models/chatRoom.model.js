const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    isGroupChat:{
        type: Boolean,
        default: false
    },
    lastMessage:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatMessage"
    },
    participants:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const ChatRoom = mongoose.model('ChatRoom', chatSchema);
module.exports = ChatRoom;