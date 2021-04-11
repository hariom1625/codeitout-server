require('dotenv').config()

const path = require("path");
const connectDB = require('./db/connection');

const express = require("express");
const app = express();
const session = require('express-session')

const jwt = require('jsonwebtoken');

connectDB();


// require('./config/passport')(passport)


cors = require("cors");
app.use(cors());
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
app.use(express.json({
      extended: false
}));


//
// const posts = [{
//             username: "Hello",
//             title: "Post 1"
//       },
//       {
//             username: "World",
//             title: "Post 2"
//
//       }
// ]


app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

// app.use('/Auth',require('./Auth'))
app.use('/api/question', require('./api/Question'));

// app.get("/", function(req, res) {
//       res.send("Hello World eee!!")
// });
// app.use('/api/mail',require('./api/Mail'));
app.use('/api/user', require('./api/User'));

app.get('/posts', authenticateToken, (req, res) => {

      res.json(posts.filter(post => post.username === req.body.username))
})

function authenticateToken(req, res, next) {

      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1]
      if (token == null) return res.sendStatus(401)

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            console.log(err)
            if (err) return res.sendStatus(403)
            req.user = user
            next()
      })
}



let port = process.env.PORT;
if (port == null || port == "") {
      port = 4000;
}
app.listen(port, () => console.log("Server started on Port: 4000"));

// app.get("/",function(req,res){
// // res.send({message :"Hello World !!"})
// res.json([
// {id:1,username:"Hey"},
// {id:2,username:"Hello World !!"}
// ])
// });

// app.get("/",function(req,res){
// res.sendFile(questionslist.js);
// });
//
//
// const question = require('./routes/QuestionList');
// app.use('/api/question', question);
