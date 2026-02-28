const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Complaint = require("../models/Complaint");
const EmergencyContact = require("../models/EmergencyContact");

const { protect, role } = require("../middleware/auth");


/* ================= USERS ================= */

// GET ALL USERS
router.get("/users", protect, role("admin"), async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// BLOCK USER
router.put("/block/:id", protect, role("admin"), async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ msg: "User not found" });

  user.isBlocked = true;
  await user.save();

  res.json({ msg: "User blocked" });
});


/* ================= COMPLAINTS ================= */

// VIEW ALL COMPLAINTS
router.get("/complaints", protect, role("admin"), async (req, res) => {
  const complaints = await Complaint.find().populate("student", "name email");
  res.json(complaints);
});


/* ================= EMERGENCY CONTACTS ================= */

// ADD EMERGENCY CONTACT (Admin only)
router.post("/contacts", protect, role("admin"), async (req, res) => {
  try {
    const { title, phone } = req.body;

    if (!title || !phone)
      return res.status(400).json({ msg: "Title and phone required" });

    const contact = await EmergencyContact.create({ title, phone });

    res.json(contact);
  } catch (err) {
    res.status(500).json({ msg: "Failed to add contact" });
  }
});


// GET ALL CONTACTS (Students will use this)
router.get("/contacts", protect, async (req, res) => {
  try {
    const contacts = await EmergencyContact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch contacts" });
  }
});


// DELETE CONTACT (Admin only)
router.delete("/contacts/:id", protect, role("admin"), async (req, res) => {
  try {
    const contact = await EmergencyContact.findById(req.params.id);

    if (!contact)
      return res.status(404).json({ msg: "Contact not found" });

    await contact.deleteOne();

    res.json({ msg: "Contact deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
});


module.exports = router;