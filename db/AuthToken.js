const mongoose = require('mongoose');

const refreshtoken = new mongoose.Schema ({

refreshToken:{
type:String
}



}

);

module.exports = RefreshToken = mongoose.model('refreshtoken',refreshtoken);
