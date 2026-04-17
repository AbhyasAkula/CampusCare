const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const Notice = require("../models/Notice");
const { protect, role } = require("../middleware/auth");


/* =========================
   NOTICE ROUTES FIRST
   (STATIC ROUTES FIRST)
========================= */

// POST HOSTEL NOTICE
router.post("/notice", protect, role("warden"), async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message)
      return res.status(400).json({ msg: "Title and message required" });

    const notice = await Notice.create({
      title,
      message,
      postedBy: req.user._id,
    });

    // realtime broadcast
    const io = req.app.get("io");
    io.to("students").emit("newNotice", notice);

    res.json(notice);

  } catch (err) {
    console.log("NOTICE ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
});


// GET ALL NOTICES
router.get("/notices", protect, async (req, res) => {
  try {
    const notices = await Notice.find()
      .sort({ createdAt: -1 });

    res.json(notices);

  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch notices" });
  }
});


// DELETE NOTICE
router.delete("/notice/:id", protect, role("warden"), async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice)
      return res.status(404).json({ msg: "Notice not found" });

    await notice.deleteOne();

    // realtime remove
    const io = req.app.get("io");
    io.to("students").emit("deleteNotice", req.params.id);

    res.json({ msg: "Notice deleted" });

  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
});


/* =========================
   COMPLAINT ROUTES
========================= */

// VIEW ALL COMPLAINTS
router.get("/", protect, role("warden"), async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("student", "name email");

    res.json(complaints);

  } catch (err) {
    res.status(500).json({ msg: "Failed to load complaints" });
  }
});


// UPDATE STATUS
router.put("/:id", protect, role("warden"), async (req, res) => {
  try {
    const { status, reply } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint)
      return res.status(404).json({ msg: "Complaint not found" });

    const previousStatus = complaint.status;

    if (status) complaint.status = status;
    if (reply) complaint.reply = reply;

    await complaint.save();

    // realtime student notification
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