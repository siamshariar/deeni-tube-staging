// lib/channel-data.ts

export interface ChannelItem {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  banner?: string;
  language: string;
  subscribers: number;
  verified: boolean;
  description?: string;
}

export const channelData: ChannelItem[] = [
  // ===========================
  // Bengali
  // ===========================

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
      "Professor, Faculty of Shariah, Islamic University of Madinah.",
  },

  {
    id: "abdullah-jahangir",
    name: "Dr. Khandaker Abdullah Jahangir",
    slug: "abdullah-jahangir",
    avatar:
      "https://yt3.googleusercontent.com/stJnVilfKhMtBiIq_hXTu-9DnanUT0GNtmsRePmQvLAi6c7bhXoIIHGlYL0HqUrdEjrL0KFs7Q=s160-c-k-c0x00ffffff-no-rj",
    banner:
      "https://yt3.googleusercontent.com/bxD5xbDw9GH8C7YiwiHwAn36NW9eHbBIRvRR1Hge0rOlOX5Hlj96aCRH-UWnellr9j7DIvn0dqk=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
    language: "bn",
    subscribers: 1250000,
    verified: true,
    description:
      "Renowned Bangladeshi Islamic scholar and author.",
  },

  {
    id: "abu-bakar-zakariya",
    name: "Professor Dr. Abubakar Muhammad Zakaria",
    slug: "abu-bakar-zakariya",
    avatar: "https://yt3.googleusercontent.com/B5dEWmLpOG-j07FqzYJJW2snv2yep93R_AcnBx05lzn56r0CJdX8LtrEASS-FxW3r663GNzLHQ=s160-c-k-c0x00ffffff-no-rj",
    banner: "https://yt3.googleusercontent.com/_HDzgr4yiR7ZQECsrfjHQ6I_-jR0bR1IyAVnRtPuZOhXhbTbuF8d_7nlY7iRer8WGW5nEGHu=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
    language: "bn",
    subscribers: 340000,
    verified: false,
    description:
      "Professor, Department of Al-Fiqh and Legal Studies, Islamic University, Kushtia.",
  },

  {
    id: "imam-hossain",
    name: "Tafseerul Quran",
    slug: "tafseerul-quran",
    avatar: "https://yt3.googleusercontent.com/SJog0xycDSsFDAzbDqA3x2MIfNFLxMPjYrFLCltK1ZsvAPHRI_U8MvNUaEVo8NrOG3GuZUS6OA=s160-c-k-c0x00ffffff-no-rj",
    banner: "https://yt3.googleusercontent.com/OA8EucS81S9b-0KseK604MAZKxbuu-Xtmr2TaYEIyYlEdyEGNccgybFZGvwJzZUl_DPW0ss8gDE=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
    language: "bn",
    subscribers: 420000,
    verified: false,
    description:
      "Quran tafsir and Islamic lectures",
  },

  {
    id: "saifullah-madani",
    name: "Dr. Muhammad Saifullah",
    slug: "saifullah-madani",
    avatar: "https://yt3.googleusercontent.com/A5R8WWONod1kMdbHn1IYpzBELTF3y6fA12F2t-ZORFbzQqFX08Hp-sm9KLwdYheHiSLu9Ltm=s160-c-k-c0x00ffffff-no-rj",
    banner: "https://yt3.googleusercontent.com/qS993g6QRsKJflH9T5LdDK3hVfQ0NEC11Yo0KYlPCU7BnaJce1mzapL7tRrE2NiSTxwinkExbQ=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
    language: "bn",
    subscribers: 280000,
    verified: false,
    description:
      "Islamic lectures, aqeedah and fiqh.",
  },

  {
    id: "voice-of-true-tv",
    name: "Voice of True TV",
    slug: "voice-of-true-tv",
    avatar: "https://yt3.googleusercontent.com/3NX3SAB15n6cmUFhRpPc5U2LPSUsdRpOmYEKh5EicP8oofnh8LlFUCNy5DM62-XUmWnprJqG=s160-c-k-c0x00ffffff-no-rj",
    banner: "https://yt3.googleusercontent.com/Cbf_0zoGGpHHgldXkb-4XzCz09OK6XMHiBmA8F4yQa3yUMxsQshWtfnpa476fe4WMKkElgmeAA=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
    language: "bn",
    subscribers: 520000,
    verified: false,
    description:
      "Islamic lectures by Abdullah bin Abdur Razzak and Abdur Razzak Bin Yousuf.",
  },

  {
    id: "sahih-waz-tv",
    name: "Sahih Waz Tv",
    slug: "sahih-waz-tv",
    avatar: "https://yt3.googleusercontent.com/Jt6FStYvwOFIfW-OttS-7PZoEuGQ_IRrL7_CMMVadXzzEZLhuy0gf1u_fRzVrSvrNDIZoUSrMg=s160-c-k-c0x00ffffff-no-rj",
    banner: "https://yt3.googleusercontent.com/5rXHwGkuuMVZ7XGyo1QhU54Wy_43vdxfmfC-qZFEjLpbPxrKKvVCRH10vqO8AHqrnnwV8QC4mbc=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
    language: "bn",
    subscribers: 380000,
    verified: false,
    description:
      "Islamic lectures and waz by Abdur Razzak Bin Yousuf.",
  },

  // ===========================
  // English
  // ===========================

  {
    id: "zakir-naik",
    name: "Dr. Zakir Naik",
    slug: "zakir-naik",
    avatar:
      "https://yt3.googleusercontent.com/ytc/AIdro_kgWD-o3akIt5SI_BWvWHc6mHyPRm3BA5t69TAZlqQcpIF6=s160-c-k-c0x00ffffff-no-rj",
    banner:
      "https://yt3.googleusercontent.com/j_GJBu3fBsOAf_nHxAQbpjM0w0R99IUzNBei8v87uCxMoXNOfI5IxaOFPcSNhUhubgrsa1b8=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
    language: "en",
    subscribers: 3500000,
    verified: true,
    description:
      "Islamic Research Foundation.",
  },

  {
    id: "mufti-menk",
    name: "Mufti Menk",
    slug: "mufti-menk",
    avatar: "https://yt3.googleusercontent.com/ytc/AIdro_nFND09H6Vvk_P8L4djMdBusHPU8nIT6XuiRjL8M59hJsw=s160-c-k-c0x00ffffff-no-rj",
    banner: "https://yt3.googleusercontent.com/3q6pxBveK7MtJxLPMApWa83AkfqhPt_he4_IR-BX7m0XWwIQtLi_mOXArsk6Fnlulxuidu4sG-4=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
    language: "en",
    subscribers: 5200000,
    verified: true,
    description:
      "Official lectures and reminders.",
  },

  {
    id: "assim-al-hakeem",
    name: "Assim Al Hakeem",
    slug: "assim-al-hakeem",
    avatar: "https://yt3.googleusercontent.com/ytc/AIdro_nc1yIpeXxXdQ02ZRrAQr6HZU_gMrzljS5HFCRO4a95KH8=s160-c-k-c0x00ffffff-no-rj",
    banner: "https://yt3.googleusercontent.com/qplnFjRu5vKA2rvK8WuyA1bIjS-O3SZ0teV-NpDmBdxkBal4wZqXCs_gLseV2nPJ3j-NHMZ5HQ=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
    language: "en",
    subscribers: 4100000,
    verified: true,
    description:
      "Islamic fatwa and Q&A.",
  },
];