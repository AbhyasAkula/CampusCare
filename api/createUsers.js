require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const normalizeEmail = (value = "") => value.trim().toLowerCase();

const users = [
  {
    name: "Admin",
    email: "admin@gmail.com",
    password: "Admin@123",
    role: "admin",
  },
  {
    name: "Warden",
    email: "warden@gmail.com",
    password: "Warden@123",
    role: "warden",
  },
];

const createUserIfMissing = async ({ name, email, password, role }) => {
  const normalizedEmail = normalizeEmail(email);
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    console.log(`Skipped ${role}: ${normalizedEmail} already exists`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role,
  });

  console.log(`Created ${role}: ${normalizedEmail}`);
};

const createUsers = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required in api/.env");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected");

  for (const user of users) {
    await createUserIfMissing(user);
  }
};

createUsers()
  .then(async () => {
    await mongoose.disconnect();
    console.log("Done");
  })
  .catch(async (error) => {
    console.error("Failed to create users:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  });
