const mongoose= require("mongoose")
const dotenv = require("dotenv")

const connectionDB= async()=>{

    try {
         await mongoose.connect(process.env.MONGO_URL)
         console.log('MongoDB Connected Successfully');
        
    } catch (error) {
        console.error(error.message);

       process.exit(1) 
    }
}
module.exports=connectionDB