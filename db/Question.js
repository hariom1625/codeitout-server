const mongoose = require('mongoose');

const questionList = new mongoose.Schema({

      id: {
            type: Number
      },
      problemName: {
            type: String
      },
      problemCode: {
            type: String
      },
      problemDesc: {
            type: String
      },
      problemInputDesc: {
            type: String
      },
      problemOutputDesc: {
            type: String
      },
      time: {
            type: String
      },
      input: {
            type: String
      },
      ans: {
            type: String
      },
author:{
type:String
}

});

module.exports = Question = mongoose.model('Question', questionList);
