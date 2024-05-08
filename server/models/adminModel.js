const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
        name: {
          type: String,
          required: true,
          default: "admin"
        },
        email: {
          type: String,
          required: true,
          unique: true,
          default: "admin@gmail.com"
        },
        password: {
          type: String,
          required: true,
          default: "1234"
        },
    },
    {
        timestamps: true,
    }
);

const adminModel = mongoose.model("admin", adminSchema);
module.exports = adminModel;
