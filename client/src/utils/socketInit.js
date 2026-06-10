import socket from "./socket";
import API from "./axios";

let activeUser = null;

const joinActiveUserRooms = () => {
  if (!activeUser) return;

  socket.emit("joinRoom", activeUser._id);

  if (activeUser.role === "student") {
    socket.emit("joinStudents");
  }

  if (activeUser.role === "warden") {
    socket.emit("joinWardens");
  }
};

export const initializeSocket = async (user) => {
  try {
    activeUser = user || (await API.get("/profile")).data;

    socket.off("connect", joinActiveUserRooms);
    socket.on("connect", joinActiveUserRooms);

    if (socket.connected) {
      joinActiveUserRooms();
    } else {
      socket.connect();
    }

    return activeUser;
  } catch (error) {
    console.error("Socket init error", error);
    return null;
  }
};

export const disconnectSocket = () => {
  activeUser = null;
  socket.off("connect", joinActiveUserRooms);
  socket.disconnect();
};
