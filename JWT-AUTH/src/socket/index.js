//const io = require('socket.io')(http) // ( ) means we are invoking the function and passing http as an argument to it . it is used for creating the socket server to listen to the events
const { Server, Socket } = require("socket.io");
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const ApiError = require('../utils/ApiError.js');
const User = require('../models/user.model.js');
const ApiResponce = require('../utils/ApiResponce.js');
const { AvailabeChatEvents ,  chatEventEnum } = require("../constaints.js");


 const mountJoinChatEvent = (socket) =>{ // we are mounting the joinChat event
    socket.on(chatEventEnum.JOIN_CHAT_EVENT, (chatId)=>{ //.on is used to listen to the event
        console.log(`User joined the chat 🤝. chatId: `, chatId);
        socket.join(chatId); // this line is used to join the user to the chatId
    });
};

const mountParticipantTypingEvent = (socket) =>{ // we are mounting the typing event
    socket.on(chatEventEnum.TYPING_EVENT, (chatId)=>{
        socket.in(chatId).emit(chatEventEnum.TYPING_EVENT, chatId);
    });
};

const mountParticipantStoppedTypingEvent = (socket) => { // we are mounting the stopTyping event
    socket.on(chatEventEnum.STOP_TYPING_EVENT, (chatId) => {
      socket.in(chatId).emit(chatEventEnum.STOP_TYPING_EVENT, chatId);
    }); //emit means sending the event //in means sending the event to the particular chatId
  };


  const initializeSocketIO = (io) => { // we are initializing the socket server
    return io.on("connection",async (socket) => { //we are listening to the connection event
        try{
            const cookies = cookie.parse(socket.handshake.headers?.cookie || ""); // we are parsing the cookies which are present in the socket.handshake.headers.cookie and storing it in the cookies variable

            const token = cookies?.accessToken ; 

            if(!token){
                throw new ApiError(401,"Unauthorized request");
            }

            const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

            const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

            if(!user){
                throw new ApiError(401,"Invalid access token");
            }

            socket.user = user; // we are storing the user object in the socket.user so that we can access the user object in the next middleware

            socket.join(user._id.toString()); // we are joining the user to the socket server
            //join function is in the socket.io library which is used to join the user to the socket server
            
            socket.emit(chatEventEnum.CONNECTED_EVENT);
            //emit is used to send the event to the frontend

            mountJoinChatEvent(socket); 
            mountParticipantTypingEvent(socket);
            mountParticipantStoppedTypingEvent(socket);

            socket.on(chatEventEnum.DISCONNECTED_EVENT,() =>{
                console.log("user has disconnected 🚫. userId: " + socket.user?._id);
                if(socket.user?._id) socket.leave(socket.user._id);
            })
        }catch(error){
            socket.emit(chatEventEnum.SOCKET_ERROR_EVENT,error?.message||"Something went wrong while connecting to the socket server"); 
        }
    
    })
  }


  const emitSocketEvent = (req, roomId, event, payload) => {
  req.app.get("io").in(roomId).emit(event, payload);
};

module.exports = {initializeSocketIO,emitSocketEvent};
