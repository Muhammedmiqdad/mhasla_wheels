// src/pages/admin/AdminMetadataConsole.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Meta {
  id?: number;
  site_title: string;
  site_description: string;
  meta_keywords: string;
  og_image_url: string;
}

export default function AdminMetadataConsole() {
  const [metadata, setMetadata] = useState<Meta[]>([]);
  const [editing, setEditing] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMetadata = async () => {
    try {
      const res = await fetch("/.netlify/functions/metadata-crud", {
        headers: { "x-admin-token": import.meta.env.VITE_ADMIN_TOKEN },
      });
      const data = await res.json();
      setMetadata(data || []);
    } catch (err) {
      console.error("Error fetching metadata:", err);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    setLoading(true);
    const method = editing?.id ? "PUT" : "POST";

    try {
      await fetch("/.netlify/functions/metadata-crud", {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": import.meta.env.VITE_ADMIN_TOKEN,
        },
        body: JSON.stringify(editing),
      });
      setEditing(null);
      fetchMetadata();
    } catch (err) {
      console.error("Error saving metadata:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this metadata?")) return;
    try {
      await fetch("/.netlify/functions/metadata-crud", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": import.meta.env.VITE_ADMIN_TOKEN,
        },
        body: JSON.stringify({ id }),
      });
      fetchMetadata();
    } catch (err) {
      console.error("Error deleting metadata:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      {/* Header */}
      <div className="sticky top-0 bg-[#111] border-b border-gray-700 shadow-lg p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-3 z-10 rounded-xl">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold text-red-500">Admin Metadata</h1>
          <nav className="flex gap-3">
            <a
              href="/admin/bookings"
              className="px-3 py-1 rounded-md font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition"
            >
              Bookings
            </a>
            <a
              href="/admin/fleet"
              className="px-3 py-1 rounded-md font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition"
            >
              Fleet
            </a>
            <a
              href="/admin/metadata"
              className="px-3 py-1 rounded-md font-medium bg-red-600 text-white hover:bg-red-700 transition"
            >
              Metadata
            </a>
            <a
              href="/admin/settings"
              className="px-3 py-1 rounded-md font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition"
            >
              Settings
            </a>
          </nav>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            localStorage.removeItem("ADMIN_TOKEN");
            window.location.href = "/admin/login";
          }}
        >
          Logout
        </Button>
      </div>

      {/* Metadata Manager */}
      <div className="max-w-5xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-red-500">
          🧭 Website Metadata Manager
        </h2>

        {/* Metadata List */}
        <div className="space-y-3">
          {metadata.length === 0 && (
            <p className="text-gray-500 italic">No metadata found.</p>
          )}
          {metadata.map((meta) => (
            <div
              key={meta.id}
              className="p-4 bg-[#111] border border-gray-700 rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg text-white">
                  {meta.site_title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {meta.site_description}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setEditing(meta)}
                >
                  Edit
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => handleDelete(meta.id!)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Button */}
        <Button
          onClick={() =>
            setEditing({
              site_title: "",
              site_description: "",
              meta_keywords: "",
              og_image_url: "",
            })
          }
          className="bg-green-600 hover:bg-green-700"
        >
          Add New Metadata
        </Button>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#111] p-6 rounded-xl w-full max-w-md border border-red-700 space-y-3">
            <h2 className="text-xl font-semibold mb-2 text-red-500">
              {editing.id ? "Edit Metadata" : "Add Metadata"}
            </h2>

            <input
              name="site_title"
              value={editing.site_title}
              onChange={(e) =>
                setEditing({ ...editing, site_title: e.target.value })
              }
              placeholder="Site Title"
              className="w-full p-3 bg-[#1A1A1A] border border-gray-700 rounded"
            />
            <textarea
              name="site_description"
              value={editing.site_description}
              onChange={(e) =>
                setEditing({ ...editing, site_description: e.target.value })
              }
              placeholder="Description"
              className="w-full p-3 bg-[#1A1A1A] border border-gray-700 rounded"
            />
            <input
              name="meta_keywords"
              value={editing.meta_keywords}
              onChange={(e) =>
                setEditing({ ...editing, meta_keywords: e.target.value })
              }
              placeholder="Keywords"
              className="w-full p-3 bg-[#1A1A1A] border border-gray-700 rounded"
            />
            <input
              name="og_image_url"
              value={editing.og_image_url}
              onChange={(e) =>
                setEditing({ ...editing, og_image_url: e.target.value })
              }
              placeholder="OG Image URL"
              className="w-full p-3 bg-[#1A1A1A] border border-gray-700 rounded"
            />

            <div className="flex justify-between pt-4">
              <Button
                onClick={() => setEditing(null)}
                className="bg-gray-600 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
