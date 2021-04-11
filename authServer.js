// require('dotenv').config()
//
// const path = require("path");
// const connectDB = require('./db/connection');
//
// const express = require("express");
// const jwt = require('jsonwebtoken');
//
// const app = express();
//
// app.use(express.json({
//       extended: false
// }));
//
// let refreshTokens = []
//
// app.post('/token', (req, res) => {
//
//       const refreshToken = req.body.token
//       if (refreshToken === null) return res.sendStatus(401)
//       if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
//       jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//
//             if (err) return res.sendStatus(403)
//             const accessToken = generateAccessToken({
//                   name: user.name
//             })
//             res.json({
//                   accessToken: accessToken
//             })
//       })
// })
//
// app.delete('/logout', (req, res) => {
//
//       refreshTokens = refreshTokens.filter(token => token !== req.body.token)
//       res.sendStatus(204)
// })
//
// app.post('/login', (req, res) => {
//
//       const username = req.body.username
//       const user = {
//             name: username
//       }
//
//       const accessToken = generateAccessToken(user)
//       const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
//       refreshTokens.push(refreshToken)
//
//       res.json({
//             accessToken: accessToken,
//             refreshToken: refreshToken
//       })
// })
//
//
// function generateAccessToken(user) {
//
//       return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
//             expiresIn: '10m'
//       })
// }
//
//
// app.listen(5000, () => console.log("Server started on Port: 5000"));
