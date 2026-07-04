// lib/playlist-data.ts
import { videoData } from "@/lib/video-data";

export interface PlaylistItem {
  id: string;
  slug: string;
  name: string;
  videoIds: string[];
  updatedAt: string;
  isPublic: boolean;
  type: "playlist";
  thumbnailColor: string;
}

// Consistent colour palette
const palette = ["#5A7A8C", "#8C6B5A", "#7A8C5A", "#6A5A8C", "#4A6A8C", "#8C4A6A", "#6A8C4A", "#5A8C7A", "#8C7A5A", "#6A7A8C"];

export const extendedPlaylists: PlaylistItem[] = [
  // System playlists (Watch Later & Liked Videos)
  {
    id: "pl-watch-later",
    slug: "watch-later",
    name: "Watch Later",
    videoIds: ["v3", "v7", "v11", "v18", "v22", "v27", "v30", "v34"],
    updatedAt: "2 hours ago",
    isPublic: false,
    type: "playlist",
    thumbnailColor: "#1a1a2e",
  },
  {
    id: "pl-liked-videos",
    slug: "liked-videos",
    name: "Liked Videos",
    videoIds: ["v1", "v5", "v8", "v12", "v17", "v21", "v25", "v29", "v33", "v35"],
    updatedAt: "Yesterday",
    isPublic: false,
    type: "playlist",
    thumbnailColor: "#1e3a5f",
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
  {
    id: "pl-zakir-naik",
    slug: "zakir-naik-lectures",
    name: "Dr. Zakir Naik — Q&A Sessions",
    videoIds: videoData.filter(v => v.channelId === "zakir").map(v => v.id),
    updatedAt: "3 weeks ago",
    isPublic: true,
    type: "playlist",
    thumbnailColor: palette[7],
  },
  {
    id: "pl-mufti-menk",
    slug: "mufti-menk-series",
    name: "Mufti Menk — Life Lessons",
    videoIds: videoData.filter(v => v.channelId === "mufti-menk").map(v => v.id),
    updatedAt: "5 days ago",
    isPublic: true,
    type: "playlist",
    thumbnailColor: palette[8],
  },

  // Topic playlists
  {
    id: "pl-quran-tafsir",
    slug: "quran-tafsir-series",
    name: "Quran Tafsir Series",
    videoIds: ["v4", "v9", "v14", "v19", "v24", "v29", "v33"],
    updatedAt: "1 week ago",
    isPublic: true,
    type: "playlist",
    thumbnailColor: palette[0],
  },
  {
    id: "pl-jummah",
    slug: "friday-khutbah-collection",
    name: "Friday Khutbah Collection",
    videoIds: ["v5", "v10", "v15", "v20", "v25", "v30"],
    updatedAt: "2 days ago",
    isPublic: true,
    type: "playlist",
    thumbnailColor: palette[6],
  },
  {
    id: "pl-seerah",
    slug: "islamic-history-seerah",
    name: "Islamic History & Seerah",
    videoIds: ["v2", "v6", "v11", "v16", "v21", "v26", "v31"],
    updatedAt: "3 weeks ago",
    isPublic: true,
    type: "playlist",
    thumbnailColor: palette[9],
  },
  {
    id: "pl-islamic-3",
    slug: "favorites",
    name: "Favorite Islamic Lectures",
    videoIds: ["v1", "v6", "v8", "v10", "v17", "v23"],
    updatedAt: "3 days ago",
    isPublic: false,
    type: "playlist",
    thumbnailColor: palette[3],
  },
  {
    id: "pl-ramadan",
    slug: "ramadan-lectures",
    name: "Ramadan Lecture Series",
    videoIds: ["v3", "v8", "v13", "v18", "v23", "v28", "v32", "v35"],
    updatedAt: "2 months ago",
    isPublic: true,
    type: "playlist",
    thumbnailColor: "#4a2060",
  },
  {
    id: "pl-extra-3",
    slug: "owned-collection",
    name: "Owned Collection",
    videoIds: videoData.slice(5, 12).map(v => v.id),
    updatedAt: "3 days ago",
    isPublic: false,
    type: "playlist",
    thumbnailColor: palette[5],
  },
  {
    id: "pl-extra-4",
    slug: "study-playlist",
    name: "Study & Learning Playlist",
    videoIds: videoData.slice(0, 20).map(v => v.id),
    updatedAt: "Yesterday",
    isPublic: true,
    type: "playlist",
    thumbnailColor: palette[4],
  },
  {
    id: "pl-aqeedah",
    slug: "aqeedah-fundamentals",
    name: "Aqeedah Fundamentals",
    videoIds: ["v7", "v12", "v17", "v22", "v27"],
    updatedAt: "1 month ago",
    isPublic: true,
    type: "playlist",
    thumbnailColor: "#2d5a27",
  },
  {
    id: "pl-short-clips",
    slug: "short-islamic-clips",
    name: "Short Islamic Clips",
    videoIds: ["v2", "v4", "v9", "v13", "v19", "v24", "v28", "v34"],
    updatedAt: "4 hours ago",
    isPublic: true,
    type: "playlist",
    thumbnailColor: "#5a3020",
  },
];