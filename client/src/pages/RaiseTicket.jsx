import { useEffect, useState } from "react";
import API from "../utils/axios";
import toast from "react-hot-toast";

function RaiseTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!image) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      await API.post("/complaints", formData);
      toast.success("Complaint submitted successfully");
      setTitle("");
      setDescription("");
      setImage(null);
    } catch {
      toast.error("Failed to submit complaint");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Raise Ticket</h1>
        <p className="mt-2 text-sm text-slate-500">Report an issue to the hostel management team.</p>
      </div>

      <div className="portal-panel-soft overflow-hidden">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="border-b border-indigo-100 bg-indigo-100/70 px-6 py-4 lg:border-b-0 lg:border-r">
            <h2 className="text-lg font-semibold text-slate-900">Submission Guide</h2>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div>
                <p className="font-semibold text-slate-900">Use a clear title</p>
                <p className="mt-1">Mention the issue and location for faster review.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Describe the problem</p>
                <p className="mt-1">Include timing, severity, and anything staff should know.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Attach a photo if available</p>
                <p className="mt-1">Images help the team verify the issue before visiting.</p>
              </div>
            </div>
          </aside>

          <div className="bg-white px-6 py-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="portal-label">
                  Complaint Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Broken window in Room 204"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="portal-input mt-2"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="portal-label">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={6}
                  placeholder="Provide more details about the issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="portal-input mt-2 resize-none"
                  required
                />
              </div>

              <div>
                <label className="portal-label">Photo Evidence (Optional)</label>
                <label
                  htmlFor="file-upload"
                  className="mt-2 block cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-5 transition hover:border-indigo-400 hover:bg-indigo-50"
                >
                  {previewUrl ? (
                    <div className="space-y-4">
                      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <img src={previewUrl} alt="Preview" className="h-64 w-full object-cover" />
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-medium text-slate-700">{image?.name}</p>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            setImage(null);
                          }}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-700">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="mt-4 text-sm font-semibold text-slate-900">Upload an image</p>
                      <p className="mt-1 text-sm text-slate-500">PNG, JPG, or JPEG files work best.</p>
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

              <div className="border-t border-slate-200 pt-5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="portal-button-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting..." : "Submit Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RaiseTicket;
