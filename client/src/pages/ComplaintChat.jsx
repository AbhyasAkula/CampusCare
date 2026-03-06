import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/axios";
import socket from "../utils/socket";

function ComplaintChat() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [userId, setUserId] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // get current user
  const loadUser = async () => {
    const res = await API.get("/profile");
    setUserId(res.data._id);
  };

  // load complaint
  const loadComplaint = async () => {
    const res = await API.get(`/complaints/${id}`);
    setComplaint(res.data);
  };

  // load messages
  const loadMessages = async () => {
    const res = await API.get(`/chat/${id}`);
    setMessages(res.data);
  };

  useEffect(() => {

    loadUser();
    loadComplaint();
    loadMessages();

    socket.emit("joinComplaintRoom", id);

  }, [id]);

  // receive messages
  useEffect(() => {

    const handleReceive = (msg) => {

      setMessages((prev) => {

        const exists = prev.some((m) => m._id === msg._id);
        if (exists) return prev;

        return [...prev, msg];
      });

    };

    socket.on("receiveMessage", handleReceive);

    return () => socket.off("receiveMessage", handleReceive);

  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {

    if (!text.trim()) return;

    const res = await API.post("/chat/send", {
      complaintId: id,
      message: text,
    });

    const newMessage = res.data;

    setMessages((prev) => {

      const exists = prev.some((m) => m._id === newMessage._id);
      if (exists) return prev;

      return [...prev, newMessage];
    });

    setText("");

  };

  const statusColor = (status) => {

    if (status === "Pending")
      return "bg-[#FFAE1F]/20 text-[#FFAE1F]";

    if (status === "In Progress")
      return "bg-[#49BEFF]/20 text-[#49BEFF]";

    if (status === "Resolved")
      return "bg-[#13DEB9]/20 text-[#13DEB9]";

    return "bg-gray-100 text-gray-700";

  };

  return (

    <div className="bg-white rounded-xl shadow h-[85vh] flex flex-col">

      {/* HEADER */}

      <div className="border-b p-4 flex items-center gap-4">

        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 font-semibold"
        >
          ← Back
        </button>

        <div>

          <h2 className="font-semibold">
            {complaint?.title || "Complaint Chat"}
          </h2>

          {complaint && (

            <span
              className={`px-2 py-1 text-xs rounded-full font-semibold ${statusColor(complaint.status)}`}
            >
              {complaint.status}
            </span>

          )}

        </div>

      </div>


      {/* MESSAGES */}

      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {messages.map((m) => {

          const isMe = m.sender === userId;

          return (

            <div
              key={m._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >

              <div
                className={`px-4 py-2 rounded-lg max-w-xs text-sm ${
                  isMe
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >

                <p>{m.message}</p>

                <p className="text-[10px] opacity-70 mt-1 text-right">
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

              </div>

            </div>

          );

        })}

        <div ref={messagesEndRef} />

      </div>


      {/* INPUT */}

      <div className="border-t p-3 flex gap-2">

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="border rounded-lg px-3 py-2 flex-1"
          placeholder="Type message..."
        />

        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-5 rounded-lg hover:bg-indigo-700"
        >
          Send
        </button>

      </div>

    </div>

  );
}

export default ComplaintChat;