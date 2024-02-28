const asyncHandler = require("../utils/asyncHandler.js");
const ApiError = require("../utils/ApiError.js");  
const jwt=require("jsonwebtoken");
const User = require("../models/user.model.js");



const verifyJWT = asyncHandler(async(req,res,next)=>{
  try {
   
    const token = req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","");
    
    if( !token ){
        throw new ApiError(401,"Unauthorized request"); 
    }

    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if( !user ){
        throw new ApiError(401,"Invalid access token");
    }
    req.user = user;//we are storing the user object in the req.user so that we can access the user object in the next middleware
    next();
  } catch ( error ) {
    throw new ApiError(401,error?.message||"Invalid access token");
  }
})
module.exports = verifyJWT;












//const dotenv=require("dotenv");
// dotenv.config({path:"../../.env"});
 //console.log("decodedToken",decodedToken);
// const accessToken=req.cookies.accessToken;
//if the access token is present in the cookies then we are storing it in the token variable otherwise we are storing the access token which is present in the header in the token variable
    //bearer token is used to authenticate the user (format of the bearer token is Bearer <token>)) 
    //.replace is used to replace the bearer with an empty string 
    //console.log("token",token);