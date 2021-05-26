const express = require('express');

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Question = require('../db/Question');
const Answer = require('../db/Answer');

const router = express.Router();

router.post('/',  authenticateTokenLocal,async (req, res) => {

      const newQuestion = new Question();

      newQuestion.id = req.body.id;
      newQuestion.problemCode = req.body.problemCode;

      newQuestion.problemName = req.body.problemName;

      newQuestion.problemDesc = req.body.problemDesc;
      newQuestion.problemInputDesc = req.body.problemInputDesc;

      newQuestion.problemOutputDesc = req.body.problemOutputDesc;
      newQuestion.time = req.body.time;
newQuestion.author = req.body.author
      // newQuestion.save();

      let questionModel = new Question(newQuestion);

      await questionModel.save();

      res.json("Question Added");

});

router.post('/addAnswer',authenticateTokenLocal, async (req, res) => {

      const newAnswer = new Answer();

      newAnswer.id = req.body.id;
      newAnswer.problemCode = req.body.problemCode;
      newAnswer.problemName = req.body.problemName;
      newAnswer.input = req.body.input;

      newAnswer.ans = req.body.ans;

      // newQuestion.save();

      let answerModel = new Answer(newAnswer);

      await answerModel.save();

      res.json(answerModel);

});

router.post('/checkAnswer',authenticateToken, async(req,res)=>{
const id = req.body.ans.link
const tcAns = await Answer.findOne({
      "problemCode":id
});
if(req.body.ans.t1===tcAns.ans){
res.send(200)
}
else{
res.send(400)
}
})

router.get('/',authenticateTokenLocal,async (req, res) => {

      const ques = await Question.find().sort({
            order: 1
      });

      res.json(ques);
});


router.get('/:id',authenticateTokenLocal, async (req, res) => {
      const queId = req.params.id;
      // const getQue = ques.indexOf(queId);
      // const getQue = ques.find((que) => que.id===queId);
      const getQue = await Question.find({
            "problemCode": queId
      });
      // console.log(ques.find(que => que.id===queId));


      if (!getQue) {
            res.status(500).send('Question not found')
      } else {
            res.json(getQue);
      }

})


router.get('/answer/:id',authenticateToken, async (req, res) => {
      const ansid = req.params.id
      const tcAns = await Answer.findOne({
            "problemCode":ansid
      });
const tc = {
"input":tcAns.input,
}
      res.json(tc)
});


function authenticateTokenLocal(req, res, next) {

      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1]
      if (token == null) return res.sendStatus(401)

      if (token === process.env.TC_TOKEN) {
            next()
      } else {
            return res.sendStatus(403)

      }

}



function authenticateToken(req, res, next) {
      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1]

      if (token == null) return res.sendStatus(401)

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
            // console.log(err)
            if (err) return res.sendStatus(403)
            req.data = data
            next()
      })
}
module.exports = router;
