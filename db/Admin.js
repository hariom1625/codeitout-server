const mongoose = require("mongoose");

const admin = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
});

module.exports = Admin = mongoose.model("admin", admin);
