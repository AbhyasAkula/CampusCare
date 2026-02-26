const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");

connectDB();

// create http server
const server = http.createServer(app);

// attach socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// make io accessible in routes
app.set("io", io);

// middleware
app.use(cors());
app.use(express.json());

// serve uploaded images
app.use("/uploads", express.static("uploads"));

// routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/complaints", require("./routes/complaint.routes"));
app.use("/api/warden", require("./routes/warden.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/profile", require("./routes/profile"));

// SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // student joins their personal room
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log("Joined room:", userId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// start server
server.listen(5000, () => console.log("Server running on port 5000"));