const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const { protect, role } = require("../middleware/auth");


// VIEW BLOCK COMPLAINTS
router.get("/", protect, role("warden"), async (req, res) => {
  const complaints = await Complaint.find();
  res.json(complaints);
});


// UPDATE STATUS
// UPDATE STATUS + REPLY
router.put("/:id", protect, role("warden"), async (req, res) => {
  try {
    const { status, reply } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint)
      return res.status(404).json({ msg: "Complaint not found" });

    if (status) complaint.status = status;
    if (reply) complaint.reply = reply;

    await complaint.save();

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;