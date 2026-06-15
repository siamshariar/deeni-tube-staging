// hooks/useFeedPreferences.ts
import { useState, useEffect, useCallback } from 'react';
import { getAllChannelIds } from '@/lib/channels';

const STORAGE_KEY = 'deeni-feed-preferences';
const UPDATE_EVENT = 'feed-preferences-updated';

const loadFromStorage = (): string[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  // First time: all channels ON
  const allIds = getAllChannelIds();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allIds));
  return allIds;
};

export const useFeedPreferences = () => {
  const [followedChannels, setFollowedChannels] = useState<string[]>(loadFromStorage);

  // Re‑sync when another component changes the preferences
  useEffect(() => {
    const handleUpdate = () => setFollowedChannels(loadFromStorage());
    window.addEventListener(UPDATE_EVENT, handleUpdate);
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setFollowedChannels(loadFromStorage());
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const persist = (ids: string[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    setFollowedChannels(ids);
    window.dispatchEvent(new Event(UPDATE_EVENT));
  };

  const toggleFollowChannel = useCallback((channelId: string) => {
    setFollowedChannels(prev => {
      const newList = prev.includes(channelId)
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId];
      persist(newList);
      return newList;
    });
  }, []);

  // New: directly set a channel ON or OFF
  const setChannelFeed = useCallback((channelId: string, on: boolean) => {
    setFollowedChannels(prev => {
      const alreadyOn = prev.includes(channelId);
      if (on === alreadyOn) return prev;  // no change
      const newList = on ? [...prev, channelId] : prev.filter(id => id !== channelId);
      persist(newList);
      return newList;
    });
  }, []);

  const isFollowed = useCallback((channelId: string) => followedChannels.includes(channelId), [followedChannels]);

  return {
    followedChannels,
    toggleFollowChannel,
    setChannelFeed,   
    isFollowed,
  };
};