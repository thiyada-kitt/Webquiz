const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL);

const connection = mongoose.connection;

mongoose.set('strictQuery', true);

connection.on("connected", () => {
  console.log("Mongo Db Connection Successful");
});

connection.on("error", (err) => {
  console.log("Mongo Db Connection Failed");
});

module.exports = connection;
