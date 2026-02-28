import socket from "./socket";
import API from "./axios";

export const initializeSocket = async () => {
  try {
    const res = await API.get("/profile");

    const { _id, role } = res.data;

    // connect socket
    socket.connect();

    // personal room (already existing)
    socket.emit("joinRoom", _id);
    console.log("Joined personal room:", _id);

    // NEW: role based rooms
    if (role === "student") {
      socket.emit("joinStudents");
      console.log("Joined students broadcast room");
    }

    if (role === "warden") {
      socket.emit("joinWardens");
      console.log("Joined wardens room");
    }

  } catch (err) {
    console.log("Socket init failed");
  }
};