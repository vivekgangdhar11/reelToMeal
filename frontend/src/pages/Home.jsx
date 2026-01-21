import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const containerRef = useRef(null);
  const videoRefs = useRef([]);

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch videos
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");
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

              {/* foodPartner is an ObjectId string in responses */}
              <Link to={`/food-partner/login`} className="reel-cta">
                Visit Store
              </Link>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Home;
