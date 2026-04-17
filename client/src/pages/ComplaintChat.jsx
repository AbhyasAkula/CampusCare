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
      return "bg-amber-100 text-amber-700 border-amber-200";
    if (status === "In Progress")
      return "bg-blue-100 text-blue-700 border-blue-200";
    if (status === "Resolved")
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="group flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
          >
            <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {complaint?.title || "Loading Chat..."}
            </h2>
            {complaint && (
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${statusColor(complaint.status)}`}>
                  {complaint.status}
                </span>
                <span className="text-xs text-slate-500">
                  Ticket #{id.slice(-6).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-900">No messages yet</p>
            <p className="text-sm text-slate-500">Start the conversation by sending a message.</p>
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.sender === userId;
            return (
              <div
                key={m._id}
                className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex flex-col max-w-[75%] sm:max-w-[60%] ${isMe ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                      isMe
                        ? "bg-indigo-600 text-white rounded-tr-sm"
                        : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{m.message}</p>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 mt-1 px-1">
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* INPUT */}
      <div className="border-t border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400"
            placeholder="Type your message here..."
          />
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm transition-all hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ComplaintChat;