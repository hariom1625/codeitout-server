const mongoose = require('mongoose');
var ttl = require("mongoose-ttl");

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
verifyToken.plugin(ttl, { ttl: 300000});
module.exports = VerifyToken = mongoose.model('verifyToken',verifyToken);
