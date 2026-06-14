// hooks/useFeedPreferences.ts
import { useState, useEffect } from 'react';
import { getAllChannelIds } from '@/lib/channels';

const STORAGE_KEY = 'deeni-feed-preferences';

export const useFeedPreferences = () => {
  const [followedChannels, setFollowedChannels] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setFollowedChannels(JSON.parse(stored));
    } else {
      // First time: all channels are ON by default
      const allIds = getAllChannelIds();
      setFollowedChannels(allIds);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allIds));
    }
  }, []);

  const toggleFollowChannel = (channelId: string) => {
    setFollowedChannels(prev => {
      const newList = prev.includes(channelId)
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      return newList;
    });
  };

  const isFollowed = (channelId: string) => followedChannels.includes(channelId);

  return { followedChannels, toggleFollowChannel, isFollowed };
};