import { useState, useEffect } from "react";

interface LivestreamLinkProps {
  url: string;
}

export default function LivestreamLink(props: LivestreamLinkProps) {

  const [isLive, setIsLive] = useState(false);

  useEffect(() => {

    async function checkLiveStatus() {
      try {
        const response = await fetch(props.url);
        const data = await response.json();
        if (data && data.isLive) {
          setIsLive(true);
        } else {
          setIsLive(false);
        }
      } catch (error) {
        //console.error('Error fetching live stream URL:', error);
        setIsLive(false);
      }
    }

    checkLiveStatus(); // Initial check


    const interval = setInterval(checkLiveStatus, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [props.url]);

  return (
    <a href="/livestream">
      <span id="live-stream-status-icon" className={isLive ? "live-indicator red" : ''}>
        {isLive ? '🔴' : '⚪'}
      </span>
      {isLive ? <strong>LIVESTREAM</strong> : <span>LIVESTREAM</span>}
    </a>
  );
}