var express = require("express");
var router = express.Router();
const Users = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/login", async function (req, res, next) {
  try {
    let { employee_id, password } = req.body;
    let user = await Users.findOne({ employee_id: employee_id });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(401).send({
        message: "Incorrect password",
        success: false,
      });
    }
    const { _id, firstname, lastname } = user;
    const token = jwt.sign(
      { _id, firstname, lastname },
      process.env.JWT_KEY
    );

    return res.status(200).send({
      data: { _id, firstname, lastname, token },
      message: "Login success",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
});

router.post("/register", async function (req, res, next) {
  try {
    let {
      password,
      firstname,
      lastname,
      nickname,
      age,
      graduated_from,
      what_about_me,
    } = req.body;

    // Generate employee_id
    const employee_id = "INET" + Math.floor(100000 + Math.random() * 900000);

    // Check if the user already exists
    let existingUser = await Users.findOne({ employee_id: employee_id });
    if (existingUser) {
      return res.status(400).send({
        message: "User already exists",
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new Users({
      employee_id: employee_id,
      password: hashedPassword,
      firstname: firstname,
      lastname: lastname,
      nickname: nickname,
      age: age,
      graduated_from: graduated_from,
      what_about_me: what_about_me,
    });

    // Save the user to the database
    await newUser.save();

    return res.status(201).send({
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
});

module.exports = router;
