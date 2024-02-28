const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');

const userSchema=new mongoose.Schema({
    username:{ type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        index:true
    },
    firstName:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    lastName:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    // dateOfBirth:{
    //     type:Date,
        
    // },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{type:String,required:[true,"Password is required"]},
    refreshToken:{type:String}
},{timestamps:true});
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password=await bcrypt.hash(this.password,10);
    next();
});

//incorrect password
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
};
userSchema.methods.generateAccessToken=function(){
    //jwt.sign(payload,secretKey,options) //jwt.sign is used to generate the token //option is used to set the expiry time of the token also we can set the algorithm which is used to encrypt the payload
    return jwt.sign({ //first object is the payload which is the data which we want to store in the token and the second object is the secret key which is used to encrypt the payload
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET, //secret key which is used to encrypt the payload
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY //expiry time of the token 
    })
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
};


const User=mongoose.model("User",userSchema);
module.exports=User;
