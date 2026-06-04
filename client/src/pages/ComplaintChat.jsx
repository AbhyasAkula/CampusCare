import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../utils/axios";
import socket from "../utils/socket";

function ComplaintChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadUser = async () => {
    const res = await API.get("/profile");
    setUserId(res.data._id);
  };

  const loadComplaint = async () => {
    const res = await API.get(`/complaints/${id}`);
    setComplaint(res.data);
  };

  const loadMessages = async () => {
    const res = await API.get(`/chat/${id}`);
    setMessages(res.data);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadUser(), loadComplaint(), loadMessages()]);
      setLoading(false);
    };

    loadData();
    socket.emit("joinComplaintRoom", id);
  }, [id]);

  useEffect(() => {
    const handleReceive = (msg) => {
      setMessages((prev) => {
        const exists = prev.some((message) => message._id === msg._id);
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
      const exists = prev.some((message) => message._id === newMessage._id);
      if (exists) return prev;
      return [...prev, newMessage];
    });
    setText("");
  };

  const getStatusClass = (status) => {
    if (status === "Pending") return "status-badge status-pending";
    if (status === "In Progress") return "status-badge status-progress";
    if (status === "Resolved") return "status-badge status-success";
    return "status-badge status-neutral";
  };

  return (
    <div className="portal-panel flex h-[calc(100vh-152px)] min-h-[560px] flex-col overflow-hidden">
      <div className="border-b border-indigo-100 bg-indigo-50/70 px-6 py-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-100 bg-white text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              {complaint?.title || "Loading ticket conversation"}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {complaint?.status && <span className={getStatusClass(complaint.status)}>{complaint.status}</span>}
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                Ticket #{id.slice(-6).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50 px-6 py-5">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
                <div className="skeleton h-16 w-64 max-w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-sm text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-700">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">No messages yet</h2>
              <p className="mt-2 text-sm text-slate-500">Start the conversation by sending a message.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isMe = message.sender === userId;
              return (
                <div key={message._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`flex max-w-[80%] flex-col ${isMe ? "items-end" : "items-start"} sm:max-w-[65%]`}>
                    <div
                      className={`rounded-xl px-4 py-3 text-sm leading-6 ${
                        isMe
                          ? "bg-indigo-600 text-white"
                          : "border border-slate-200 bg-white text-slate-800"
                      }`}
                    >
                      {message.message}
                    </div>
                    <span className="mt-1 px-1 text-[11px] text-slate-400">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 border-t border-slate-200 bg-white px-6 py-4">
        <div className="flex items-end gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            rows={1}
            placeholder="Type your message here..."
            className="portal-input min-h-[48px] flex-1 resize-none"
          />
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className="portal-button-primary h-12 min-w-[104px] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ComplaintChat;
