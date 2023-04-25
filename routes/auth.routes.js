const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

router.post("/signup", (req, res) => {
  User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  })
    .then((foundUser) => {
      if (foundUser) {
        res.json({ success: false, message: "User Already Exists" });
        return;
      }

      if (
        !req.body.email ||
        !req.body.email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)
      ) {
        console.log({ nonValidEmail: req.body.email });

        res.json({ success: false, message: "Please enter a valid Email" });
        return;
      }

      bcryptjs
        .genSalt(saltRounds)
        .then((salt) => bcryptjs.hash(req.body.password, salt))
        .then((hashedPassword) => {
          console.log({
            hashedPassword,
            originalPassword: req.body.password,
          });

          const newUserData = {
            ...req.body,
            role: "member",
            password: hashedPassword,
          };

          User.create(newUserData)
            .then((newlyCreatedUser) => {
              console.log({ newlyCreatedUser });
              req.session.currentUser = newlyCreatedUser;
              res.json({ success: true, user: newlyCreatedUser });
            })
            .catch((err) =>
              res.json({
                success: false,
                message: "Error While creating user",
                error: err,
              })
            );
        })
        .catch((err) =>
          res.json({
            success: false,
            message: "Error with password",
            error: err,
          })
        );
    })
    .catch((err) =>
      res.json({ success: false, message: "Error validating user", error: err })
    );
});

router.post("/login", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.json({ success: false, message: "Email and Password required" });
  }
  console.log({ loginbody: req.body });
  User.findOne({ email: req.body.email })
    .then((userResults) => {
      if (!userResults) {
        res.json({ success: false, message: "Email not valid" });
        return;
      } else if (
        bcryptjs.compareSync(req.body.password, userResults.password)
      ) {
        console.log({ userResults });
        req.session.currentUser = userResults;
        res.json({ success: true, user: userResults });
        return;
      } else {
        res.json({ success: false, message: "Password is not valid" });
        return;
      }
    })
    .catch((err) => {
      console.log({ err });
      res.json({
        success: false,
        message: "Error While logging in",
        error: err,
      });
    });
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.json({
        success: false,
        message: "Error While logging out",
        error: err,
      });
      return;
    } else {
      res.json({ success: true, message: "Logged out successfully" });
      return;
    }
  });
});

router.get("/validateUser", (req, res) => {
  res.json({ user: req.session.currentUser });
});

module.exports = router;
