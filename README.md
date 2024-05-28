import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
const Dashboard = () => {
  const [embedUrl, setEmbedUrl] = useState(
    "https://eu-west-2.quicksight.aws.amazon.com/sn/embed/share/accounts/879634695871/dashboards/9529833a-2a74-45b0-9d35-7d3c5423453d?directory_alias=samarth-athena"
  );
  const iframeRef = useRef(null);
  useEffect(() => {
    // fetching the embed URL from the API
    const fetchEmbedUrl = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/quicksight-url"
        );
        setEmbedUrl(response.data.embedUrl);
      } catch (err) {
        console.error("Error fetching embed URL:", err);
      }
    };
    // Fetching the embed URL initially
    fetchEmbedUrl();
    // auto refresh the embed URL every 1 minute
    const interval = setInterval(fetchEmbedUrl, 10 * 1000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = embedUrl;
    }
  }, [embedUrl]);
  return (
    <div id="dashboard-container" style={{ width: "100%", height: "600px" }}>
      {embedUrl ? (
        <iframe
          ref={iframeRef}
          width="100%"
          height="600px"
          src={embedUrl}
          frameBorder="0"
          title="QuickSight Dashboard"
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
export default Dashboard;
