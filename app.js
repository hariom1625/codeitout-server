require("dotenv").config();

const path = require("path");
const connectDB = require("./db/connection");

const express = require("express");
const app = express();
const session = require("express-session");

const jwt = require("jsonwebtoken");

connectDB();
cors = require("cors");

var corsOptions = {
  origin: "https://codeitout.netlify.app",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
app.use(
  express.json({
    extended: false,
  })
);

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

app.use("/api/question", require("./api/Question"));

// app.get("/", function(req, res) {
//       res.send("Hello World eee!!")
// });
// app.use('/api/mail',require('./api/Mail'));
app.use("/api/user", require("./api/User"));

app.use("/api/admin", require("./api/Admin"));

// app.get('/posts', authenticateToken, (req, res) => {
//
//       res.json(posts.filter(post => post.username === req.body.username))
// })

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
