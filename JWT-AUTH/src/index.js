require('dotenv').config({path:'../.env'});
const connectDB=require('../src/config/connection.js');
const app=require('../src/app.js');

connectDB()
    .then(()=>{
        app.listen(process.env.PORT || 8000, ()=>{
            console.log(`Server is running at port : ${process.env.PORT}`);
        })
    })
    .catch((err)=>{
        console.log("Mongo DB connection failed !!! ",err);
    });

    