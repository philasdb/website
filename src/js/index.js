
// fetch the live stream url to see if it is live or not
const url = 'https://psdb-livestream.fly.dev/hls/live/demo/output.m3u8';

var isLive = false;

const liveStreamStatusIndicator = document.getElementById('live-stream-status-indicator');
const liveStreamStatusOfflineTemplate = document.getElementById('live-stream-offline');
const liveStreamStatusOnlineTemplate = document.getElementById('live-stream-online');

liveStreamStatusIndicator.innerHTML = liveStreamStatusOfflineTemplate.innerHTML;

function updateLiveStreamStatus() {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            if (isLive === false) {
                liveStreamStatusIndicator.innerHTML = liveStreamStatusOnlineTemplate.innerHTML;
                isLive = true;
            }

        })
        .catch(error => {
            console.error('Error fetching live stream URL:', error);
            if (isLive === true) {
                isLive = false;
                liveStreamStatusIndicator.innerHTML = liveStreamStatusOfflineTemplate.innerHTML;
            }
        });
}

updateLiveStreamStatus();
setInterval(updateLiveStreamStatus, 5000);
