import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

// Profile layout using theme.css variables and utilities
const Profile = () => {
  const { partnerId } = useParams();
  const [partner, setPartner] = useState(null);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");

  // Fetch partner details
  useEffect(() => {
    let mounted = true;
    axios
      .get(`http://localhost:3000/api/auth/foodpartner/${partnerId}`)
      .then((res) => {
        if (!mounted) return;
        setPartner(res.data?.foodPartner || null);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Failed to load store profile.");
      });
    return () => {
      mounted = false;
    };
  }, [partnerId]);

  // Fetch all videos and filter by partnerId (requires logged-in user)
  useEffect(() => {
    let mounted = true;
    axios
      .get("http://localhost:3000/api/food", { withCredentials: true })
      .then((res) => {
        if (!mounted) return;
        const items = res.data?.foodItems || [];
        setVideos(
          items.filter((f) => String(f.foodPartner) === String(partnerId)),
        );
      })
      .catch(() => {
        if (!mounted) return;
        // Keep error minimal; partner info may still render
      });
    return () => {
      mounted = false;
    };
  }, [partnerId]);

  const totalMeals = useMemo(() => videos.length, [videos]);

  return (
    <div className="container" style={{ paddingTop: 16, paddingBottom: 24 }}>
      {/* Header card */}
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-md)",
          padding: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            aria-label="Store avatar"
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "var(--color-border)",
            }}
          />

          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button
              style={{
                border: "none",
                borderRadius: 999,
                padding: "10px 14px",
                background: "var(--color-primary)",
                color: "var(--color-primary-contrast)",
                boxShadow: "var(--shadow-sm)",
                fontWeight: 600,
              }}
            >
              {partner ? partner.name : "Loading…"}
            </button>
            <button
              style={{
                border: "1px solid var(--color-border)",
                borderRadius: 999,
                padding: "10px 14px",
                background: "transparent",
                color: "var(--color-text)",
                fontWeight: 600,
              }}
            >
              {partner?.address || ""}
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginTop: 16,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "var(--color-muted)" }}>total meals</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>
              {totalMeals}
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "var(--color-muted)" }}>Phone No</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>
              {partner?.phone || ""}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "var(--color-border)",
            marginTop: 12,
          }}
        />
      </div>

      {/* Video grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          marginTop: 12,
        }}
      >
        {videos.map((item) => (
          <div
            key={item._id}
            style={{
              background: "var(--color-border)",
              borderRadius: "var(--radius-sm)",
              aspectRatio: "1 / 1",
              overflow: "hidden",
              display: "grid",
              placeItems: "center",
            }}
            title={item.name}
          >
            <video
              src={item.video}
              muted
              loop
              playsInline
              autoPlay
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>

      {error && (
        <div style={{ marginTop: 12 }}>
          <div style={{ color: "#b00020" }}>{error}</div>
          <Link
            to="/"
            className="reel-cta"
            style={{ marginTop: 8, display: "inline-block" }}
          >
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default Profile;
