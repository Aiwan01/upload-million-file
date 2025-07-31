
const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
});


module.exports = mongoose.model("Record", recordSchema);
