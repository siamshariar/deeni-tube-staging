import { useState, useEffect, useCallback } from "react";

export interface LikedVideo {
  id: string;
  title: string;
  channel: string;
  channelAvatar: string;
  thumbnail: string;
  views: string;
  timeAgo: string;
  duration: string;
  likedAt: number;
}

const STORAGE_KEY = "deeni-liked-videos";

export function useLikedVideos() {
  const [videos, setVideos] = useState<LikedVideo[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setVideos(JSON.parse(stored));
        } catch {}
      }
    }
  }, []);

  const persist = (updated: LikedVideo[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    setVideos(updated);
  };

  const addLike = useCallback((video: LikedVideo) => {
    setVideos(prev => {
      if (prev.some(v => v.id === video.id)) return prev;
      const updated = [video, ...prev];
      persist(updated);
      return updated;
    });
  }, []);

  const removeLike = useCallback((videoId: string) => {
    setVideos(prev => {
      const updated = prev.filter(v => v.id !== videoId);
      persist(updated);
      return updated;
    });
  }, []);

  const isLiked = useCallback((videoId: string) => videos.some(v => v.id === videoId), [videos]);

  return { videos, addLike, removeLike, isLiked };
}