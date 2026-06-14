// lib/channels.ts
export interface Channel {
  id: string;
  slug: string;
  name: string;
  handle?: string;         
  avatar: string;
  coverImage?: string;
  subscribers: number;
  videosCount: number;
  description: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
  verified: boolean;
  language: string;
}

export const allChannels: Channel[] = [
  {
    id: "ch1",
    slug: "islamic-guidance",
    name: "Islamic Guidance",
    handle: "@islamicguidance",
    avatar: "/medical-professional-profile.png",
    coverImage: "/vibrant-health-cover.png",
    subscribers: 2500000,
    videosCount: 3200,
    description: "Islamic Guidance is dedicated to spreading authentic Islamic knowledge through high quality videos. Our channel features lectures from renowned scholars, Quran recitations, and educational content about Islam. We strive to provide accurate and beneficial content for Muslims and non-Muslims alike. Join us on this journey of learning and discovery.",
    website: "islamicguidance.com",
    facebook: "facebook.com/islamicguidance",
    twitter: "twitter.com/islamicguidance",
    youtube: "youtube.com/@islamicguidance",
    verified: true,
    language: "en",
  },
  {
    id: "ch2",
    slug: "daily-dawah",
    name: "Daily Dawah",
    handle: "@dailydawah",
    avatar: "/placeholder.svg?height=96&width=96",
    coverImage: "/vibrant-health-cover.png",
    subscribers: 780000,
    videosCount: 1200,
    description: "Daily Dawah brings you daily reminders and lectures to strengthen your faith.",
    website: "dailydawah.com",
    verified: false,
    language: "en",
  },
  {
    id: "ch3",
    slug: "merciful-servant",
    name: "Merciful Servant",
    handle: "@mercifulservant",
    avatar: "/placeholder.svg?height=96&width=96",
    coverImage: "/vibrant-health-cover.png",
    subscribers: 1800000,
    videosCount: 2100,
    description: "Merciful Servant produces high quality Islamic content to inspire and educate.",
    website: "mercifulservant.com",
    verified: true,
    language: "en",
  },
  {
    id: "ch4",
    slug: "arabic-recitation",
    name: "Arabic Recitation",
    handle: "@arabicrecitation",
    avatar: "/placeholder.svg?height=96&width=96",
    coverImage: "/vibrant-health-cover.png",
    subscribers: 950000,
    videosCount: 800,
    description: "Beautiful Quran recitations in Arabic with translations.",
    verified: true,
    language: "ar",
  },
];

export const getAllChannelIds = () => allChannels.map(ch => ch.id);