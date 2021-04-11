const mongoose = require('mongoose');

const user = new mongoose.Schema ({

firstname:{
type:String
},
lastname:{
type:String
},
username:{
type: String
},
email:{
type:String
},
password:{
type:String
},
secretToken:{
type:String,
createdAt:1,
expireAfterSeconds: 30
},
active:{
type:Boolean
},
resetPwd:{
      type:String

},
isLoggedIn:{
type:Boolean
},
questionSolved:[{

name:String,
link:String
}]

},
{
timestamps:{
createdAt:'createdAt',
updatedAt:'updatedAt'
}
}

);

module.exports = User = mongoose.model('user',user);
