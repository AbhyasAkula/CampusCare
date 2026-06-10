import { useEffect, useState } from "react";
import API from "../utils/axios";
import toast from "react-hot-toast";

function RaiseTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hostelBlock, setHostelBlock] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!image) { setPreviewUrl(""); return undefined; }
    const objectUrl = URL.createObjectURL(image);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalizedRoomNumber = roomNumber.trim();

    if (!hostelBlock || !normalizedRoomNumber) {
      toast.error("Select a hostel block and enter your room number");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("hostelBlock", hostelBlock);
    formData.append("roomNumber", normalizedRoomNumber);
    formData.append("block", hostelBlock);
    formData.append("room", normalizedRoomNumber);
    if (image) formData.append("image", image);
    try {
      await API.post("/complaints", formData);
      toast.success("Complaint submitted successfully");
      setTitle("");
      setDescription("");
      setHostelBlock("");
      setRoomNumber("");
      setImage(null);
    } catch {
      toast.error("Failed to submit complaint");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page Header */}
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-brandText">Raise a Ticket</h1>
        <p className="mt-1 text-sm font-medium text-brandText-muted">
          Report a hostel issue to the management team.
        </p>
      </header>

      <div className="portal-panel overflow-hidden">
        {/* Card Header */}
        <div className="border-b border-brandBorder bg-slate-50/50 px-6 py-4">
          <h2 className="text-sm font-semibold text-brandText">New Complaint</h2>
          {/* <p className="mt-0.5 text-xs text-brandText-muted">All fields marked with * are required.</p> */}
        </div>

        {/* Submission Guide */}
        <div className="border-b border-brandBorder bg-[#F8FAFC] px-6 py-4">
          <div className="grid gap-4 sm:grid-cols-3 text-xs text-brandText-muted">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10px]">1</span>
              <div>
                <p className="font-semibold text-brandText">Clear title</p>
                <p className="mt-0.5">Mention issue and location for faster review.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10px]">2</span>
              <div>
                <p className="font-semibold text-brandText">Describe the problem</p>
                <p className="mt-0.5">Include timing, severity, and relevant details.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10px]">3</span>
              <div>
                <p className="font-semibold text-brandText">Attach a photo</p>
                <p className="mt-0.5">Images help verify the issue before visiting.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="portal-label">Complaint Title *</label>
              <input
                id="title"
                type="text"
                // placeholder="e.g. Broken window in Room 204"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="portal-input mt-1.5"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="portal-label">Description *</label>
              <textarea
                id="description"
                rows={5}
                // placeholder="Provide details about the issue: timing, severity, and anything staff should know..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="portal-input mt-1.5 resize-none"
                required
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="hostel-block" className="portal-label">Hostel Block *</label>
                <div className="relative mt-1.5">
                  <select
                    id="hostel-block"
                    value={hostelBlock}
                    onChange={(e) => setHostelBlock(e.target.value)}
                    className="portal-input appearance-none pr-10"
                    required
                  >
                    <option value="">Select block</option>
                    <option value="A">A Block</option>
                    <option value="B">B Block</option>
                    <option value="C">C Block</option>
                    <option value="D">D Block</option>
                   
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-brandText-muted">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="room-number" className="portal-label">Room Number *</label>
                <input
                  id="room-number"
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  // placeholder="e.g. 204, A-305"
                  maxLength={20}
                  className="portal-input mt-1.5"
                  required
                />
              </div>
            </div>

            <div>
              <label className="portal-label">Photo Evidence <span className="font-normal text-brandText-muted">(Optional)</span></label>
              <label
                htmlFor="file-upload"
                className="mt-1.5 block cursor-pointer rounded-xl border-2 border-dashed border-brandBorder bg-[#F8FAFC] px-6 py-5 transition hover:border-primary hover:bg-white"
              >
                {previewUrl ? (
                  <div className="space-y-3">
                    <div className="overflow-hidden rounded-lg border border-brandBorder bg-white">
                      <img src={previewUrl} alt="Preview" className="h-48 w-full object-cover" />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-medium text-brandText">{image?.name}</p>
                      <button
                        type="button"
                        onClick={(event) => { event.preventDefault(); setImage(null); }}
                        className="portal-button-secondary text-xs px-3 py-1.5"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-brandText">Click to upload an image</p>
                    <p className="mt-1 text-xs text-brandText-muted">PNG, JPG, JPEG supported</p>
                  </div>
                )}
                <input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={(e) => setImage(e.target.files[0])}
                  accept="image/*"
                />
              </label>
            </div>

            <div className="border-t border-brandBorder pt-5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="portal-button-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </>
                ) : "Submit Ticket"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RaiseTicket;
