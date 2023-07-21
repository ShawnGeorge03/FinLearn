import { useEffect, useRef, useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

interface YoutubePlayerProps {
  videoId: string;
  progressPercent: number;
  userId: string;
  videoSlug: string;
}
type CustomTimer = {
  currentTimer: NodeJS.Timer | null;
};

const defaultRef: CustomTimer = {
  currentTimer: null,
};

const YoutubePlayer = ({
  videoId,
  progressPercent,
  userId,
  videoSlug,
}: YoutubePlayerProps) => {
  const ref = useRef(null);
  const interval = useRef(defaultRef);
  const [youtubeProps, setYoutobeProps] = useState<YouTubeProps['opts']>({
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      start: 0,
    },
  });

  const _onPlay: YouTubeProps['onStateChange'] = (_event) => {
    if (interval.current != null && interval.current.currentTimer != null)
      clearInterval(interval.current.currentTimer);
    interval.current.currentTimer = setInterval(patchProgress, 5000);
  };
  const _onPause: YouTubeProps['onStateChange'] = (_event) => {
    if (interval.current.currentTimer != null) {
      clearInterval(interval.current.currentTimer);
      interval.current.currentTimer = null;
    }
  };

  const patchProgress = async () => {
    if (ref.current == null) return;

    const current = await (ref.current as any)
      .getInternalPlayer()
      .getCurrentTime();
    const duration = await (ref.current as any)
      .getInternalPlayer()
      .getDuration();
    const requestBody = {
      userID: userId,
      videoSlug: videoSlug,
      videoProgressPercent: (current / duration) * 100,
    };
    const fetchOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json', // Specifying JSON content in the headers
      },
      body: JSON.stringify(requestBody), // Convert the object to JSON string
    };

    fetch('http://localhost:4000/videoProgress', fetchOptions);
  };

  useEffect(() => {
    const calculateYoutubeProps = async () => {
      if (ref.current == null) return;
      const duration = await (ref.current as any)
        .getInternalPlayer()
        .getDuration();
      setYoutobeProps({
        height: '100%',
        width: '100%',
        playerVars: {
          autoplay: 0,
          start: (progressPercent / 100) * duration,
        },
      });
    };
    calculateYoutubeProps();
  }, [ref.current]);

  return (
    <YouTube
      onEnd={_onPause}
      onPause={_onPause}
      onPlay={_onPlay}
      opts={youtubeProps}
      ref={ref}
      videoId={videoId}
    />
  );
};

export default YoutubePlayer;
