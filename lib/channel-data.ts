export interface ChannelItem {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  banner?: string; // new field for banner image
  language: string;
  subscribers: number;
  verified: boolean;
  description?: string;
}

export const channelData: ChannelItem[] = [
  {
    id: "monzur",
    name: "Dr. Mohammad Monzur-E-Elahi",
    slug: "monzur",
    avatar:
      "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj",
    banner:
      "https://yt3.googleusercontent.com/M8O-NSSAWuXxpzw8JgsXboRPjnOBtnrbM_9HDFPxB3inoIqcoin0abD1kuXYZqhRInO2ZHy3aQ=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
    language: "bn",
    subscribers: 780000,
    verified: true,
    description:
      "Professor Dr. Mohammad Monzur-E-Elahi, PhD, Faculty of Shariah, Islamic University of Madinah",
  },
  {
    id: "abdullah",
    name: "Dr. Khandaker Abdullah Jahangir Rh.",
    slug: "abdullah",
    avatar:
      "https://yt3.googleusercontent.com/stJnVilfKhMtBiIq_hXTu-9DnanUT0GNtmsRePmQvLAi6c7bhXoIIHGlYL0HqUrdEjrL0KFs7Q=s160-c-k-c0x00ffffff-no-rj",
    banner:
      "https://yt3.googleusercontent.com/bxD5xbDw9GH8C7YiwiHwAn36NW9eHbBIRvRR1Hge0rOlOX5Hlj96aCRH-UWnellr9j7DIvn0dqk=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
    language: "bn",
    subscribers: 1250000,
    verified: true,
    description:
      "Renowned Islamic scholar Dr. Khandaker Abdullah Jahangir (Rahimahullah)",
  },
];