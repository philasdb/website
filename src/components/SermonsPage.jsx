import React, { useEffect, useState } from "react";

const YOUTUBE_API_URL = "https://content-youtube.googleapis.com/youtube/v3/search?type=video&order=date&eventType=completed&channelId=UCtQ_XJELDHnjEolMjmIVpHw&maxResults=50&part=snippet&key=AIzaSyCGsp2PD5EuQgFkonuKQM-9ieCr2bhCY0M";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

const SermonsPage = () => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(YOUTUBE_API_URL)
      .then(res => res.json())
      .then(data => {
        setSermons(data.items || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading sermons...</div>;

  return (
    <div className="sermons-list" style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
      {sermons.map(item => (
        <a
          key={item.id.videoId}
          href={`https://www.youtube.com/watch?v=${item.id.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "inherit", border: "1px solid #eee", borderRadius: "8px", overflow: "hidden", background: "#fff" }}
        >
          <img
            src={item.snippet.thumbnails.high.url}
            alt={item.snippet.title}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
          <div style={{ padding: "1rem" }}>
            <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>{item.snippet.title.replace(/&quot;/g, '"')}</h3>
            <p style={{ margin: 0, color: "#666" }}>{formatDate(item.snippet.publishedAt)}</p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default SermonsPage;
