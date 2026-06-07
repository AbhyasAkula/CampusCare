// auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) return res.status(401).json({ msg: "No token" });

  // remove Bearer
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ msg: "Authentication is not configured" });
    }

    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id).select(
      "_id name email role isBlocked block room profilePic"
    );

    if (!user) {
      return res.status(401).json({ msg: "User no longer exists" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ msg: "Your account has been blocked" });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
      block: user.block,
      room: user.room,
      profilePic: user.profilePic,
    };
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

exports.role = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role)
      return res.status(403).json({ msg: "Access denied" });
    next();
  };
};
