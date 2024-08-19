const mongoose = require('mongoose')
const colors = require('colors')

const connectDB = async()=>{
    try{
        await mongoose.connect('mongodb+srv://irshadsha:vN-B5t5cY7pnT9%40@newcluster.8tulobz.mongodb.net/?retryWrites=true&w=majority',{dbName:'EduManage'})
        console.log(`Mongodb connected ${mongoose.connection.host}`.bgGreen.white);
    }catch(error){
        console.log(`Mongodb server Issue ${error}`.bgRed.white);
    }
}

module.exports = connectDB;