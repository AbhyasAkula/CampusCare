
const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const serializeComplaint = (complaint) => {
  const data = complaint.toObject ? complaint.toObject() : complaint;

  return {
    ...data,
    studentUnreadCount: data.studentUnreadCount || 0,
    wardenUnreadCount: data.wardenUnreadCount || 0,
    isNewForWarden: Boolean(data.isNewForWarden),
  };
};

/* ================= ADD COMPLAINT ================= */

router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const hostelBlock = (req.body.hostelBlock || req.body.block)?.trim();
    const roomNumber = (req.body.roomNumber || req.body.room)?.trim();

    const allowedBlocks = ["A", "B", "C", "D", "E", "Other"];

    if (hostelBlock && !allowedBlocks.includes(hostelBlock)) {
      return res.status(400).json({
        message: "Select a valid hostel block",
      });
    }

    if (Boolean(hostelBlock) !== Boolean(roomNumber)) {
      return res.status(400).json({
        message:
          "Hostel block and room number must be provided together",
      });
    }

    if (roomNumber && roomNumber.length > 20) {
      return res.status(400).json({
        message: "Enter a valid room number",
      });
    }

    const complaint = await Complaint.create({
      student: req.user.id,
      title: req.body.title,
      description: req.body.description,

      // Cloudinary image URL
      image: req.file ? req.file.path : "",

      hostelBlock,
      roomNumber,
      block: hostelBlock,
      room: roomNumber,
      studentUnreadCount: 0,
      wardenUnreadCount: 0,
      isNewForWarden: true,
    });

    await complaint.populate("student", "name email");

    const responseComplaint = serializeComplaint(complaint);

    /* ===== REALTIME EVENT TO WARDENS ===== */

    const io = req.app.get("io");

    io.to("wardens").emit(
      "newComplaint",
      responseComplaint
    );

    res.json(responseComplaint);

  } catch (err) {
    console.error("Complaint create error:", err);

    res.status(500).json({
      message: "Failed to create complaint",
    });
  }
});

/* ================= GET MY COMPLAINTS ================= */

router.get("/my", protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({
      student: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(
      complaints.map(serializeComplaint)
    );

  } catch (err) {
    res.status(500).json({
      message: "Failed to load complaints",
    });
  }
});

/* ================= GET SINGLE COMPLAINT ================= */

router.get("/:id", protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(
      req.params.id
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    res.json(
      serializeComplaint(complaint)
    );

  } catch (err) {
    res.status(500).json({
      message: "Failed to load complaint",
    });
  }
});

module.exports = router;

