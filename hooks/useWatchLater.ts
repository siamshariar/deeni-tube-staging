// hooks/useWatchLater.ts
import { useState, useEffect } from 'react';

export interface WatchLaterVideo {
  id: string;
  title: string;
  channel: string;
  channelAvatar: string;
  thumbnail: string;
  views: string;
  timeAgo: string;
  duration: string;
  addedAt: number;
}

const STORAGE_KEY = 'deeni-watch-later';

export const useWatchLater = () => {
  const [videos, setVideos] = useState<WatchLaterVideo[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setVideos(JSON.parse(stored));
    }
  }, []);

  const addToWatchLater = (video: WatchLaterVideo) => {
    setVideos(prev => {
      if (prev.some(v => v.id === video.id)) return prev;
      const updated = [video, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromWatchLater = (videoId: string) => {
    setVideos(prev => {
      const updated = prev.filter(v => v.id !== videoId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isInWatchLater = (videoId: string) => videos.some(v => v.id === videoId);

  return { videos, addToWatchLater, removeFromWatchLater, isInWatchLater };
};