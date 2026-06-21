// lib/playlist-data.ts
import { videoData } from "@/lib/video-data";

export interface PlaylistItem {
  id: string;
  slug: string;
  name: string;
  videoIds: string[];
  updatedAt: string;
  isPublic: boolean;
  type: "playlist" | "saved";
  thumbnailColor: string;
}

export const extendedPlaylists: PlaylistItem[] = [
  {
    id: "pl-islamic-1",
    slug: "monzur-lectures",
    name: "Dr. Monzur-E-Elahi Lectures",
    videoIds: videoData.filter(v => v.channelId === "monzur").map(v => v.id),
    updatedAt: "2 weeks ago",
    isPublic: true,
    type: "playlist",
    thumbnailColor: "#5A7A8C",
  },
  {
    id: "pl-islamic-2",
    slug: "abdullah-lectures",
    name: "Dr. Abdullah Jahangir Lectures",
    videoIds: videoData.filter(v => v.channelId === "abdullah").map(v => v.id),
    updatedAt: "1 month ago",
    isPublic: true,
    type: "playlist",
    thumbnailColor: "#8C6B5A",
  },
  {
    id: "pl-islamic-3",
    slug: "favorites",
    name: "Favorite Islamic Lectures",
    videoIds: ["v1", "v6", "v8", "v10"],
    updatedAt: "3 days ago",
    isPublic: false,
    type: "playlist",
    thumbnailColor: "#7A8C5A",
  },
  {
    id: "pl-islamic-4",
    slug: "quran-studies",
    name: "Quran Studies",
    videoIds: ["v1", "v2", "v6", "v7"],
    updatedAt: "Yesterday",
    isPublic: true,
    type: "playlist",
    thumbnailColor: "#6A5A8C",
  },
  // Extra playlists (e.g., saved, music, study) from the original extended list
  {
    id: "pl-extra-1",
    slug: "saved-for-later",
    name: "Saved for later",
    videoIds: Array.from({ length: 12 }, () => videoData[Math.floor(Math.random() * videoData.length)]?.id || "v1"),
    updatedAt: "2 weeks ago",
    isPublic: false,
    type: "saved",
    thumbnailColor: "#4A6A8C",
  },
  {
    id: "pl-extra-2",
    slug: "music-playlist",
    name: "Music Playlist",
    videoIds: videoData.slice(0, 5).map(v => v.id),
    updatedAt: "1 month ago",
    isPublic: true,
    type: "playlist",
    thumbnailColor: "#8C4A6A",
  },
  {
    id: "pl-extra-3",
    slug: "owned-collection",
    name: "Owned Collection",
    videoIds: videoData.slice(5, 10).map(v => v.id),
    updatedAt: "3 days ago",
    isPublic: false,
    type: "playlist",
    thumbnailColor: "#6A8C4A",
  },
  {
    id: "pl-extra-4",
    slug: "study-playlist",
    name: "Study Playlist",
    videoIds: videoData.map(v => v.id),
    updatedAt: "Yesterday",
    isPublic: true,
    type: "playlist",
    thumbnailColor: "#4A6A8C",
  },
];