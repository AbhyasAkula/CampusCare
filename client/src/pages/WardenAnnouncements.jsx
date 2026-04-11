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

  const postNotice = async () => {

    if(!notice.title || !notice.message)
      return toast.error("Fill title & message");

    await API.post("/warden/notice",notice);

    toast.success("Announcement posted");

    setNotice({title:"",message:""});

    loadNotices();
  };

  const deleteNotice = async(id)=>{
    await API.delete(`/warden/notice/${id}`);
    setAllNotices(prev=>prev.filter(n=>n._id!==id));
    toast.success("Deleted");
  };

  return(
    <div className="space-y-8">

      <h1 className="text-2xl font-bold">
        Hostel Announcements
      </h1>

      {/* POST NOTICE */}
      <div className="bg-white p-6 rounded-xl shadow">

        <input
          placeholder="Title"
          value={notice.title}
          onChange={(e)=>setNotice({...notice,title:e.target.value})}
          className="w-full border p-2 rounded mb-3"
        />

        <textarea
          placeholder="Message"
          value={notice.message}
          onChange={(e)=>setNotice({...notice,message:e.target.value})}
          className="w-full border p-2 rounded mb-3 h-28"
        />

        <button
          onClick={postNotice}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Broadcast
        </button>

      </div>

      {/* NOTICE LIST */}
      <div className="bg-white p-6 rounded-xl shadow">

        {allNotices.length === 0 ? (
          <p className="text-gray-400">No announcements yet</p>
        ) : (
          allNotices.map(n => (
            <div
              key={n._id}
              className="border-b py-3 flex justify-between"
            >
              <div>
                <p className="font-semibold">{n.title}</p>
                <p className="text-sm text-gray-600">{n.message}</p>
              </div>

              <button
                onClick={()=>deleteNotice(n._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default WardenAnnouncements;