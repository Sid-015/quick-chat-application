const mongoose = require("mongoose");

mongoose.connect(process.env.CONN_STRING); //connection logic

const db = mongoose.connection; //connection state

db.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

module.exports = db;
