const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const Notice = require("../models/Notice");
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

// POST HOSTEL NOTICE (REALTIME BROADCAST)
router.post("/notice", protect, role("warden"), async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message)
      return res.status(400).json({ msg: "Title and message required" });

    // save notice to DB
   const notice = await Notice.create({
  title,
  message,
  postedBy: req.user._id,
});

    // 🔴 BROADCAST TO ALL STUDENTS
    const io = req.app.get("io");

    io.to("students").emit("newNotice", {
      title: notice.title,
      message: notice.message,
      createdAt: notice.createdAt,
    });

    res.json({ msg: "Notice posted successfully", notice });

  } catch (err) {
  console.log("NOTICE ERROR:", err);
  res.status(500).json({ msg: err.message });
}
});

// GET ALL NOTICES (students use this)
router.get("/notices", protect, async (req, res) => {
  try {
    const notices = await Notice.find()
      .sort({ createdAt: -1 })
      .limit(10); // last 10 announcements

    res.json(notices);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch notices" });
  }
});

// DELETE NOTICE (warden only)
router.delete("/notice/:id", protect, role("warden"), async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice)
      return res.status(404).json({ msg: "Notice not found" });

    await notice.deleteOne();

    // 🔴 realtime remove for all students
    const io = req.app.get("io");
    io.to("students").emit("deleteNotice", req.params.id);

    res.json({ msg: "Notice deleted" });

  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
});

module.exports = router;