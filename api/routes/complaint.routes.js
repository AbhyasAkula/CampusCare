const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const { protect } = require("../middleware/auth");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });


// ADD COMPLAINT
router.post("/", protect, upload.single("image"), async (req, res) => {
  const complaint = await Complaint.create({
    student: req.user.id,
    title: req.body.title,
    description: req.body.description,
    image: req.file ? req.file.filename : "",
  });

  res.json(complaint);
});


// GET MY COMPLAINTS
router.get("/my", protect, async (req, res) => {
  const complaints = await Complaint
    .find({ student: req.user.id })
    .sort({ createdAt: -1 });

  res.json(complaints);
});


// GET SINGLE COMPLAINT (for chat header)
router.get("/:id", protect, async (req, res) => {
  try {

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);

  } catch (err) {
    res.status(500).json({ message: "Failed to load complaint" });
  }
});

module.exports = router;