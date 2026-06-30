// lib/scholar-data.ts

export interface ScholarItem {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  designation: string;
  language: string;
  channelId: string;
  description?: string;
}

export const scholarData: ScholarItem[] = [
  // Bengali Scholars
  {
    id: "monzur",
    name: "Dr. Mohammad Monzur-E-Elahi",
    slug: "monzur",
    avatar: "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj",
    designation: "Professor, Faculty of Shariah, Islamic University of Madinah",
    language: "bn",
    channelId: "monzur",
    description: "Renowned Islamic scholar and professor at the Islamic University of Madinah."
  },
  {
    id: "abdullah-jahangir",
    name: "Dr. Khandaker Abdullah Jahangir",
    slug: "abdullah-jahangir",
    avatar: "https://yt3.googleusercontent.com/stJnVilfKhMtBiIq_hXTu-9DnanUT0GNtmsRePmQvLAi6c7bhXoIIHGlYL0HqUrdEjrL0KFs7Q=s160-c-k-c0x00ffffff-no-rj",
    designation: "Islamic Scholar, Founder of SunnahTrust",
    language: "bn",
    channelId: "abdullah-jahangir",
    description: "Prominent Bangladeshi Islamic scholar and author."
  },
  {
    id: "abu-bakar-zakariya",
    name: "Professor Dr. Abubakar Muhammad Zakaria",
    slug: "abu-bakar-zakariya",
    avatar: "https://yt3.googleusercontent.com/B5dEWmLpOG-j07FqzYJJW2snv2yep93R_AcnBx05lzn56r0CJdX8LtrEASS-FxW3r663GNzLHQ=s160-c-k-c0x00ffffff-no-rj",
    designation: "Professor, Department of Al-Fiqh and Legal Studies, Islamic University, Kushtia",
    language: "bn",
    channelId: "abu-bakar-zakariya",
    description: "Professor of Fiqh and Law at Islamic University, Kushtia. Specialist in Islamic jurisprudence and legal studies."
  },
  {
    id: "tafseerul-quran",
    name: "Tafseerul Quran",
    slug: "tafseerul-quran",
    avatar: "https://yt3.googleusercontent.com/SJog0xycDSsFDAzbDqA3x2MIfNFLxMPjYrFLCltK1ZsvAPHRI_U8MvNUaEVo8NrOG3GuZUS6OA=s160-c-k-c0x00ffffff-no-rj",
    designation: "Quranic Tafsir and Islamic Lectures",
    language: "bn",
    channelId: "tafseerul-quran",
    description:
      "Quran tafsir and Islamic lectures"
  },
  {
    id: "saifullah-madani",
    name: "Dr. Muhammad Saifullah",
    slug: "saifullah-madani",
    avatar: "https://yt3.googleusercontent.com/A5R8WWONod1kMdbHn1IYpzBELTF3y6fA12F2t-ZORFbzQqFX08Hp-sm9KLwdYheHiSLu9Ltm=s160-c-k-c0x00ffffff-no-rj",
    designation: "Islamic Scholar & Lecturer",
    language: "bn",
    channelId: "saifullah-madani",
    description: "Islamic scholar specializing in aqeedah and fiqh."
  },

  // English Scholars
  {
    id: "zakir-naik",
    name: "Dr. Zakir Naik",
    slug: "zakir-naik",
    avatar: "https://yt3.googleusercontent.com/ytc/AIdro_kgWD-o3akIt5SI_BWvWHc6mHyPRm3BA5t69TAZlqQcpIF6=s160-c-k-c0x00ffffff-no-rj",
    designation: "Islamic Preacher, Founder of Islamic Research Foundation",
    language: "en",
    channelId: "zakir-naik",
    description: "World-renowned Islamic orator and comparative religion expert."
  },
  {
    id: "mufti-menk",
    name: "Mufti Menk",
    slug: "mufti-menk",
    avatar: "https://yt3.googleusercontent.com/ytc/AIdro_nFND09H6Vvk_P8L4djMdBusHPU8nIT6XuiRjL8M59hJsw=s160-c-k-c0x00ffffff-no-rj",
    designation: "Grand Mufti of Zimbabwe",
    language: "en",
    channelId: "mufti-menk",
    description: "Beloved Islamic scholar and motivational speaker from Zimbabwe."
  },
  {
    id: "assim-al-hakeem",
    name: "Sheikh Assim Al Hakeem",
    slug: "assim-al-hakeem",
    avatar: "https://yt3.googleusercontent.com/ytc/AIdro_nc1yIpeXxXdQ02ZRrAQr6HZU_gMrzljS5HFCRO4a95KH8=s160-c-k-c0x00ffffff-no-rj",
    designation: "Islamic Scholar & Fatwa Authority",
    language: "en",
    channelId: "assim-al-hakeem",
    description: "Saudi-based Islamic scholar known for clear fatwas and Q&A sessions."
  },
];