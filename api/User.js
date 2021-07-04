require("dotenv").config();

const express = require("express");
const mailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const User = require("../db/User");
const VerifyToken = require("../db/VerifyToken");
const RefreshToken = require("../db/AuthToken");
const router = express.Router();

const userSchema = Joi.object().keys({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),

  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  resetPwd: Joi.any().valid(Joi.ref("password")).required(),
  secretToken: Joi.string().required,
  active: Joi.required,
  isLoggedIn: Joi.required,
  questionSolved: {
    name: Joi.string(),
    link: Joi.string(),
  },
  // confirmationPassword: Joi.any().valid(Joi.ref('password')).required()
});

const pwdSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  cnfmPassword: Joi.any().valid(Joi.ref("password")).required(),
});

router.post("/signup", authenticateTokenlocal, async (req, res) => {
  try {
    const secretToken = randomstring.generate();
    const result = userSchema.validate(req.body); // check syntax of user input
    if (result.error) res.status(400).send(result.error.message);
    else {
      // console.log("Syntax Validated")
      // console.log(result.error)

      const checkUser = await User.findOne({
        // check if emaila already taken
        email: req.body.email,
      });
      const checkUsername = await User.findOne({
        // check if emaila already taken
        username: req.body.username,
      });

      if (checkUser) {
        if (checkUser.active === false) {
          checkUser.secretToken = secretToken;
          const smtpTransport = mailer.createTransport({
            // nodemailer
            host: "smtp.gmail.com",
            post: 465,
            secure: true,
            service: "Gmail",

            auth: {
              type: "OAuth2",
              user: process.env.GMAIL,
              clientId: process.env.CLIENT_ID,
              clientSecret: process.env.CLIENT_SECRET,
              refreshToken: process.env.GMAIL_REFRESH_TOKEN,
              accessToken: process.env.GMAIL_ACCESS_TOKEN,
            },
          });

          const mail = {
            from: "Codeitout <codeitout.verify@gmail.com>",
            to: req.body.email,
            subject: "Verify your account | CodeItOut",
            html: `OTP: ${secretToken} `,
          };

          smtpTransport.sendMail(mail, function (error, response) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent successfully!!!!!");
            }

            smtpTransport.close();
          });
          const newVerifyToken = new VerifyToken();
          newVerifyToken.secretToken = secretToken;
          let VerifyTokenModel = new VerifyToken(newVerifyToken);
          await VerifyTokenModel.save();

          await checkUser.save();

          res.json(checkUser._id);
        }
        // console.log("already registered")
        res.status(400).send("E-mail address Already Registered");
      } else if (checkUsername) {
        if (checkUsername.active === false) {
          checkUsername.secretToken = secretToken;
          const smtpTransport = mailer.createTransport({
            // nodemailer
            host: "smtp.gmail.com",
            post: 465,
            secure: true,
            service: "Gmail",

            auth: {
              type: "OAuth2",
              user: process.env.GMAIL,
              clientId: process.env.CLIENT_ID,
              clientSecret: process.env.CLIENT_SECRET,
              refreshToken: process.env.GMAIL_REFRESH_TOKEN,
              accessToken: process.env.GMAIL_ACCESS_TOKEN,
            },
          });

          const mail = {
            from: "Codeitout <codeitout.verify@gmail.com>",
            to: req.body.email,
            subject: "Verify your account | CodeItOut",
            html: `OTP: ${secretToken} `,
          };

          smtpTransport.sendMail(mail, function (error, response) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent successfully!!!!!");
            }

            smtpTransport.close();
          });
          const newVerifyToken = new VerifyToken();
          newVerifyToken.secretToken = secretToken;
          let VerifyTokenModel = new VerifyToken(newVerifyToken);
          await VerifyTokenModel.save();

          await checkUsername.save();

          res.json(checkUsername._id);
        }
        // console.log("already registered")
        res.status(400).send("Username not available");
      } else {
        const newUser = new User();
        const newVerifyToken = new VerifyToken();
        // generate secretToken for email verify
        result.value.secretToken = secretToken;
        newVerifyToken.secretToken = secretToken;

        const smtpTransport = mailer.createTransport({
          // nodemailer
          host: "smtp.gmail.com",
          post: 465,
          secure: true,
          service: "Gmail",

          auth: {
            type: "OAuth2",
            user: process.env.GMAIL,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN,
            accessToken: process.env.GMAIL_ACCESS_TOKEN,
          },
        });

        const mail = {
          from: "Codeitout <codeitout.verify@gmail.com>",
          to: req.body.email,
          subject: "Verify your account | CodeItOut",
          html: `OTP: ${secretToken} `,
        };

        smtpTransport.sendMail(mail, function (error, response) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent successfully!!!!!");
          }

          smtpTransport.close();
        });

        result.value.active = false;
        result.value.isLoggedIn = false;
        const salt = await bcrypt.genSalt();
        const hashedPwd = await bcrypt.hash(req.body.password, salt); // encrypt password
        result.value.firstname = req.body.firstname;
        result.value.lastname = req.body.lastname;
        result.value.email = req.body.email;
        result.value.password = hashedPwd;
        result.value.resetPwd = hashedPwd;
        result.value.username = req.body.username;

        // console.log(salt)
        // console.log(hashedPwd)
        //
        // newUser.firstname = req.body.firstname
        // newUser.lastname = req.body.lastname
        // newUser.email = req.body.email
        // newUser.password = hashedPwd
        // newUser.username = req.body.username
        let userModel = new User(result.value);
        let VerifyTokenModel = new VerifyToken(newVerifyToken);
        await VerifyTokenModel.save();
        await userModel.save();
        // if (result.value.active === true)
        //       res.json(userModel);
        // else
        //       res.json("Invalid Token")
        const q = await User.findOne({
          username: req.body.username,
        });

        res.json(q._id);

        // console.log(userModel)
      }
    }
  } catch {
    res.status(500).send("Something went wrong.");
  }
});

