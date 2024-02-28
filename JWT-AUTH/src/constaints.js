module.exports={
    name:"auth"
};

const chatEventEnum = Object.freeze({
    CONNECTED_EVENT: "connected",
    DISCONNECTED_EVENT: "disconnected",
    JOIN_CHAT_EVENT: "joinChat",
    LEAVE_CHAT_EVENT: "leaveChat",
    UPDATE_GROUP_NAME_EVENT: "updateGroupName",
    MESSAGE_RECEIVED_EVENT: "messageReceived",
    NEW_CHAT_EVENT: "newChat",
    SOCKET_ERROR_EVENT: "socketError",
    STOP_TYPING_EVENT: "stopTyping",
    TYPING_EVENT: "typing"
});

const AvailabeChatEvents = Object.values(chatEventEnum);

module.exports = { AvailabeChatEvents ,  chatEventEnum };



