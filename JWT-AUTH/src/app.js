const express=require('express');
const cors=require('cors');
const cookieParser=require('cookie-parser');

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:'16kb',extended:true}))
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(cookieParser())





//routes import

const  userRouter=require('../src/routes/user.routes.js')
app.use("/api/v1/users",userRouter);
app.get("/",(req,res)=>{
    res.send("Hi");
})
module.exports=app;
