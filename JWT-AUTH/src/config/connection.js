const mongoose=require('mongoose');
const name=require('../constaints');
const DB_URL=process.env.DB ; //+ "/" + name;

const connectionDB= async ()=>{
    try {
        const connectionInstance=await mongoose.connect(DB_URL);
        console.log(`MongoDB connected !! DB HOST :${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(`MongoDb Connection FAILED ${error}`);
    }
}
module.exports=connectionDB;


