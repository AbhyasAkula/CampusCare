const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  title: String,
  description: String,
  image: String,

  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved"],
    default: "Pending",
  },

  reply: {
      type: String,
      default: "",
    },

    studentUnreadCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    wardenUnreadCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isNewForWarden: {
      type: Boolean,
      default: false,
    },

    hostelBlock: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    roomNumber: {
      type: String,
      trim: true,
      maxlength: 20,
    },

    // Legacy fields retained for existing complaint records.
    block: String,
    room: String,
  
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);