router.post("/ques-done", authenticateToken, async (req, res) => {
  try {
    var que = {
      name: req.body.name,
      link: req.body.link,
    };
    const q = await User.findOne({
      username: req.data.name,
    });

    const chk = q.questionSolved.find((qu) => qu.name === req.body.name);
    // console.log(q.questionSolved, "Que")
    // console.log(chk)
    if (!chk || q.questionSolved.length === 0) {
      q.questionSolved.push(que);
    } else {
      res.send("Already Solved");
    }
    await q.save();
    res.send("Que DOne");
  } catch {
    res.status(500).send("Something went wrong que-done");
  }
});

router.post("/deleteUser", authenticateTokenlocal, async (req, res) => {
  // console.log(req.body.secretToken)
  const secretToken = req.body.secretToken;
  User.findOneAndDelete(
    {
      secretToken: secretToken,
    },
    function (err, docs) {
      if (err) {
        // console.log(err)
      } else {
        // console.log(docs, "docs Deleted")
      }
    }
  );
});

router.post("/login", authenticateTokenlocal, async (req, res) => {
  try {
    const username = req.body.username;
    const data = {
      name: username,
    };

    const accessToken = generateAccessToken(data);

    jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
    const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
    // refreshTokens.push(refreshToken)

    const user = await User.findOne({
      username: req.body.username,
    });

    if (user === null) {
      // console.log("User Not Registered.....!!!!!")
      return res.status(400).send("Not Registered");
    } else if (user.active === false) {
      // console.log("Email Address Not Verified")
      return res.status(400).send("Email Address Not Verified");
    }
    const newRefreshToken = new RefreshToken();

    const pass = user.password;

    if (await bcrypt.compare(req.body.password, pass)) {
      // console.log("Login Success");
      newRefreshToken.refreshToken = refreshToken;
      let RefreshTokenModel = new RefreshToken(newRefreshToken);
      await RefreshTokenModel.save();
      user.isLoggedIn = true;
      user.save();
      res.json({
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } else {
      res.send(false);
      // console.log('Wrong Password')
    }
  } catch {
    res.status(500).send();
  }
});

router.post("/verify", authenticateTokenlocal, async (req, res) => {
  const urlToken = req.body.otp;

  const checkToken = await VerifyToken.findOne({
    // check if secretToken is present
    secretToken: urlToken,
  });
  const checkTokenUser = await User.findOne({
    // check if secretToken is present
    secretToken: urlToken,
  });
  if (checkToken && checkTokenUser) {
    checkTokenUser.active = true;

    res.status(201).send("Token verified");
    checkTokenUser.save();
  } else {
    const x = await User.findOneAndDelete({
      _id: req.body.id,
    });
    res.status(400).send("Invalid Token verify");
  }
});

router.post("/token", authenticateTokenlocal, async (req, res) => {
  const refreshToken = req.body.token;

  if (refreshToken === null) return res.sendStatus(401);
  const checkRefreshToken = await RefreshToken.findOne({
    refreshToken: refreshToken,
  });

  if (checkRefreshToken === null) return res.status(403).send("Invalid Token");
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({
      name: user.name,
    });
    res.json({
      accessToken: accessToken,
    });
  });
});

