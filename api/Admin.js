require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const Admin = require("../db/Admin");
const RefreshToken = require("../db/AuthToken");

const router = express.Router();

router.post("/adminLogin", async (req, res) => {
  try {
    const username = req.body.username;
    const data = {
      name: username,
    };
    const accessToken = generateAccessToken(data);

    jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
    const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);

    const admin = await Admin.findOne({
      username: req.body.username,
    });
    if (admin === null) {
      return res.status(400).send("Not Registered");
    }
    const newRefreshToken = new RefreshToken();

    const pass = admin.password;

    if (await bcrypt.compare(req.body.password, pass)) {
      newRefreshToken.refreshToken = refreshToken;
      let RefreshTokenModel = new RefreshToken(newRefreshToken);
      await RefreshTokenModel.save();
      res.json({
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } else {
      res.send(false); // Not Authorized Wrong Password
    }
  } catch {
    res.status(500).send();
  }
});
router.delete("/adminLogout", authenticateTokenlocal, async (req, res) => {
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
});
function generateAccessToken(data) {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  });
}

router.post("/verifyAdmin", authenticateToken, async (req, res) => {
  try {
    res.send("OK");
  } catch {
    res.sendStatus(403);
  }
});
router.post("/token", authenticateTokenlocal, async (req, res) => {
  const refreshToken = req.body.token2;
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
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    // console.log(err);
    if (err) return res.sendStatus(401);
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
//
// router.post("/adminSignup", async (req, res) => {
//   try {
//     const newAdmin = new Admin();
//
//     newAdmin.username = req.body.username;
//     newAdmin.password = req.body.password;
//
//     let newAdminModel = new Admin(newAdmin);
//     await newAdminModel.save();
//     res.json("Admin Added");
//   } catch {
//     console.log("Error");
//   }
// });
