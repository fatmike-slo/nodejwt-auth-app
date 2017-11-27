const express = require("express");
const router = express.Router();
const path = require("path");

const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("./../config/database");

const myAuth = require("./../config/passport");

const Db = require("./../db/models/db-users");

router.get("/", (req, res) => {
  res.send("hello mama");
});

// Register
router.post("/register", (req, res, next) => {
  let queryObj = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  }
  console.log("Got post register user, sending data: -->", queryObj);
  Db.createUser(queryObj, (err, data) => {
    if (err) {
      console.log(err);
      res.json({
        status: "Fail",
        message: "Something went wrong when creating user"
      });
    }
    res.json(data);
  });
});
router.get("/test", passport.authenticate("jwt", {session:false}),(req,res)=> {
  res.send("Authorized!")
});
// Authenticate
router.post("/authenticate", (req, res, next) => {
  console.log("/authenticate body --> ", req.body);
  const username = req.body.username;
  const password = req.body.password;

  // check if user is in db
  Db.getUserByUsername(username, (err, data) => {
    if (err) {
      throw err
    }
    if (!data) {

      return res.send("user not found")
    } else {
      // bcrypt query, 1.arg body.password 2.arg hashed db password
      Db.comparePassword(password, data.password, (err, isMatched) => {

        if (err) {
          throw err
        }
        // if matched proceed with creating a jwt token
        if (isMatched) {
   
          const token = jwt.sign(data.toJSON(), config.tokenSecret, {
            expiresIn: 604800 // 1 week
          });
          res.json({
            success: true,
            token: "Bearer " + token,
            user: { // constructing and object to send back, all except the password
              id: data._id,
              username:data.username,
              email:data.email
            }
          });
        }
        // if no match
        else {
          res.json({success:false, msg:"Wrong password"});
        }
      });
    }
  });
});
// Profile
router.get("/profile", (req, res, next) => {
  res.send("profile");
});

// DEV PURPOSES -----------------------------
// view all users
router.get("/viewall", (req, res) => {
  Db.viewAllUser((err, data) => {
    if (err) {
      throw err
    }
    res.json(data);
  })
});
// delete all users
router.get("/deleteall", (req, res) => {
  Db.deleteAllUsers((err, data) => {
    if (err) {
      throw err
    }
    res.send("<h1>USERS deleted</h1>");
  })
});

module.exports = router;