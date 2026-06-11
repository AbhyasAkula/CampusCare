import { io } from "socket.io-client";
import { API_URL } from "./apiUrl";

// connect to backend socket server
const socket = io(API_URL, {
  autoConnect: false, // connect only after login
});

export default socket;
