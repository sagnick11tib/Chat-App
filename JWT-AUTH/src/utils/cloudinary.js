    // Filename: cloudinary.js
    //Algorithm
    //1. Import cloudinary
    //2. Configure cloudinary
    //3. Upload the file on cloudinary
    //4. Delete the file from local storage
    //5. Export the function

const cloudinary = require('cloudinary').v2;
const fs=require('fs');

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadonCloudinary=async (localFilePath)=>{
    try{
        if(!localFilePath) return null;
        //upload the file on cloudinary
        const response=await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"});
        //file uploaded successfully
        console.log("File uploaded successfully",response.url);
        //delete the file from local storage
        fs.unlinkSync(localFilePath); //fs.unlinkSync() is used to delete the file from local storage
        return response;
    }catch(error){
        fs.unlinkSync(localFilePath);//remove the locally saved temporary file as it is not uploaded on cloudinary
        console.log("Error while uploading file on cloudinary",error);
        return null;
    }
}

module.exports=uploadonCloudinary;