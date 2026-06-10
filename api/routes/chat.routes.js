const express = require("express");
const router = express.Router();
const ChatMessage = require("../models/ChatMessage");
const Complaint = require("../models/Complaint");
const { protect } = require("../middleware/auth");

const canAccessComplaint = (complaint, user) => {
  if (user.role === "warden") return true;
  return complaint.student.toString() === user.id;
};

const getReadState = (complaint) => ({
  studentUnreadCount: complaint.studentUnreadCount || 0,
  wardenUnreadCount: complaint.wardenUnreadCount || 0,
  isNewForWarden: Boolean(complaint.isNewForWarden),
});

// GET chat history
router.get("/:complaintId", protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (!canAccessComplaint(complaint, req.user)) {
      return res.status(403).json({ message: "Access denied" });
    }

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
    const normalizedMessage = message?.trim();
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (!canAccessComplaint(complaint, req.user)) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!["student", "warden"].includes(req.user.role)) {
      return res.status(403).json({ message: "Messaging is not available for this role" });
    }

    if (!normalizedMessage) {
      return res.status(400).json({ message: "Message is required" });
    }

    const chat = new ChatMessage({
      complaint: complaintId,
      sender: req.user.id,
      senderRole: req.user.role,
      message: normalizedMessage,
    });

    await chat.save();

    const io = req.app.get("io");
    const unreadField =
      req.user.role === "student" ? "wardenUnreadCount" : "studentUnreadCount";
    const update = { $inc: { [unreadField]: 1 } };

    if (req.user.role === "student") {
      update.$set = { isNewForWarden: true };
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      update,
      { returnDocument: "after", runValidators: true }
    );
    const readState = getReadState(updatedComplaint);
    const activity = {
      complaintId,
      title: updatedComplaint.title,
      senderRole: req.user.role,
      unreadCount: readState[unreadField],
      ...readState,
    };

    io.to(`complaint_${complaintId}`).emit("receiveMessage", chat);

    if (req.user.role === "student") {
      io.to("wardens").emit("complaintMessageActivity", activity);
    } else {
      io.to(complaint.student.toString()).emit("complaintMessageActivity", activity);
    }

    res.json(chat);

  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }

});

// MARK messages as read for the current role
router.put("/:complaintId/read", protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (!canAccessComplaint(complaint, req.user)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const update =
      req.user.role === "warden"
        ? { wardenUnreadCount: 0, isNewForWarden: false }
        : { studentUnreadCount: 0 };
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.complaintId,
      { $set: update },
      { returnDocument: "after", runValidators: true }
    );
    const readState = {
      complaintId: req.params.complaintId,
      role: req.user.role,
      ...getReadState(updatedComplaint),
    };
    const targetRoom =
      req.user.role === "warden" ? "wardens" : complaint.student.toString();

    req.app.get("io").to(targetRoom).emit("complaintRead", readState);
    res.json(readState);
  } catch (err) {
    res.status(500).json({ message: "Failed to update read status" });
  }
});

module.exports = router;
