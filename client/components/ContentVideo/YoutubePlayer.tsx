import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YoutubePlayerProps {
  videoId: string;
}

const YoutubePlayer: React.FC<YoutubePlayerProps> = ({ videoId }) => {
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const youtubePlayerContainer = playerRef.current;

    // Load the YouTube IFrame API script
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    // Create the YouTube player when the API is ready
    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player(youtubePlayerContainer, {
        height: '100%',
        width: '100%',
        videoId: videoId,
      });
    };
  }, [videoId]);

  return <div ref={playerRef} />;
};

export default YoutubePlayer;
