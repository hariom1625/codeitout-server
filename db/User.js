const mongoose = require('mongoose');

const user = new mongoose.Schema({

            firstname: {
                  type: String
            },
            lastname: {
                  type: String
            },
            username: {
                  type: String
            },
            email: {
                  type: String
            },
            password: {
                  type: String
            },
            secretToken: {
                  type: String,
                  createdAt: 1,
                  expireAfterSeconds: 300
            },
            active: {
                  type: Boolean
            },
            resetPwd: {
                  type: String

            },
            isLoggedIn: {
                  type: Boolean
            },
            questionSolved: [{

                  name: String,
                  link: String
            }]

      }, {
            timestamps: {
                  createdAt: 'createdAt',
                  updatedAt: 'updatedAt'
            }
      }

);

user.methods.toJSON = function() {
      var obj = this.toObject();
      delete obj.email;
      delete obj.password;
      delete obj.resetPwd;
      delete obj.secretToken;


      return obj;
};
module.exports = User = mongoose.model('user', user);
