const router = require("express").Router();
const Admin = require("../models/adminModel");
const User = require("../models/userModel")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");


// admin registration
router.post("/register", async (req, res) => {
  try {
    // check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(200)
        .send({ message: "มีอีเมลนี้อยู๋ในระบบแล้ว", success: false });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    // create new admin
    const newAdmin = new Admin(req.body);
    await newAdmin.save();

    req.body.isAdmin = true;
    const newUser = new User(req.body);
    await newUser.save();
    res.send({
      message: "สร้างบัญชีแอดมินเสร็จสิ้น",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// admin login
router.post("/login", async (req, res) => {
    try {
      // check if user exists
      const user = await Admin.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(200)
          .send({ message: "เข้าสู่ระบบล้มเหลว", success: false });
      }

      // check password
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res
          .status(200)
          .send({ message: "รหัสผ่านผิดพลาด", success: false });
      }

      const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.send({
        message: "เข้าสู่ระบบผู้ดูแลระบบ",
        success: true,
        data: token,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: error,
        success: false,
      });
    }
});

module.exports = router;