import { useEffect, useState } from "react";
import API from "../utils/axios";
import toast from "react-hot-toast";

function WardenAnnouncements(){
  const [notice,setNotice] = useState({
    title:"",
    message:""
  });

  const [allNotices,setAllNotices] = useState([]);

  const loadNotices = async () => {
    try{
      const res = await API.get("/warden/notices");
      setAllNotices(res.data);
    }catch{
      toast.error("Failed to load announcements");
    }
  };

  useEffect(()=>{
    loadNotices();
  },[]);

  const postNotice = async (e) => {
    e.preventDefault();
    if(!notice.title || !notice.message)
      return toast.error("Please fill title & message");

    try {
      await API.post("/warden/notice",notice);
      toast.success("Announcement broadcasted successfully");
      setNotice({title:"",message:""});
      loadNotices();
    } catch {
      toast.error("Failed to post announcement");
    }
  };

  const deleteNotice = async(id)=>{
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await API.delete(`/warden/notice/${id}`);
      setAllNotices(prev=>prev.filter(n=>n._id!==id));
      toast.success("Announcement deleted");
    } catch {
      toast.error("Failed to delete announcement");
    }
  };

  return(
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Hostel Announcements</h1>
          <p className="mt-1 text-sm text-slate-500">Broadcast important information to all students.</p>
        </div>
      </div>

      {/* POST NOTICE */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          Create New Announcement
        </h2>
        
        <form onSubmit={postNotice} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              placeholder="e.g. Scheduled Power Outage"
              value={notice.title}
              onChange={(e)=>setNotice({...notice,title:e.target.value})}
              className="block w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
            <textarea
              placeholder="Write the full announcement details here..."
              value={notice.message}
              onChange={(e)=>setNotice({...notice,message:e.target.value})}
              className="block w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 h-32 resize-none"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Broadcast to Students
            </button>
          </div>
        </form>
      </div>

      {/* NOTICE LIST */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent Announcements</h2>
        </div>
        
        <div className="p-6">
          {allNotices.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-3">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-900">No announcements yet</p>
              <p className="text-sm text-slate-500">Announcements you post will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allNotices.map(n => (
                <div
                  key={n._id}
                  className="group flex flex-col sm:flex-row justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5 transition-all hover:border-indigo-100 hover:bg-indigo-50/50"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1">{n.title}</h3>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{n.message}</p>
                  </div>

                  <div className="sm:pl-4 flex items-start justify-end">
                    <button
                      onClick={()=>deleteNotice(n._id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-slate-200 transition-all hover:bg-red-50 hover:text-red-700"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WardenAnnouncements;