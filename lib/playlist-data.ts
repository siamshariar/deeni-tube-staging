// lib/playlist-data.ts
import { videoData } from "@/lib/video-data";

export interface PlaylistItem {
  id: string;
  slug: string;
  name: string;
  videoIds: string[];
  updatedAt: string;
  isPublic: boolean;
  type: "playlist";           // all playlists are now “playlist”
  thumbnailColor: string;
}

// Consistent colour palette
const palette = ["#5A7A8C", "#8C6B5A", "#7A8C5A", "#6A5A8C", "#4A6A8C", "#8C4A6A", "#6A8C4A"];

export const extendedPlaylists: PlaylistItem[] = [
  // 🔹 Watch Later – always first
  {
    id: "pl-watch-later",
    slug: "watch-later",
    name: "Watch Later",
    videoIds: videoData.slice(0, 4).map(v => v.id),   // sample videos
    updatedAt: "Just now",
    isPublic: false,
    type: "playlist",
    thumbnailColor: palette[0],
  },

  // Scholar playlists
  {
    id: "pl-islamic-1",
    slug: "monzur-lectures",
    name: "Dr. Monzur-E-Elahi Lectures",
    videoIds: videoData.filter(v => v.channelId === "monzur").map(v => v.id),
    updatedAt: "2 weeks ago",
    isPublic: true,
    type: "playlist",
    thumbnailColor: palette[1],
  },
  {
    id: "pl-islamic-2",
    slug: "abdullah-lectures",
    name: "Dr. Abdullah Jahangir Lectures",
    videoIds: videoData.filter(v => v.channelId === "abdullah").map(v => v.id),
    updatedAt: "1 month ago",
    isPublic: true,
    type: "playlist",
    thumbnailColor: palette[2],
  },

  // Extra playlists
  {
    id: "pl-islamic-3",
    slug: "favorites",
    name: "Favorite Islamic Lectures",
    videoIds: ["v1", "v6", "v8", "v10"],
    updatedAt: "3 days ago",
    isPublic: false,
    type: "playlist",
    thumbnailColor: palette[3],
  },
  {
    id: "pl-extra-2",
    slug: "music-playlist",
    name: "Music Playlist",
    videoIds: videoData.slice(0, 5).map(v => v.id),
    updatedAt: "1 month ago",
    isPublic: true,
    type: "playlist",
    thumbnailColor: palette[4],
  },
  {
    id: "pl-extra-3",
    slug: "owned-collection",
    name: "Owned Collection",
    videoIds: videoData.slice(5, 10).map(v => v.id),
    updatedAt: "3 days ago",
    isPublic: false,
    type: "playlist",
    thumbnailColor: palette[5],
  },
  {
    id: "pl-extra-4",
    slug: "study-playlist",
    name: "Study Playlist",
    videoIds: videoData.map(v => v.id),
    updatedAt: "Yesterday",
    isPublic: true,
    type: "playlist",
    thumbnailColor: palette[6],
  },
];