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
answer.methods.toJSON = function() {
      var obj = this.toObject();
      delete obj.ans;
      return obj;
};
module.exports = Answer = mongoose.model('answer', answer);
