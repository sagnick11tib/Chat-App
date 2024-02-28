// Importing modules
const mongoose = require("mongoose");
const { ChatEventEnum } = require("../constaints.js");
const { User } = require("../models/user.model.js");
const { Chat } = require("../models/chatRoom.model.js");
const { ChatMessage } = require("../models/message.model.js");
const { emitSocketEvent } = require("../socket/index.js");
const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const { removeLocalFile } = require("../utils/helpers.js");


const chatCommonAggregation = () => {
    return [
      {
        // lookup for the participants present
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "participants",
          as: "participants",
          pipeline: [
            {
              $project: {
                password: 0,
                refreshToken: 0,
                forgotPasswordToken: 0,
                forgotPasswordExpiry: 0,
                emailVerificationToken: 0,
                emailVerificationExpiry: 0,
              },
            },
          ],
        },
      },
      { 
        // lookup for the group chats
        $lookup: {
          from: "chatmessages",
          foreignField: "_id",
          localField: "lastMessage",
          as: "lastMessage",
          pipeline: [
            {
              // get details of the sender
              $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "sender",
                as: "sender",
                pipeline: [
                  {
                    $project: {
                      username: 1,
                      avatar: 1,
                      email: 1,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                sender: { $first: "$sender" },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          lastMessage: { $first: "$lastMessage" },
        },
      },
    ];
  };

const searchAvailableUsers = asyncHandler(async (req,res)=>{
            //TODO: Implement search available users
});

const createOrGetAOneOnOneChat = asyncHandler(async (req,res)=>{ 
    const { receiverId } = req.params; // receiverId is the id of the user we want to chat with
    if(!mongoose.isValidObjectId(receiverId)){
        throw new ApiError(400, "Invalid receiver id");
    }
    const receiver = await User.findById(receiverId); // receiverid is the id of the user we want to chat with

    if(!receiver){
        throw new ApiError(404, "Receiver not found");
    }

    if(receiver._id.toString() === req.user._id.toString()){  // we cannot comapre two object ids directly so we convert them to string
        throw new ApiError(400, "You can not chat with yourself");
    }

   
    const chat = await Chat.aggregate([ 
        //1. match the chat where the chat is not a group chat and the participants array contains the logged in user and the receiver id
        //2. then we are using the chatCommonAggregation function to get the details of the participants like username, email, avatar etc
        //3. check the last message of the chat and get the details of the sender of the last message (chat.length is exist then we will return the chat)
        //4. if the chat is not present then we will create a new chat instance and return the chat (me = req.user._id and receiverId = receiverId)
        //5. create a new chat where match the id and get the details of the participants like username, email, avatar etc from the user model
        //6. check the last message of the chat and get the details of the sender of the last message (payload = chat[0] if the payload is not present then we will throw an error)
        //7. if the payload is present then we will emit a socket event to the receiver id and return the payload
        //


        {
            $match:{
                isGroupChat: false,
                $and: [ // we are using $and to match both the conditions in the array if 1 condition is true then it will return the chat
                    { participants: { $elemMatch: { $eq: req.user._id } } }, //check the user is logged in or not 
                    { participants: { $elemMatch: { $eq: new mongoose.Types.ObjectId(receiverId) } } } //check the receiverId is equal to the user id or not 
                ]
            }
        },
        ...chatCommonAggregation()
    ]);

    if(chat.length){ // if the chat is already present then we will return the chat

        return res
        .status(200)
        .json(new ApiResponse(200, "Chat retrived successfully", chat[0]));
    }

    const newChatInstance = await Chat.create({
        name:"One on One Chat",
        participants: [req.user._id, new mongoose.Types.ObjectId(receiverId)],
        admin: req.user._id
    });

    const createdChat = await Chat.aggregate([
        {
            $match:{
                _id: newChatInstance._id
            }
        },
        ...chatCommonAggregatePipeline()
    ])

    const payload = createdChat[0];

    if(!payload){
        throw new ApiError(500, "Something went wrong");
    }

    payload?.participants?.forEach((participant) => { // for each represent the participants in the chat in our case we have 2 participants one is the logged in user and the other is the receiver
        if(participant._id.toString() === req.user._id.toString()) return;
        emitSocketEvent(req,participant._id?.toString(),ChatEventEnum.NEW_CHAT, payload);
        //req is used to get the user id of the logged in user and participant._id is used to get the id of the receiver
        //ChatEventEnum.NEW_CHAT is used to emit the socket event to the receiver
        //payload is the chat instance that we have created
    });

    return res
    .status(201)
    .json(new ApiResponse(201, "Chat created successfully", payload));

});

const createAGorupChat  = asyncHandler(async (req,res) => {});

const getGroupChatDetails = asyncHandler(async (req,res) => {});

const renameGroupChat = asyncHandler(async (req,res) => {});

const deleteGroupChat = asyncHandler(async (req,res) => {});

const deleteOneOnOneChst = asyncHandler(async (req,res) => {});

const leaveGroupChat = asyncHandler(async (req,res) => {});

const addNewParticipantInGroupChat = asyncHandler(async (req,res) => {});

const removeParticipantFromGroupChat = asyncHandler(async (req,res) => {});

const getAllCharts = asyncHandler(async (req,res) => {});


module.exports = {
    searchAvailableUsers,
    createOrGetAOneOnOneChat,
    createAGorupChat,
    getGroupChatDetails,
    renameGroupChat,
    deleteGroupChat,
    deleteOneOnOneChst,
    leaveGroupChat,
    addNewParticipantInGroupChat,
    removeParticipantFromGroupChat,
    getAllCharts
};