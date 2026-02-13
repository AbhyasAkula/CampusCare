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

    block: String,
    room: String,
  
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);
