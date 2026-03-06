import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/axios";
import socket from "../utils/socket";

function ComplaintChat() {

  const { id } = useParams();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const loadMessages = async () => {
    const res = await API.get(`/chat/${id}`);
    setMessages(res.data);
  };

  useEffect(() => {
    loadMessages();
    socket.emit("joinComplaintRoom", id);
  }, [id]);

  useEffect(() => {

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");

  }, []);

  const sendMessage = async () => {

    if (!text) return;

    await API.post("/chat/send", {
      complaintId: id,
      message: text,
    });

    setText("");

  };

  return (

    <div className="bg-white p-6 rounded-xl shadow h-[80vh] flex flex-col">

      <h2 className="text-xl font-semibold mb-4">
        Complaint Chat
      </h2>

      <div className="flex-1 overflow-y-auto space-y-2 mb-4">

        {messages.map((m) => (

          <div
            key={m._id}
            className={`p-2 rounded max-w-xs ${
              m.senderRole === "student"
                ? "bg-blue-100 ml-auto"
                : "bg-gray-200"
            }`}
          >
            {m.message}
          </div>

        ))}

      </div>

      <div className="flex gap-2">

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border p-2 flex-1 rounded"
          placeholder="Type message..."
        />

        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-5 rounded"
        >
          Send
        </button>

      </div>

    </div>

  );
}

export default ComplaintChat;