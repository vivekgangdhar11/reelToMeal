import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const FoodPartnerDashboard = () => {
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    axios
      .get("http://localhost:3000/api/auth/foodpartner/me", {
        withCredentials: true,
      })
      .then((res) => {
        if (!mounted) return;
        setPartner(res.data?.foodPartner || null);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Please log in as Food Partner.");
      });

    axios
      .get("http://localhost:3000/api/food/my", { withCredentials: true })
      .then((res) => {
        if (!mounted) return;
        setVideos(res.data?.foodItems || []);
      })
      .catch(() => {
        if (!mounted) return;
        // keep error minimal, profile may still show
      });

    return () => {
      mounted = false;
    };
  }, []);

  const avatarInitial = (partner?.name || "S").slice(0, 1).toUpperCase();

  return (
    <div className="container" style={{ padding: "1rem", paddingBottom: 92 }}>
      {/* Primary actions */}
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button
          onClick={() => navigate("/createfood")}
          style={{
            padding: "0.5rem 0.75rem",
            background: "#0ea5e9",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Create Food
        </button>
      </div>
      {/* Top-right logout button */}
      <button
        onClick={async () => {
          try {
            await axios.get(
              "http://localhost:3000/api/auth/foodpartner/logout",
              {
                withCredentials: true,
              },
            );
          } catch {}
          try {
            localStorage.removeItem("foodPartner");
          } catch {}
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

      {/* Profile header */}
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-md)",
          padding: "16px",
          marginBottom: 12,
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 24,
              color: "var(--color-text)",
            }}
          >
            {avatarInitial}
          </div>

          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              {partner?.name || "Store"}
            </div>
            <div style={{ color: "var(--color-muted)" }}>
              {partner?.email || ""}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginTop: 16,
          }}
        >
          <div>
            <div style={{ color: "var(--color-muted)" }}>Contact Name</div>
            <div style={{ fontWeight: 600 }}>{partner?.contactName || ""}</div>
          </div>
          <div>
            <div style={{ color: "var(--color-muted)" }}>Phone</div>
            <div style={{ fontWeight: 600 }}>{partner?.phone || ""}</div>
          </div>
          <div>
            <div style={{ color: "var(--color-muted)" }}>Address</div>
            <div style={{ fontWeight: 600 }}>{partner?.address || ""}</div>
          </div>
        </div>
      </div>

      {/* Videos grid */}
      <h2 style={{ margin: 0, marginBottom: 8 }}>Your Videos</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
        }}
      >
        {videos.map((item) => (
          <div
            key={item._id}
            style={{
              background: "var(--color-border)",
              borderRadius: "var(--radius-sm)",
              overflow: "hidden",
              aspectRatio: "1 / 1",
            }}
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
        {videos.length === 0 && (
          <div style={{ gridColumn: "1 / -1", color: "var(--color-muted)" }}>
            No videos yet. Upload your first from Create Food.
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: "1px solid #e5e7eb",
          background: "#fff",
          display: "flex",
          justifyContent: "space-around",
          padding: "0.75rem 0",
        }}
      >
        <Link to="/reels" style={{ textDecoration: "none" }}>
          Video Section
        </Link>
        <Link to="/food-partner/dashboard" style={{ textDecoration: "none" }}>
          Partner Profile
        </Link>
      </nav>

      {error && <div style={{ color: "#b00020", marginTop: 12 }}>{error}</div>}
    </div>
  );
};

export default FoodPartnerDashboard;
