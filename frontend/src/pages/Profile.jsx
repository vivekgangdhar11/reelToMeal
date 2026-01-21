import React from "react";

// Profile layout using theme.css variables and utilities
const Profile = () => {
  // Static demo data; wire real data later
  const business = {
    name: "Business Name",
    address: "123 Main Street",
    totalMeals: 43,
    customersServed: "15K",
  };

  const placeholders = Array.from({ length: 9 }, (_, i) => `video-${i + 1}`);

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
              {business.name}
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
              {business.address}
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
              {business.totalMeals}
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "var(--color-muted)" }}>customer serve</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>
              {business.customersServed}
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
        {placeholders.map((key) => (
          <div
            key={key}
            style={{
              background: "var(--color-border)",
              borderRadius: "var(--radius-sm)",
              aspectRatio: "1 / 1",
              display: "grid",
              placeItems: "center",
              color: "var(--color-text)",
              fontWeight: 600,
            }}
          >
            video
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
