"use client";

import { useState, useEffect, useCallback } from "react";

const PLAYLISTS_KEY = "deeni-playlists-list";
const getVideosKey = (playlistId: string) => `playlist_videos_${playlistId}`;

export interface PlaylistVideo {
  id: string;
  title: string;
  channel: string;
  channelAvatar?: string;
  thumbnail?: string;
  views?: string;
  timeAgo?: string;
  duration?: string;
  addedAt?: string;
}

export interface Playlist {
  id: string;
  slug: string;
  name: string;
  videoIds: string[];
  updatedAt: string;
  isPublic: boolean;
}

function loadPlaylists(): Playlist[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PLAYLISTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function savePlaylists(playlists: Playlist[]) {
  if (typeof window !== "undefined")
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
}

function loadVideos(playlistId: string): PlaylistVideo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getVideosKey(playlistId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function saveVideos(playlistId: string, videos: PlaylistVideo[]) {
  if (typeof window !== "undefined")
    localStorage.setItem(getVideosKey(playlistId), JSON.stringify(videos));
}

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPlaylists(loadPlaylists());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) savePlaylists(playlists);
  }, [playlists, loaded]);

  const createPlaylist = useCallback((name: string, isPublic: boolean): string => {
    const id = Date.now().toString();
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const newPlaylist: Playlist = {
      id,
      slug,
      name,
      videoIds: [],
      updatedAt: "Just now",
      isPublic,
    };
    setPlaylists(prev => [newPlaylist, ...prev]);
    saveVideos(id, []); // initialise empty video list
    return id;
  }, []);

  const addVideoToPlaylist = useCallback((playlistId: string, video: PlaylistVideo) => {
    // Update videos array
    const videos = loadVideos(playlistId);
    if (videos.some(v => v.id === video.id)) {
      // Video already in playlist – do nothing (or show toast)
      return;
    }
    const updatedVideos = [{ ...video, addedAt: new Date().toISOString() }, ...videos];
    saveVideos(playlistId, updatedVideos);

    // Update playlist videoIds and updatedAt
    setPlaylists(prev =>
      prev.map(p =>
        p.id === playlistId
          ? { ...p, videoIds: [video.id, ...p.videoIds], updatedAt: "Just now" }
          : p
      )
    );
  }, []);

  const removeVideoFromPlaylist = useCallback((playlistId: string, videoId: string) => {
    const videos = loadVideos(playlistId);
    const updatedVideos = videos.filter(v => v.id !== videoId);
    saveVideos(playlistId, updatedVideos);

    setPlaylists(prev =>
      prev.map(p =>
        p.id === playlistId
          ? { ...p, videoIds: p.videoIds.filter(id => id !== videoId), updatedAt: "Just now" }
          : p
      )
    );
  }, []);

  const getPlaylist = useCallback((playlistId: string) => playlists.find(p => p.id === playlistId), [playlists]);

  const getPlaylistVideos = useCallback((playlistId: string) => loadVideos(playlistId), []);

  return {
    playlists,
    createPlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    getPlaylist,
    getPlaylistVideos,
  };
}