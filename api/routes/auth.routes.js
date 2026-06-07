const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const NAME_REGEX = /^[A-Za-z.\s]{3,40}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,64}$/;
const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const normalizeName = (value = "") => value.trim().replace(/\s+/g, " ");
const normalizeEmail = (value = "") => value.trim().toLowerCase();

const validateRegisterInput = ({ name, email, password, confirmPassword }) => {
  if (!name || !email || !password || !confirmPassword) {
    return "All fields are required";
  }

  if (!NAME_REGEX.test(name)) {
    return "Name must be 3 to 40 characters and contain only letters, spaces, or periods";
  }

  if (!EMAIL_REGEX.test(email)) {
    return "Please enter a valid email address";
  }

  if (!PASSWORD_REGEX.test(password)) {
    return "Password must be 8 to 64 characters and include uppercase, lowercase, number, and special character";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return null;
};

const validateLoginInput = ({ email, password }) => {
  if (!email || !password) {
    return "Email and password are required";
  }

  if (!EMAIL_REGEX.test(email)) {
    return "Please enter a valid email address";
  }

  return null;
};

const getJwtSecret = () => process.env.JWT_SECRET;

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const rawName = typeof req.body?.name === "string" ? req.body.name : "";
    const rawEmail = typeof req.body?.email === "string" ? req.body.email : "";
    const password =
      typeof req.body?.password === "string" ? req.body.password : "";
    const confirmPassword =
      typeof req.body?.confirmPassword === "string"
        ? req.body.confirmPassword
        : "";

    const name = normalizeName(rawName);
    const email = normalizeEmail(rawEmail);

    const validationError = validateRegisterInput({
      name,
      email,
      password,
      confirmPassword,
    });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      role: "student",
    });

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    res.status(500).json({ message: "Unable to complete registration" });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const email = normalizeEmail(
      typeof req.body?.email === "string" ? req.body.email : ""
    );
    const password =
      typeof req.body?.password === "string" ? req.body.password : "";

    const validationError = validateLoginInput({ email, password });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked. Please contact the administrator" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const jwtSecret = getJwtSecret();
    if (!jwtSecret) {
      return res.status(500).json({ message: "Authentication is not configured" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
      expiresIn: "1d",
    });

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Unable to complete login" });
  }
});

module.exports = router;
