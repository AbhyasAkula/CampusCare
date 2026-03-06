const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  complaint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Complaint",
    required: true,
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  senderRole: {
    type: String,
    enum: ["student", "warden"],
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

}, { timestamps: true });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);