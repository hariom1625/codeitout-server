const mongoose = require('mongoose');

const answer = new mongoose.Schema({

      id: {
            type: Number
      },
      problemName: {
            type: String
      },
      problemCode: {
            type: String
      },

      input: {
            type: String
      },
      ans: {
            type: String
      }

});

module.exports = Answer = mongoose.model('Answer', answer);
