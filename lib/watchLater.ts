// lib/watchLater.ts
const STORAGE_KEY = 'deeni-watch-later';

export interface WatchLaterVideo {
  id: string;
  title: string;
  channel: string;
  channelAvatar: string;
  views: string;
  timeAgo: string;
  duration: string;
  thumbnail: string;
  addedAt: number;
}

export const getWatchLater = (): WatchLaterVideo[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addToWatchLater = (video: Omit<WatchLaterVideo, 'addedAt'>) => {
  const list = getWatchLater();
  if (list.some(v => v.id === video.id)) return false; // already exists
  const newList = [...list, { ...video, addedAt: Date.now() }];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  return true;
};

export const removeFromWatchLater = (videoId: string) => {
  const list = getWatchLater();
  const newList = list.filter(v => v.id !== videoId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
};

export const isInWatchLater = (videoId: string): boolean => {
  return getWatchLater().some(v => v.id === videoId);
};