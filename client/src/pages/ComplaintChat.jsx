import { useCallback, useEffect, useRef, useState } from "react";
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
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const loadComplaint = useCallback(async () => {
    const res = await API.get(`/complaints/${id}`);
    setComplaint(res.data);
  }, [id]);
  const loadMessages = useCallback(async () => {
    const res = await API.get(`/chat/${id}`);
    setMessages(res.data);
  }, [id]);
  const markAsRead = useCallback(async () => {
    try {
      await API.put(`/chat/${id}/read`);
    } catch (error) {
      console.error("Failed to mark complaint messages as read", error);
    }
  }, [id]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const profileRequest = API.get("/profile");
      const [, , profileRes] = await Promise.all([
        loadComplaint(),
        loadMessages(),
        profileRequest,
      ]);
      setUserId(profileRes.data._id);
      setUserRole(profileRes.data.role);
      await markAsRead();
      setLoading(false);
    };
    loadData();
    socket.emit("joinComplaintRoom", id);
  }, [id, loadComplaint, loadMessages, markAsRead]);

  useEffect(() => {
    const handleReceive = (msg) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === msg._id);
        return exists ? prev : [...prev, msg];
      });
      if (userRole && msg.senderRole !== userRole) {
        markAsRead();
      }
    };
    socket.on("receiveMessage", handleReceive);
    return () => socket.off("receiveMessage", handleReceive);
  }, [id, markAsRead, userRole]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const res = await API.post("/chat/send", { complaintId: id, message: text });
    const newMessage = res.data;
    setMessages((prev) => {
      const exists = prev.some((m) => m._id === newMessage._id);
      return exists ? prev : [...prev, newMessage];
    });
    setText("");
  };

  const getStatusCls = (status) => {
    if (status === "Pending") return "status-badge status-pending";
    if (status === "In Progress") return "status-badge status-progress";
    if (status === "Resolved") return "status-badge status-success";
    return "status-badge status-neutral";
  };

  return (
    <div className="portal-panel flex h-[calc(100vh-152px)] min-h-[560px] flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center gap-3 border-b border-brandBorder bg-[#F8FAFC] px-5 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brandBorder bg-surface text-brandText-muted transition hover:bg-slate-100 hover:text-brandText focus:outline-none"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-brandText">
            {complaint?.title || "Loading ticket conversation"}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {complaint?.status && (
              <span className={getStatusCls(complaint.status)}>{complaint.status}</span>
            )}
            <span className="text-[11px] font-medium uppercase tracking-widest text-brandText-muted">
              #{id.slice(-6).toUpperCase()}
            </span>
            {complaint && (
              <span className="text-[11px] font-medium text-brandText-muted">
                Block {complaint.hostelBlock || complaint.block || "N/A"} / Room {complaint.roomNumber || complaint.room || "N/A"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-[#F8FAFC] px-5 py-5">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                <div className="skeleton h-14 w-64 max-w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-xs text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-[#EFF6FF] text-primary shadow-sm">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="mt-3 text-sm font-semibold text-brandText">No messages yet</h2>
              <p className="mt-1 text-xs text-brandText-muted">Start the conversation below.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => {
              const isMe = message.sender === userId;
              return (
                <div key={message._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`flex max-w-[75%] flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <div
                      className={`rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                        isMe
                          ? "bg-primary text-white shadow-[0_8px_18px_rgba(37,99,235,0.18)]"
                          : "border border-brandBorder bg-surface text-brandText shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_18px_rgba(15,23,42,0.05)]"
                      }`}
                    >
                      {message.message}
                    </div>
                    <span className="mt-1 px-1 text-[10px] text-brandText-muted">
                      {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-brandBorder bg-surface px-5 py-4">
        <div className="flex items-end gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
            }}
            rows={1}
            placeholder="Type your message and press Enter to send..."
            className="portal-input min-h-[44px] flex-1 resize-none"
          />
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className="portal-button-primary h-11 min-w-[80px] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ComplaintChat;
