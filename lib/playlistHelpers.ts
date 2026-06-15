// lib/playlistHelpers.ts
import { getWatchLater, WatchLaterVideo } from './watchLater';

export interface Playlist {
  id: string;
  name: string;
  slug: string;
  isPublic: boolean;
  videoCount: number;
  updatedAt: string;
  videos: WatchLaterVideo[];
}

const PLAYLISTS_KEY = 'deeni-playlists';

export const getPlaylists = (): Playlist[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(PLAYLISTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const savePlaylists = (playlists: Playlist[]) => {
  localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
};

export const addVideoToPlaylist = (playlistId: string, video: WatchLaterVideo) => {
  const playlists = getPlaylists();
  const index = playlists.findIndex(p => p.id === playlistId);
  if (index === -1) return false;
  const playlist = playlists[index];
  if (playlist.videos.some(v => v.id === video.id)) return false;
  playlist.videos.push({ ...video, addedAt: Date.now() });
  playlist.videoCount = playlist.videos.length;
  playlist.updatedAt = 'Just now';
  playlists[index] = playlist;
  savePlaylists(playlists);
  return true;
};

export const createPlaylist = (name: string, isPublic: boolean): Playlist => {
  const id = Date.now().toString();
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const newPlaylist: Playlist = {
    id,
    name,
    slug,
    isPublic,
    videoCount: 0,
    updatedAt: 'Just now',
    videos: [],
  };
  const playlists = getPlaylists();
  savePlaylists([newPlaylist, ...playlists]);
  return newPlaylist;
};