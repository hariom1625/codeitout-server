const express = require('express');

const mongoose  = require('mongoose');

const Question = require('../db/Question');

const router =  express.Router();

router.get('/',async (req,res) => {

const ques = await Question.find().sort({order:1});

res.json(ques);
});
router.get('/:id', async (req,res) =>{
const queId = req.params.id;
// const getQue = ques.indexOf(queId);
// const getQue = ques.find((que) => que.id===queId);
const getQue = await Question.find({"problemCode":queId});
// console.log(ques.find(que => que.id===queId));


if(!getQue){
res.status(500).send('Question not found')
}
else{
res.json(getQue);
}

})

router.post('/',async (req,res) =>{

const newQuestion = new Question();

newQuestion.id = req.body.id;
newQuestion.problemCode = req.body.problemCode;

newQuestion.problemName = req.body.problemName;

newQuestion.problemDesc = req.body.problemDesc;
newQuestion.problemInputDesc = req.body.problemInputDesc;

newQuestion.problemOutputDesc = req.body.problemOutputDesc;
newQuestion.time = req.body.time;

newQuestion.input = req.body.input;

newQuestion.ans = req.body.ans;

// newQuestion.save();

let questionModel = new Question(newQuestion);

await questionModel.save();

res.json(questionModel);

});

module.exports= router;
