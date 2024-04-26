const router = require("express").Router();
const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

// admin login
router.post("/login", async (req, res) => {
    try {
      // check if user exists
      const user = await Admin.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(200)
          .send({ message: "Admin does not exist", success: false });
      }

      // check password
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res
          .status(200)
          .send({ message: "Invalid password", success: false });
      }

      const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.send({
        message: "Admin logged in successfully",
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