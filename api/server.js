// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: "./uploads",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// exports.upload = multer({ storage });

const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/complaints", require("./routes/complaint.routes"));
app.use("/api/warden", require("./routes/warden.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

app.listen(5000, () => console.log("Server running on port 5000"));
