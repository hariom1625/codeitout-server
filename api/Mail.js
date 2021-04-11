// const mailer = require('nodemailer');
// const {Hello} = require('../Hello_template.js');
// const express = require('express');
// const router = express.Router();
//
// const getEmailData = (to,name,template) =>{
// console.log(to," to");
//
// data = {
// from:"Codeitout <codeitout.verify@gmail.com>",
// to:to,
// subject:`Hello ${name}`,
// html:Hello()
// }
//
// return data;
// }
//
//
// const sendEmail = (to,name,type) => {
//
// const smtpTransport = mailer.createTransport({
// service:"Gmail",
// auth:{
// user:"codeitout.verify@gmail.com",
// pass:"CODE&!T&OUt"
// }
// });
//
// const mail = getEmailData(to,name,type)
//
// smtpTransport.sendMail(mail, function(error,response){
//
// if(error){
// console.log(error)
// }else {
//
// console.log("Email sent successfully!!!!!")
// }
//
// smtpTransport.close()
// })
//
// }
//
// router.post('/sendMail',(req,res)=>{
// console.log(req.body)
// sendEmail(req.body.email, req.body.name,"Hello")
// })
//
// module.exports = router