router.put("/forgotPwd", authenticateTokenlocal, async (req, res) => {
  try {
    const result = pwdSchema.validate(req.body); // check syntax of user input
    if (result.error) res.status(400).send("Password must be same.");
    else {
      const user = await User.findOne({
        email: req.body.email,
      });
      if (user === null) {
        return res.status(400).send("E-mail not Registered.");
      } else {
        if (await bcrypt.compare(req.body.password, user.password)) {
          return res.status(400).send("Please Enter Different Password");
        } else {
          const newVerifyToken = new VerifyToken();
          const secretToken = randomstring.generate(); // generate secretToken for email verify
          user.secretToken = secretToken;
          newVerifyToken.secretToken = secretToken;

          const smtpTransport = mailer.createTransport({
            // nodemailer
            service: "Gmail",
            auth: {
              type: "OAuth2",
              user: process.env.GMAIL,
              clientId: process.env.CLIENT_ID,
              clientSecret: process.env.CLIENT_SECRET,
              refreshToken: process.env.GMAIL_REFRESH_TOKEN,
              accessToken: process.env.GMAIL_ACCESS_TOKEN,
            },
          });

          const mail = {
            from: "Codeitout <codeitout.verify@gmail.com>",
            to: req.body.email,
            subject: "Verify your account | CodeItOut",
            html: `OTP: ${secretToken} `,
          };

          smtpTransport.sendMail(mail, function (error, response) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent successfully!!!!!");
            }

            smtpTransport.close();
          });

          const salt = await bcrypt.genSalt();
          const hashedPwd = await bcrypt.hash(req.body.password, salt);

          user.resetPwd = hashedPwd;
          let VerifyTokenModel = new VerifyToken(newVerifyToken);
          await VerifyTokenModel.save();
          user.save();
          return res.status(201).send("Please Complete Email Verification.");
        }
      }
    }
  } catch {
    return res.status(500).send("Oooops.....!!!!! Something went wrong.");
  }
});

router.put("/forgotPwdVerify", authenticateTokenlocal, async (req, res) => {
  const urlToken = req.body.otp;

  const checkToken = await VerifyToken.findOne({
    // check if secretToken is present
    secretToken: urlToken,
  });
  const checkTokenUser = await User.findOne({
    // check if secretToken is present
    secretToken: urlToken,
  });
  if (checkToken && checkTokenUser) {
    checkTokenUser.password = checkTokenUser.resetPwd;
    checkTokenUser.save();

    return res.status(201).send("Password Successfully Changed.");
  } else {
    return res.status(400).send("Invalid Token verify");
  }
});

router.put("/login-success", authenticateToken, async (req, res) => {
  // console.log(req.data.name)
  const user = await User.findOne({
    username: req.data.name,
  });

  user.isLoggedIn = false;
  user.save();

  res.send(user.isLoggedIn);
});

router.get("/profile", authenticateToken, async (req, res) => {
  const q = await User.findOne({
    username: req.data.name,
  });

  const user = [
    {
      id: q.id,
      firstname: q.firstname,
      lastname: q.lastname,
      username: q.username,
      queset: q.questionSolved,
    },
  ];
  res.send(user);
});

router.get("/login-success", authenticateToken, async (req, res) => {
  const user = await User.findOne({
    username: req.data.name,
  });
  res.send(user.isLoggedIn);
});

router.delete(
  "/logout-refreshToken",
  authenticateTokenlocal,
  async (req, res) => {
    try {
      await RefreshToken.findOneAndDelete(
        {
          refreshToken: req.body.refreshToken,
        },
        function (err, docs) {
          if (err) {
            // console.log(err)
          } else {
            res.send("RefreshToken Deleted");
          }
        }
      );
    } catch {
      res.status(400).send("Error");
    }
  }
);

function generateAccessToken(data) {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    // console.log(err)
    if (err) return res.sendStatus(403);
    req.data = data;
    next();
  });
}

function authenticateTokenlocal(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  if (token === process.env.TC_TOKEN) {
    next();
  } else {
    return res.sendStatus(403);
  }
}

module.exports = router;
