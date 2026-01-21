import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateFood = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0] || null;
    setVideo(file);
    setError(null);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!name.trim() || !description.trim() || !video) {
      setError("Please provide a name, description, and video file.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("video", video);

      const res = await fetch("http://localhost:3000/api/food", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to create food item");
      }

      setMessage("Food item created successfully.");
      setName("");
      setDescription("");
      setVideo(null);
      setPreviewUrl(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "1rem" }}>
      {/* Top-right logout button for Food Partner */}
      <button
        onClick={async () => {
          try {
            await axios.get(
              "http://localhost:3000/api/auth/foodpartner/logout",
              {
                withCredentials: true,
              },
            );
          } catch (e) {
            // ignore errors
          }
          try {
            localStorage.removeItem("foodPartner");
          } catch (e) {}
          navigate("/food-partner/login");
        }}
        style={{
          position: "fixed",
          top: 12,
          right: 12,
          padding: "0.5rem 0.75rem",
          background: "#ef4444",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          zIndex: 50,
        }}
      >
        Logout
      </button>
      <h1 style={{ marginBottom: "1rem" }}>Create Food</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "0.75rem" }}>
          <label htmlFor="name" style={{ display: "block", marginBottom: 4 }}>
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter food name"
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <label
            htmlFor="description"
            style={{ display: "block", marginBottom: 4 }}
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your food item"
            rows={4}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <label htmlFor="video" style={{ display: "block", marginBottom: 4 }}>
            Upload Video
          </label>
          <input
            id="video"
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
          />
        </div>

        {previewUrl && (
          <div style={{ marginBottom: "0.75rem" }}>
            <video
              src={previewUrl}
              controls
              style={{ width: "100%", maxHeight: 320, background: "#000" }}
            />
          </div>
        )}

        {error && (
          <div style={{ color: "#b00020", marginBottom: "0.75rem" }}>
            {error}
          </div>
        )}
        {message && (
          <div style={{ color: "#0d7a00", marginBottom: "0.75rem" }}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "0.6rem 1rem",
            background: submitting ? "#999" : "#0ea5e9",
            color: "#fff",
            border: "none",
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Submitting..." : "Create Food"}
        </button>
      </form>
    </div>
  );
};

export default CreateFood;
