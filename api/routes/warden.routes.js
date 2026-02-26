const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const { protect, role } = require("../middleware/auth");


// VIEW BLOCK COMPLAINTS
router.get("/", protect, role("warden"), async (req, res) => {
  const complaints = await Complaint.find();
  res.json(complaints);
});


// UPDATE STATUS + REPLY + REALTIME NOTIFICATION
router.put("/:id", protect, role("warden"), async (req, res) => {
  try {
    const { status, reply } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint)
      return res.status(404).json({ msg: "Complaint not found" });

    const previousStatus = complaint.status;

    // update values
    if (status) complaint.status = status;
    if (reply) complaint.reply = reply;

    await complaint.save();

    // ⭐ SOCKET NOTIFICATION WHEN RESOLVED
   // ⭐ REALTIME STATUS UPDATE FOR ANY CHANGE
if (previousStatus !== complaint.status) {
  const io = req.app.get("io");

  io.to(complaint.student.toString()).emit("complaintUpdated", {
    title: complaint.title,
    status: complaint.status,
  });
}

    res.json(complaint);

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


module.exports = router;