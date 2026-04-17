import socket from "./socket";
import API from "./axios";

export const initializeSocket = async () => {

  try {

    const res = await API.get("/profile");

    const { _id, role } = res.data;

    socket.connect();

    /* PERSONAL ROOM */

    socket.emit("joinRoom", _id);

    console.log("Joined personal room:", _id);

    /* STUDENTS BROADCAST */

    if (role === "student") {
      socket.emit("joinStudents");
    }

    /* WARDENS ROOM */

    if (role === "warden") {
      socket.emit("joinWardens");
      console.log("Joined wardens room");
    }

  } catch (err) {

    console.log("Socket init error", err);

  }

};