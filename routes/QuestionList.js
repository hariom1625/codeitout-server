// const express = require('express');
// const router = express.Router();
// const ques = require('../public/questionlist.js');
//
//
// router.get('/',async (req,res)=>{
// res.json(ques);
// });
//
// router.get('/:id', (req,res) =>{
// const queId = req.params.id;
// // const getQue = ques.indexOf(queId);
// // const getQue = ques.find((que) => que.id===queId);
// const getQue = ques.find(que => que.problemCode===queId);
// // console.log(ques.find(que => que.id===queId));
//
//
// if(!getQue){
// res.status(500).send('Question not found')
// }
// else{
// res.json(getQue);
// }
//
// })
//
//
// module.exports = router;
