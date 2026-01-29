import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch videos
  useEffect(() => {
    let mounted = true;
    axios
      .get("http://localhost:3000/api/food", { withCredentials: true })
      .then((res) => {
        if (!mounted) return;
        setVideos(res.data?.foodItems || []);
      })
      .catch((err) => {
        if (!mounted) return;
        const status = err?.response?.status;
        if (status === 401) {
          setError("Please log in as a user to view reels.");
        } else {
          setError("Failed to load reels. Please try again.");
        }
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  // Auto play / pause when in view
  useEffect(() => {
    if (!videos.length) return;

    videoRefs.current = videoRefs.current.slice(0, videos.length);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            // Ensure play only after metadata is ready
            if (video.readyState >= 2) {
              video.play().catch(() => {});
            } else {
              const onLoaded = () => {
                video.play().catch(() => {});
                video.removeEventListener("loadeddata", onLoaded);
              };
              video.addEventListener("loadeddata", onLoaded);
            }
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 },
    );

    videoRefs.current.forEach((v) => v && observer.observe(v));
    return () => observer.disconnect();
  }, [videos]);

  if (loading) {
    return (
      <div ref={containerRef} className="reels">
        <section className="reel">
          <div className="reel-overlay">
            <div className="reel-meta">
              <p className="reel-desc">Loading reels…</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div ref={containerRef} className="reels">
        <section className="reel">
          <div className="reel-overlay">
            <div className="reel-meta">
              <p className="reel-desc">{error}</p>
              <Link to="/user/login" className="reel-cta">
                Go to Login
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="reels">
      {/* Top-right logout button */}
      <button
        onClick={async () => {
          try {
            await axios.get("http://localhost:3000/api/auth/user/logout", {
              withCredentials: true,
            });
          } catch (e) {
            // ignore errors, proceed to clear client state
            console.error("Logout error:", e);
          }
          try {
            localStorage.removeItem("user");
          } catch (e) {
            console.error("LocalStorage clear error:", e);
          }
          navigate("/user/login");
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
      {videos.map((item, index) => (
        <section key={item._id} className="reel">
          <video
            ref={(el) => (videoRefs.current[index] = el)}
            className="reel-video"
            src={item.video || ""}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            onError={() => {
              // Skip broken videos gracefully
              if (videoRefs.current[index]) {
                videoRefs.current[index].pause();
              }
            }}
          />

          <div className="reel-overlay">
            <div className="reel-meta">
              <h3 className="reel-title">{item.name}</h3>
              <p className="reel-desc">{item.description}</p>

              {/* Like button */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <button
                  className="reel-cta"
                  onClick={async () => {
                    try {
                      const res = await axios.post(
                        `http://localhost:3000/api/food/${item._id}/like`,
                        {},
                        { withCredentials: true },
                      );
                      const { liked, likeCount } = res.data || {};
                      setVideos((prev) =>
                        prev.map((v) =>
                          v._id === item._id ? { ...v, liked, likeCount } : v,
                        ),
                      );
                    } catch (e) {
                      console.error("Like toggle failed", e);
                    }
                  }}
                  aria-pressed={!!item.liked}
                  style={{
                    background: item.liked ? "#f59e0b" : undefined,
                  }}
                >
                  {item.liked ? "Liked" : "Like"}
                </button>
                <span style={{ color: "#fff" }}>{item.likeCount || 0}</span>
              </div>

              {/* Navigate to partner profile with partnerId */}
              {item.foodPartner ? (
                <Link
                  to={`/food-partner/profile/${item.foodPartner}`}
                  className="reel-cta"
                >
                  Visit Store
                </Link>
              ) : (
                <span
                  className="reel-cta"
                  aria-disabled="true"
                  style={{ opacity: 0.6, pointerEvents: "none" }}
                >
                  Visit Store
                </span>
              )}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Home;
