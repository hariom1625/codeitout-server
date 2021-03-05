const path = require("path");
const express = require ("express");

const app = express ();


cors = require("cors");
app.use(cors());


app.use(express.static(path.join(__dirname,"..","build")));
app.use(express.static("public"));

// app.get("/",function(req,res){
// res.sendFile(questionslist.js);
// });
app.get("/",function(req,res){
res.send("Hello World eee!!")
});
let port = process.env.PORT;
if(port== null || port == ""){
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
