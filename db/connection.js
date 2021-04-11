require('dotenv').config()

const mongoose = require('mongoose');



const connectDB =  ()=>{

  mongoose.connect(process.env.URI,{useUnifiedTopology:true,useNewUrlParser:true});
console.log('DB Connected.....!!!!!');
}

module.exports = connectDB;
