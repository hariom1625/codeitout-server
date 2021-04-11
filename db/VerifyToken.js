const mongoose = require('mongoose');

const verifyToken = new mongoose.Schema ({

secretToken:{
type:String
},
createdAt:{
type:Date,
expires:300,
default:Date.now
}
}

);

module.exports = VerifyToken = mongoose.model('verifyToken',verifyToken);
