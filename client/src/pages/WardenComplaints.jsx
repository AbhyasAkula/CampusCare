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

  return(
    <div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">
          {statusFilter ? `${statusFilter} Complaints` : "All Complaints"}
        </h1>

        {statusFilter && (
          <button
            onClick={()=> navigate("/warden/complaints")}
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </button>
        )}

      </div>

      {filteredComplaints.length === 0 && (
        <p className="text-gray-400">No complaints</p>
      )}

      {filteredComplaints.map(c => (

        <div key={c._id} className="bg-white p-6 rounded-xl shadow mb-6">

          <h2 className="text-xl font-semibold">{c.title}</h2>

          <p className="text-gray-600 mb-2">
            {c.description}
          </p>

          <p className="text-sm mb-2">
            Block {c.block || "-"} • Room {c.room || "-"}
          </p>

          {c.image && (
            <img
              src={`http://localhost:5000/uploads/${c.image}`}
              alt="complaint"
              className="w-48 rounded mb-3"
            />
          )}

          {/* STATUS SELECT */}
          <select
            className="border p-2 rounded mr-3"
            value={statusMap[c._id]}
            onChange={(e)=>
              setStatusMap(prev => ({
                ...prev,
                [c._id]: e.target.value
              }))
            }
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>

          {/* UPDATE BUTTON */}
          <button
            onClick={()=> updateStatus(c._id)}
            className="bg-blue-600 text-white px-3 py-2 rounded mr-3"
          >
            Update
          </button>

          {/* CHAT BUTTON */}
          <button
            onClick={()=> navigate(`/complaint/${c._id}/chat`)}
            className="bg-green-600 text-white px-3 py-2 rounded"
          >
            Open Chat
          </button>

        </div>

      ))}

    </div>
  );
}

export default WardenComplaints;