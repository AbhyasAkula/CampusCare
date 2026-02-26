import socket from "./socket";
import API from "./axios";

export const initializeSocket = async () => {
  try {
    const res = await API.get("/profile");

    // connect socket
    socket.connect();

    // join personal room
    socket.emit("joinRoom", res.data._id);

    console.log("Socket joined room:", res.data._id);
  } catch (err) {
    console.log("Socket init failed");
  }
};