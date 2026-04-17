import { useEffect, useState } from "react";
import API from "../utils/axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import socket from "../utils/socket";

function WardenComplaints(){
  const [complaints,setComplaints] = useState([]);
  const [statusMap,setStatusMap] = useState({});

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const statusFilter = searchParams.get("status");

  const loadComplaints = async () => {
    try{
      const res = await API.get("/warden");

      const sorted = res.data.sort(
        (a,b)=> new Date(b.createdAt)-new Date(a.createdAt)
      );

      setComplaints(sorted);

      const map = {};
      sorted.forEach(c => map[c._id] = c.status);
      setStatusMap(map);
    }catch{
      toast.error("Failed to load complaints");
    }
  };

  useEffect(()=>{
    loadComplaints();
  },[]);

  /* ================= REALTIME NEW COMPLAINT ================= */

  useEffect(()=>{
    socket.on("newComplaint",(complaint)=>{
      toast.success(`New Complaint: ${complaint.title}`);
      setComplaints(prev => [complaint,...prev]);
      setStatusMap(prev => ({
        ...prev,
        [complaint._id]: complaint.status
      }));
    });

    return () => {
      socket.off("newComplaint");
    };
  },[]);

  const updateStatus = async (id) => {
    try{
      await API.put(`/warden/${id}`,{
        status: statusMap[id]
      });

      toast.success("Status updated");
      loadComplaints();
    }catch{
      toast.error("Update failed");
    }
  };

  /* ================= FILTER LOGIC ================= */

  const filteredComplaints = statusFilter
    ? complaints.filter(c => c.status === statusFilter)
    : complaints;

  const statusColor = (status) => {
    if (status === "Pending")
      return "bg-amber-100 text-amber-700 border-amber-200";
    if (status === "In Progress")
      return "bg-blue-100 text-blue-700 border-blue-200";
    if (status === "Resolved")
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return(
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {statusFilter ? `${statusFilter} Complaints` : "All Complaints"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">Manage and resolve student issues.</p>
        </div>

        {statusFilter && (
          <button
            onClick={()=> navigate("/warden/complaints")}
            className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Clear Filter
          </button>
        )}
      </div>

      {filteredComplaints.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-900">No complaints found</p>
          <p className="text-sm text-slate-500 mt-1">There are no complaints matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {filteredComplaints.map(c => (
            <div key={c._id} className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h2 className="text-lg font-bold text-slate-900 line-clamp-2">{c.title}</h2>
                  <span className={`inline-flex flex-shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider ${statusColor(c.status)}`}>
                    {c.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4 text-xs font-medium text-slate-500 bg-slate-50 w-fit px-2.5 py-1 rounded-md border border-slate-100">
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Block {c.block || "-"}</span>
                  <span className="text-slate-300">•</span>
                  <span>Room {c.room || "-"}</span>
                </div>

                <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                  {c.description}
                </p>

                {c.image && (
                  <div className="mb-4 overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={`http://localhost:5000/uploads/${c.image}`}
                      alt="complaint"
                      className="h-32 w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                )}
              </div>
              
              <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <select
                    className="appearance-none block w-full rounded-xl border border-slate-300 bg-white py-2 pl-3 pr-8 text-sm font-medium text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={statusMap[c._id] || c.status}
                    onChange={(e)=>
                      setStatusMap(prev => ({
                        ...prev,
                        [c._id]: e.target.value
                      }))
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-slate-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={()=> updateStatus(c._id)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={()=> navigate(`/complaint/${c._id}/chat`)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 hover:text-indigo-600"
                  >
                    Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WardenComplaints;