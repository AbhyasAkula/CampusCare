import { io } from "socket.io-client";

// connect to backend socket server
const socket = io("http://localhost:5000", {
  autoConnect: false, // connect only after login
});

export default socket;