const express = require("express");
const router = express.Router();
const ChatMessage = require("../models/ChatMessage");
const { protect } = require("../middleware/auth");

// GET chat history
router.get("/:complaintId", protect, async (req, res) => {
  try {

    const messages = await ChatMessage.find({
      complaint: req.params.complaintId,
    }).sort({ createdAt: 1 });

    res.json(messages);

  } catch (err) {
    res.status(500).json({ message: "Failed to load chat" });
  }
});

// SEND message
router.post("/send", protect, async (req, res) => {

  try {

    const { complaintId, message } = req.body;

    const chat = new ChatMessage({
      complaint: complaintId,
      sender: req.user.id,
      senderRole: req.user.role,
      message,
    });

    await chat.save();

    const io = req.app.get("io");

    io.to(`complaint_${complaintId}`).emit("receiveMessage", chat);

    res.json(chat);

  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }

});

module.exports = router;