const ApiError = require('../utils/ApiError.js');
const ApiResponse=require('../utils/ApiResponse.js');
const asyncHandler=require('../utils/asyncHandler.js');
const User=require("../models/user.model.js");
//const jwt=require('jsonwebtoken');

const generateAccessAndRefreshTokens=async(userId)=>{ //
    try {
        const user= await User.findById(userId);
        const accessToken= user.generateAccessToken();// we are generating the accessToken it is a method which is present in the user model
        const refreshToken= user.generateRefreshToken();// we are generating the refreshToken it is a method which is present in the user model
        
        user.refreshToken=refreshToken;// we are storing the refreshToken in the database
        await user.save({validateBeforeSave:false});// we are saving the user object in the database and we are not validating the user object before saving it in the database

        return {accessToken,refreshToken};
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access token");
        
    }
}


const registerUser=asyncHandler(async (req,res)=>{
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    const{firstName,lastName,email,username,password}=req.body;
    console.log(firstName);
if([firstName,lastName,email,username,password].some((field)=>field?.trim()==="")){
    throw new ApiError(400,"All fields are required");
}
const existedUser=await User.findOne({
    $or:[ //or operator is used to check if any of the condition is true then it will return the result
        {username}, {email}
    ]
});
if(existedUser){
    throw new ApiError(409,"User already exists");
}
const user= await User.create({ /// we are creating the user object and storing the response in the user variable and then we are storing the user object in the database
    firstName,
    lastName,
    email,
    password,
    username:username
})
const createdUser=await User.findById(user._id).select("-password -refreshToken");// we are removing the password and refreshToken from the response
if(!createdUser){ // if the user is not created then we are throwing an error
    throw new ApiError(500,"Something went wrong while registering the user");
}
return res.status(201).json(new ApiResponse(200,createdUser,"User registered successfully"));// we are sending the response to the frontend
});


const loginUser=asyncHandler(async (req,res)=>{
    //req body->data
    //username or email
    //find the user
    //password check
    //generate access token and refresh token
    //send cookies to frontend

    const {email,username,password}=req.body;
    console.log("email",email);
    console.log(password);
    if(!email && !username){ //if the email or username is not present then we are throwing an error
        throw new ApiError(400,"Email or username is required");
    }

    const user=await User.findOne({
        $or:[
            {email},{username}
        ]
    })

    if(!user){//if the user is not present in the database then we are throwing an error
        throw new ApiError(404,"User does not exist");

    }

    const isPasswordValid=await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401,"Password is incorrect");
    
    }

    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id);

    const loggedInUser=await User.findById(user._id).select("-password -refreshToken");

    const options={ // we are storing the options in the options variable and then we are storing the options in the cookies
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,
        {
            user:loggedInUser,
            accessToken,
            refreshToken
        
        },
        "User logged in successfully"
        )
    )
});

const logoutUser=asyncHandler(async(req,res)=>{
    //clear cookies
    await User.findByIdAndUpdate(req.user._id,
        {
            $unset:{
                refreshToken:1 // it is used to remove the refreshToken field from the database
            }
        },
        {
            new:true
        }
        )
    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged out successfully"))

});

module.exports={registerUser,loginUser,logoutUser};