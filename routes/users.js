var express = require("express");
var router = express.Router();
const Users = require("../models/user");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  try {
    const users = await Users.find();
    return res.status(200).send({
      data: users,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
});

router.get("/users/:id", async function (req, res, next) {
  try {
    const user = await Users.findById(req.params.id);
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }
    return res.status(200).send({
      data: user,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
});

router.get("/me", async function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await Users.findById(decoded._id);
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }
    return res.status(200).send({
      data: user,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
});

router.put("/", async function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const updatedUser = await Users.findByIdAndUpdate(decoded._id, {
      $set: {
        firstname: req.body.firstname || "",
        lastname: req.body.lastname || "",
        nickname: req.body.nickname || "",
        age: req.body.age || null,
        graduated_from: req.body.graduated_from || "",
        what_about_me: req.body.what_about_me || {},
      },
    });

    if (!updatedUser) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).send({
      message: "User data updated successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
});

router.delete("/", async function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await Users.findById(decoded._id);
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }

    // Delete user data
    await Users.findByIdAndDelete(decoded._id);

    return res.status(200).send({
      message: "User deleted successfully",
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
