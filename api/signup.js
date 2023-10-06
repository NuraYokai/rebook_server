const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../config/db");

router.post("/signup", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ status: "FAILED", message: "Empty input fields!" });
  }

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!emailRegex.test(email)) {
    return res.json({ status: "FAILED", message: "Invalid email entered!" });
  }

  if (password.length < 8) {
    return res.json({ status: "FAILED", message: "Password is too short" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) throw err;

    if (results.length) {
      return res.json({
        status: "FAILED",
        message: "User with the provided email already exists",
      });
    }

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        return res.json({
          status: "FAILED",
          message: "An error occurred while hashing password!",
        });
      }

      db.query(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword],
        (err, result) => {
          if (err) {
            return res.json({
              status: "FAILED",
              message: "An error occurred while saving user account!",
            });
          }

          res.json({
            status: "SUCCESS",
            message: "Signup Successful",
            data: result,
          });
        }
      );
    });
  });
});

module.exports = router;
