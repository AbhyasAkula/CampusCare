const mongoose = require("mongoose");

const emergencyContactSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("EmergencyContact", emergencyContactSchema);