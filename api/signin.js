const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "your-secret-key";

router.post("/signin", (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();

  if (email == "" || password == "") {
    res.json({
      status: "FAILED",
      message: "Empty input fields!",
    });
  } else if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email
    )
  ) {
    res.json({
      status: "FAILED",
      message: "Invalid email entered!",
    });
  } else {
    const userQuery = "SELECT * FROM users WHERE email = ?";
    pool.query(userQuery, [email], (err, results) => {
      if (err) {
        console.log(err);
        res.json({
          status: "FAILED",
          message: "An error occurred while checking the existing user!",
        });
      } else {
        if (results.length == 0) {
          res.json({
            status: "FAILED",
            message: "User with the provided email does not exist",
          });
        } else {
          bcrypt
            .compare(password, results[0].password)
            .then((match) => {
              if (match) {
                const token = jwt.sign({ email }, SECRET_KEY);
                const updateTokenQuery =
                  "UPDATE users SET token = ? WHERE email = ?";
                pool.query(updateTokenQuery, [token, email], (err, result) => {
                  if (err) {
                    res.json({
                      status: "FAILED",
                      message:
                        "An error occurred while updating the user document!",
                    });
                  } else {
                    res.json({
                      status: "SUCCESS",
                      message: "Signin Successful",
                      token: token,
                    });
                  }
                });
              } else {
                res.json({
                  status: "FAILED",
                  message: "Invalid password entered!",
                });
              }
            })
            .catch((err) => {
              res.json({
                status: "FAILED",
                message: `An error occurred while checking the password!`,
              });
            });
        }
      }
    });
  }
});

module.exports = router;
