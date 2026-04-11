const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Complaint = require("../models/Complaint");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth.js");

// GET MY PROFILE + ROLE BASED STATS
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    let totalComplaints = 0;
    let resolvedComplaints = 0;
    let pendingComplaints = 0;

    // ================= STUDENT =================
    if (user.role === "student") {
      totalComplaints = await Complaint.countDocuments({
        student: req.user.id,
      });

      resolvedComplaints = await Complaint.countDocuments({
        student: req.user.id,
        status: "Resolved",
      });

      pendingComplaints = await Complaint.countDocuments({
        student: req.user.id,
        status: { $ne: "Resolved" },
      });
    }

    // ================= WARDEN =================
    else if (user.role === "warden") {
      // warden manages ALL complaints
      totalComplaints = await Complaint.countDocuments();

      resolvedComplaints = await Complaint.countDocuments({
        status: "Resolved",
      });

      pendingComplaints = await Complaint.countDocuments({
        status: { $ne: "Resolved" },
      });
    }

    // ================= ADMIN (future ready) =================
    else if (user.role === "admin") {
      totalComplaints = await Complaint.countDocuments();

      resolvedComplaints = await Complaint.countDocuments({
        status: "Resolved",
      });

      pendingComplaints = await Complaint.countDocuments({
        status: { $ne: "Resolved" },
      });
    }

    res.json({
      ...user._doc,
      totalComplaints,
      resolvedComplaints,
      pendingComplaints,
    });

  } catch (err) {
    res.status(500).json({ msg: "Profile load error" });
  }
});

// UPLOAD PROFILE IMAGE
router.put(
  "/upload",
  protect,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      user.profilePic = req.file.filename;
      await user.save();

      res.json({
        msg: "Profile picture updated",
        profilePic: user.profilePic,
      });

    } catch (err) {
      res.status(500).json({ msg: "Upload failed" });
    }
  }
);

module.exports = router;