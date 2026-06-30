// lib/video-data.ts
export interface VideoItem {
  id: string;
  videoId: string;
  title: string;
  channel: string;
  channelId: string;
  channelAvatar: string;
  duration: string;
  views: string;
  timeAgo: string;
  description: string;
  language: string;
  category: string;
}

const MONZUR_AVATAR =
  "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj";
const ABDULLAH_AVATAR =
  "https://yt3.googleusercontent.com/stJnVilfKhMtBiIq_hXTu-9DnanUT0GNtmsRePmQvLAi6c7bhXoIIHGlYL0HqUrdEjrL0KFs7Q=s160-c-k-c0x00ffffff-no-rj";
const ZAKARIA_AVATAR =
  "https://yt3.googleusercontent.com/B5dEWmLpOG-j07FqzYJJW2snv2yep93R_AcnBx05lzn56r0CJdX8LtrEASS-FxW3r663GNzLHQ=s160-c-k-c0x00ffffff-no-rj";
const IMAM_HOSSAIN_AVATAR = "/placeholder.svg?height=48&width=48";
const SAIFULLAH_AVATAR =
  "https://yt3.googleusercontent.com/A5R8WWONod1kMdbHn1IYpzBELTF3y6fA12F2t-ZORFbzQqFX08Hp-sm9KLwdYheHiSLu9Ltm=s160-c-k-c0x00ffffff-no-rj";
const VOICE_OF_TRUE_AVATAR =
  "https://yt3.googleusercontent.com/3NX3SAB15n6cmUFhRpPc5U2LPSUsdRpOmYEKh5EicP8oofnh8LlFUCNy5DM62-XUmWnprJqG=s160-c-k-c0x00ffffff-no-rj";
const SAHIH_WAZ_AVATAR =
  "https://yt3.googleusercontent.com/Jt6FStYvwOFIfW-OttS-7PZoEuGQ_IRrL7_CMMVadXzzEZLhuy0gf1u_fRzVrSvrNDIZoUSrMg=s160-c-k-c0x00ffffff-no-rj";
const TAFSEERUL_QURAN_AVATAR =
  "https://yt3.googleusercontent.com/SJog0xycDSsFDAzbDqA3x2MIfNFLxMPjYrFLCltK1ZsvAPHRI_U8MvNUaEVo8NrOG3GuZUS6OA=s160-c-k-c0x00ffffff-no-rj";
const ZAKIR_AVATAR =
  "https://yt3.googleusercontent.com/ytc/AIdro_kgWD-o3akIt5SI_BWvWHc6mHyPRm3BA5t69TAZlqQcpIF6=s160-c-k-c0x00ffffff-no-rj";
const MUFTI_MENK_AVATAR =
  "https://yt3.googleusercontent.com/ytc/AIdro_nFND09H6Vvk_P8L4djMdBusHPU8nIT6XuiRjL8M59hJsw=s160-c-k-c0x00ffffff-no-rj";
const ASSIM_AVATAR =
  "https://yt3.googleusercontent.com/ytc/AIdro_nc1yIpeXxXdQ02ZRrAQr6HZU_gMrzljS5HFCRO4a95KH8=s160-c-k-c0x00ffffff-no-rj";

export const videoData: VideoItem[] = [
  // ===========================
  // Monzur-E-Elahi
  // ===========================
  {
    id: "v1",
    videoId: "XVscS6piz9A",
    title: "Islamic Halaka : শেষ জামানার ফিতনা ।। Prof. Dr. Mohammad Monzur-E-Elahi",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: MONZUR_AVATAR,
    duration: "18:44",
    views: "2.3M views",
    timeAgo: "6 months ago",
    description: "প্রফেসর ড. মোহাম্মদ মানজুরে ইলাহী\nপিএইচডি, শারী'আহ অনুষদ, মদীনা ইসলামী বিশ্ববিদ্যালয়",
    language: "bn",
    category: "Islamic Lecture",
  },
  {
    id: "v2",
    videoId: "UugARckPloo",
    title: "তরুণদের জন্য কুরআন-সুন্নাহ নির্দেশনা (পর্ব-১) ।। Prof. Dr. Mohammad Monzur-E-Elahi",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: MONZUR_AVATAR,
    duration: "25:10",
    views: "1.8M views",
    timeAgo: "3 months ago",
    description: "প্রফেসর ড. মোহাম্মদ মানজুরে ইলাহী\nপিএইচডি, শারী'আহ অনুষদ, মদীনা ইসলামী বিশ্ববিদ্যালয়",
    language: "bn",
    category: "Islamic Lecture",
  },
  {
    id: "v3",
    videoId: "gZ3C_UO_tZM",
    title: "প্রকৃত ঈমানদার ও তাকওয়াবান ব্যক্তির গুণাবলি ।। Prof. Dr. Mohammad Monzur-E-Elahi",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: MONZUR_AVATAR,
    duration: "32:45",
    views: "1.2M views",
    timeAgo: "2 weeks ago",
    description: "প্রফেসর ড. মোহাম্মদ মানজুরে ইলাহী\nপিএইচডি, শারী'আহ অনুষদ, মদীনা ইসলামী বিশ্ববিদ্যালয়",
    language: "bn",
    category: "Islamic Lecture",
  },
  {
    id: "v4",
    videoId: "rPEGK8WV1v4",
    title: "১৩৫. ইলম অর্জনে তারুণ্যের প্রতি কুরআন-সুন্নাহর দিক-নির্দেশনা।। Dr. Mohammad Monzur-E-Elahi",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: MONZUR_AVATAR,
    duration: "28:55",
    views: "950K views",
    timeAgo: "1 month ago",
    description: "প্রফেসর ড. মোহাম্মদ মানজুরে ইলাহী\nপিএইচডি, শারী'আহ অনুষদ, মদীনা ইসলামী বিশ্ববিদ্যালয়",
    language: "bn",
    category: "Quran",
  },
  {
    id: "v5",
    videoId: "EtlK09Ikq4o",
    title: "জুমু'আর খুতবাহ : কুরআন মুখী জীবন ।। Dr. Mohammad Monzur-E-Elahi",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: MONZUR_AVATAR,
    duration: "20:18",
    views: "1.5M views",
    timeAgo: "4 months ago",
    description: "স্থান : মাসজিদ আত তাওহীদ ও ইসলামী কমপ্লেক্স খুতবাহ\nতারিখ : ১৯ এপ্রিল ২০২৪\n\nড. মোহাম্মদ মানজুরে ইলাহী\nপিএইচডি, শারী'আহ অনুষদ, মদীনা ইসলামী বিশ্ববিদ্যালয়",
    language: "bn",
    category: "Quran",
  },

  // ===========================
  // Abdullah Jahangir
  // ===========================
  {
    id: "v6",
    videoId: "908GzCFuysY",
    title: "জীবন ঘনিষ্ঠ গুরুত্বপূর্ণ কিছু প্রশ্নোত্তর│Question & Answer│Dr. Khondokar Abdullah Jahangir",
    channel: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelId: "abdullah-jahangir",
    channelAvatar: ABDULLAH_AVATAR,
    duration: "45:12",
    views: "3.1M views",
    timeAgo: "1 year ago",
    description: "জীবন ঘনিষ্ঠ গুরুত্বপূর্ণ কিছু ইসলামিক প্রশ্নোত্তর। Islamic Question & Answer (Full Video) by Dr. Khondokar Abdullah Jahangir.",
    language: "bn",
    category: "Islamic Lecture",
  },
  {
    id: "v7",
    videoId: "bUNorIRvpaY",
    title: "Biography of Prophet (S.) Dr.Khandaker Abdullah Jahangir (Rh.)",
    channel: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelId: "abdullah-jahangir",
    channelAvatar: ABDULLAH_AVATAR,
    duration: "55:30",
    views: "2.4M views",
    timeAgo: "2 years ago",
    description: "ড.খন্দকার আব্দুল্লাহ জাহাঙ্গীর (রহ.)।",
    language: "bn",
    category: "Seerah",
  },
  {
    id: "v8",
    videoId: "rtVnA9EA0xg",
    title: "আত্মার তৃপ্তি কোথায়? | Dr. Abdullah Jahangir R. | অন্তরের প্রকৃত শান্তি পাওয়ার উপায়",
    channel: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelId: "abdullah-jahangir",
    channelAvatar: ABDULLAH_AVATAR,
    duration: "40:05",
    views: "1.9M views",
    timeAgo: "8 months ago",
    description: "ড. আব্দুল্লাহ জাহাঙ্গীর (রাহিমাহুল্লাহ) এই ভিডিওতে কুরআন ও সুন্নাহর আলোকে আলোচনা করেছেন।",
    language: "bn",
    category: "Spirituality",
  },
  {
    id: "v9",
    videoId: "kVbpcXFFeWQ",
    title: "এত সুন্দর করে আর কে বুঝাবে || খন্দকার আবদুল্লাহ জাহাঙ্গীর",
    channel: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelId: "abdullah-jahangir",
    channelAvatar: ABDULLAH_AVATAR,
    duration: "22:15",
    views: "1.3M views",
    timeAgo: "5 months ago",
    description: "হৃদয়স্পর্শী লেকচার || এত সুন্দর করে আর কে বুঝাবে || খন্দকার আবদুল্লাহ জাহাঙ্গীর",
    language: "bn",
    category: "Dua",
  },
  {
    id: "v10",
    videoId: "9K_wuVawflg",
    title: "আখিরাতের চিন্তা এবং আব্দুল কাদের জিলানী রহমতুল্লাহি আলাইহির জীবনী",
    channel: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelId: "abdullah-jahangir",
    channelAvatar: ABDULLAH_AVATAR,
    duration: "35:48",
    views: "2.7M views",
    timeAgo: "10 months ago",
    description: "আখিরাতের চিন্তা এবং আব্দুল কাদের জিলানী রহমতুল্লাহি আলাইহির জীবনী। Amazing Islamic Lecture by Dr. Khondokar Abdullah Jahangir.",
    language: "bn",
    category: "Dua",
  },

  // ===========================
  // Abu Bakar Zakaria
  // ===========================
  {
    id: "v17",
    videoId: "V6Xf8tkxNYQ",
    title: "আল্লাহ আমাদের সাথে আছেন!কিভাবে? প্রফেসর ড. আবু বকর মুহাম্মাদ যাকারিয়া",
    channel: "Professor Dr. Abubakar Muhammad Zakaria",
    channelId: "abu-bakar-zakariya",
    channelAvatar: ZAKARIA_AVATAR,
    duration: "15:30",
    views: "180K views",
    timeAgo: "1 month ago",
    description: "প্রশ্নঃ আল্লাহ আমাদের সাথে আছেন!কিভাবে?\nপ্রফেসর ড. আবু বকর মুহাম্মাদ যাকারিয়া\nProfessor Dr. Abubakar Muhammad Zakaria\nProfessor\nDepartment of Al-Fiqh and LAW\nIslamic University, Kushtia",
    language: "bn",
    category: "Islamic Lecture",
  },
  {
    id: "v18",
    videoId: "vQl8Ln2Ueps",
    title: "মদীনা থেকে দারস বিষয় : ঈমান কিভাবে প্রচার-প্রসার করা যায়?",
    channel: "Professor Dr. Abubakar Muhammad Zakaria",
    channelId: "abu-bakar-zakariya",
    channelAvatar: ZAKARIA_AVATAR,
    duration: "22:10",
    views: "120K views",
    timeAgo: "2 weeks ago",
    description: "মদীনা থেকে দারস\nবিষয় : ঈমান কিভাবে প্রচার-প্রসার করা যায়?\nআলোচক: প্রফেসর ড. আবু বকর মুহাম্মাদ যাকারিয়া",
    language: "bn",
    category: "Dawah",
  },
  {
    id: "v19",
    videoId: "5sRITzSR7mU",
    title: 'সাপ্তাহিক দারস "আখলাক" (পর্ব-৪১)বিষয় : আল্লাহর জন্য ভালোবাসা কিভাবে?',
    channel: "Professor Dr. Abubakar Muhammad Zakaria",
    channelId: "abu-bakar-zakariya",
    channelAvatar: ZAKARIA_AVATAR,
    duration: "28:45",
    views: "95K views",
    timeAgo: "3 weeks ago",
    description: 'সাপ্তাহিক দারস\n"আখলাক" (পর্ব-৪১)\nবিষয় : আল্লাহর জন্য ভালোবাসা কিভাবে?\nপ্রফেসর ড. আবু বকর মুহাম্মাদ যাকারিয়া',
    language: "bn",
    category: "Spirituality",
  },
  {
    id: "v20",
    videoId: "4lIDcKgKv6E",
    title: "আল্লাহর কাছে সরাসরি চাইবো, নাকি বলবো — যদি এতে মঙ্গল থাকে তাহলে দাও?",
    channel: "Professor Dr. Abubakar Muhammad Zakaria",
    channelId: "abu-bakar-zakariya",
    channelAvatar: ZAKARIA_AVATAR,
    duration: "18:20",
    views: "210K views",
    timeAgo: "2 months ago",
    description: "প্রশ্ন : আল্লাহর কাছে সরাসরি চাইবো, নাকি বলবো — যদি এতে মঙ্গল থাকে তাহলে দাও?\nপ্রফেসর ড. আবু বকর মুহাম্মাদ যাকারিয়া\nProfessor\nDepartment of Al-Fiqh and Legal Studies\nIslamic University, Kushtia",
    language: "bn",
    category: "Dua",
  },

  // ===========================
  // Imam Hossain
  // ===========================
  {
    id: "v21",
    videoId: "Ivlnd39NH1w",
    title: "আল্লাহ রাব্বুল আলামিনের তাওহীদ || হালাকাহ || Dr. Mohammad Imam Hossain",
    channel: "Dr. Mohammad Imam Hossain",
    channelId: "imam-hossain",
    channelAvatar: IMAM_HOSSAIN_AVATAR,
    duration: "35:15",
    views: "280K views",
    timeAgo: "1 month ago",
    description: "এই আলোচনায় ঈমান ভঙ্গের ১০টি মৌলিক কারণ এবং এ সংক্রান্ত বিভিন্ন ভ্রান্ত আকিদা বিশ্লেষণ করা হয়েছে।",
    language: "bn",
    category: "Aqeedah",
  },
  {
    id: "v22",
    videoId: "AMfzv5VrYEE",
    title: "কিছু গুরুত্বপূর্ণ ফতোয়া ।। বইঃ দারসুল আম ।। Dr. Mohammad Imam Hossain",
    channel: "Dr. Mohammad Imam Hossain",
    channelId: "imam-hossain",
    channelAvatar: IMAM_HOSSAIN_AVATAR,
    duration: "42:30",
    views: "195K views",
    timeAgo: "3 months ago",
    description: "সৌদি আরবের প্রখ্যাত আলেমে দ্বীন শায়েখগণ-এর ফতোয়া সংকলিত আদ-দুরুসুল আম কিতাব থেকে দারস।",
    language: "bn",
    category: "Fiqh",
  },

  // ===========================
  // Muhammad Saifullah
  // ===========================
  {
    id: "v23",
    videoId: "9J-MKO4VC58",
    title: "তাকওয়া আলোকে জীবন।। পর্বঃ ০১।। ড. মুহাম্মাদ সাইফুল্লাহ।",
    channel: "Dr. Muhammad Saifullah",
    channelId: "saifullah-madani",
    channelAvatar: SAIFULLAH_AVATAR,
    duration: "30:20",
    views: "165K views",
    timeAgo: "2 months ago",
    description: "#তাকওয়া_আলোকে_জীবন।। পর্বঃ ০১।। ড. মুহাম্মাদ সাইফুল্লাহ।",
    language: "bn",
    category: "Spirituality",
  },
  {
    id: "v24",
    videoId: "s_Q-FHD-28I",
    title: "সুন্নাহর পরিচয়, সঙ্কলন ও ইতিহাস। ড. মুহাম্মাদ সাইফুল্লাহ",
    channel: "Dr. Muhammad Saifullah",
    channelId: "saifullah-madani",
    channelAvatar: SAIFULLAH_AVATAR,
    duration: "38:10",
    views: "230K views",
    timeAgo: "1 month ago",
    description: "সুন্নাহর পরিচয়, সঙ্কলন ও ইতিহাস\nড. মুহাম্মাদ সাইফুল্লাহ\nহাদিস সঙ্কলন কখন শুরু হয়? রাসূলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়াসাল্লামের সময়ে নাকি আরও অনেক বছর পর?",
    language: "bn",
    category: "Hadith",
  },

  // ===========================
  // Voice of True TV
  // ===========================
  {
    id: "v25",
    videoId: "aekOD1a18Tc",
    title: "অন্তর কীভাবে নিয়ন্ত্রণ করবেন—গোপন টিপস দিলেন│Abdullah bin Abdur Razzak",
    channel: "Voice of True TV",
    channelId: "voice-of-true-tv",
    channelAvatar: VOICE_OF_TRUE_AVATAR,
    duration: "40:55",
    views: "890K views",
    timeAgo: "3 weeks ago",
    description: "abdullah bin abdur razzak new waz",
    language: "bn",
    category: "Islamic Lecture",
  },
  {
    id: "v26",
    videoId: "epe9qYmCOGw",
    title: "বড় সফল ব্যাক্তি হবেন কিভাবে | abdullah bin abdur razzak new waz",
    channel: "Voice of True TV",
    channelId: "voice-of-true-tv",
    channelAvatar: VOICE_OF_TRUE_AVATAR,
    duration: "45:00",
    views: "1.2M views",
    timeAgo: "1 month ago",
    description: "আব্দুল্লাহ বিন আব্দুর রাযযাক, নতুন ওয়াজ",
    language: "bn",
    category: "Islamic Lecture",
  },

  // ===========================
  // Sahih Waz Tv
  // ===========================
  {
    id: "v27",
    videoId: "3yz2VUh0e4I",
    title: "শায়েখের পাঁচ উপদেশ | শায়খ আব্দুর রাজ্জাক বিন ইউসুফ | Abdur Razzak Bin Yousuf",
    channel: "Sahih Waz Tv",
    channelId: "sahih-waz-tv",
    channelAvatar: SAHIH_WAZ_AVATAR,
    duration: "25:30",
    views: "450K views",
    timeAgo: "2 weeks ago",
    description: "শায়খ আব্দুর রাজ্জাক বিন ইউসুফ",
    language: "bn",
    category: "Islamic Lecture",
  },
  {
    id: "v28",
    videoId: "okp0y6yBqVg",
    title: "যতই ইবাদাত করেন যে ভুলের কারণে কোন ইবাদাত কবুল হচ্ছে না│Abdur Razzak Bin Yousuf",
    channel: "Sahih Waz Tv",
    channelId: "sahih-waz-tv",
    channelAvatar: SAHIH_WAZ_AVATAR,
    duration: "50:15",
    views: "780K views",
    timeAgo: "1 month ago",
    description: "abdur razzak bin yousuf waz",
    language: "bn",
    category: "Islamic Lecture",
  },
  {
    id: "v29",
    videoId: "LKkKTrrWlr0",
    title: "বিপদে যে ভাবে দোয়া করলে আল্লাহ তাড়াতাড়ি শুনবে│Abdur Razzak Bin Yousuf Waz",
    channel: "Sahih Waz Tv",
    channelId: "sahih-waz-tv",
    channelAvatar: SAHIH_WAZ_AVATAR,
    duration: "35:40",
    views: "620K views",
    timeAgo: "3 weeks ago",
    description: "abdur razzak bin yousuf new waz 2026",
    language: "bn",
    category: "Dua",
  },

  // ===========================
  // Zakir Naik
  // ===========================
  {
    id: "v11",
    videoId: "XNojvAddjL8",
    title: "How to Enter Paradise in the Eyes of Islam – Talk by Dr Zakir Naik",
    channel: "Dr. Zakir Naik",
    channelId: "zakir-naik",
    channelAvatar: ZAKIR_AVATAR,
    duration: "2:30:15",
    views: "1.5M views",
    timeAgo: "2 weeks ago",
    description: "How to Enter Paradise in the Eyes of Islam\nTalk by Dr Zakir Naik\nAt Hotel Royal Chulan Ballroom, Kuala Lumpur, Malaysia.\n20th June 2026",
    language: "en",
    category: "Islamic Lecture",
  },
  {
    id: "v12",
    videoId: "72-todksmcs",
    title: "Muslim's Power is in Unity and Closeness to Allah - Dr Zakir Naik",
    channel: "Dr. Zakir Naik",
    channelId: "zakir-naik",
    channelAvatar: ZAKIR_AVATAR,
    duration: "1:45:30",
    views: "980K views",
    timeAgo: "1 month ago",
    description: "Muslim's Power is in Unity and Closeness to Allah - Dr Zakir Naik",
    language: "en",
    category: "Dawah",
  },
  {
    id: "v13",
    videoId: "ZD6p-op93EI",
    title: "Overwhelmingly Intellectual Answers to an Atheist by Dr Zakir Naik",
    channel: "Dr. Zakir Naik",
    channelId: "zakir-naik",
    channelAvatar: ZAKIR_AVATAR,
    duration: "2:10:45",
    views: "2.3M views",
    timeAgo: "3 weeks ago",
    description: "Dr Zakir Naik Convincingly Answered all Intellectual Questions posed by an Atheist\nLecture Name: Ask Dr Zakir (Dubai - Part 1)",
    language: "en",
    category: "Dawah",
  },
  {
    id: "v14",
    videoId: "wli20ZZztF4",
    title: "খ্রিস্টান শিক্ষক VS ডাঃ জাকির নায়েক - কে জিতবে এই তর্কে! | DR ZAKIR NAIK | বাংলা লেকচার",
    channel: "Dr. Zakir Naik",
    channelId: "zakir-naik",
    channelAvatar: ZAKIR_AVATAR,
    duration: "1:20:10",
    views: "1.1M views",
    timeAgo: "5 months ago",
    description: "খ্রিস্টান শিক্ষক VS ডাঃ জাকির নায়েক - কে জিতবে এই তর্কে!",
    language: "bn",
    category: "Dawah",
  },
  {
    id: "v15",
    videoId: "7NMRiv2IqPw",
    title: "আমাদের জীবনের উদ্দেশ্য কি? Dr. Zakir Naik What is the Purpose of Our Life? New Bangla Lecture 2018",
    channel: "Dr. Zakir Naik",
    channelId: "zakir-naik",
    channelAvatar: ZAKIR_AVATAR,
    duration: "2:05:00",
    views: "780K views",
    timeAgo: "1 year ago",
    description: "আমাদের জীবনের উদ্দেশ্য কি?\nDr. Zakir Naik\n(পর্ব ১-৬)\nসম্পূর্ণ লেকচার",
    language: "bn",
    category: "Aqeedah",
  },
  {
    id: "v16",
    videoId: "Nc4Iid3pSa8",
    title: "Historical International Lecture Dr Zakir Naik Bangla",
    channel: "Dr. Zakir Naik",
    channelId: "zakir-naik",
    channelAvatar: ZAKIR_AVATAR,
    duration: "1:55:30",
    views: "1.3M views",
    timeAgo: "2 months ago",
    description: "Historical International Lecture Dr Zakir Naik Bangla",
    language: "bn",
    category: "Comparative Religion",
  },

  // ===========================
  // Mufti Menk
  // ===========================
  {
    id: "v30",
    videoId: "kBqcuemalG8",
    title: "What Can You Sacrifice? - Dhull-Hijjah | Mufti Menk",
    channel: "Mufti Menk",
    channelId: "mufti-menk",
    channelAvatar: MUFTI_MENK_AVATAR,
    duration: "28:15",
    views: "1.8M views",
    timeAgo: "3 months ago",
    description: "All Official Links from the Mufti Menk Channel can be found here:\nhttps://muftimenk.com",
    language: "en",
    category: "Islamic Lecture",
  },
  {
    id: "v31",
    videoId: "T9oT-oOaTNU",
    title: "NEW | Asking Allah For Something You Want - Motivational Evening - Mufti Menk",
    channel: "Mufti Menk",
    channelId: "mufti-menk",
    channelAvatar: MUFTI_MENK_AVATAR,
    duration: "35:40",
    views: "2.1M views",
    timeAgo: "1 month ago",
    description: "Delivered in London, August 2023",
    language: "en",
    category: "Dua",
  },
  {
    id: "v32",
    videoId: "r_4UK9cj4eA",
    title: "NEW | How to ask Allah | Mufti Menk | London Excel - Light Upon Light",
    channel: "Mufti Menk",
    channelId: "mufti-menk",
    channelAvatar: MUFTI_MENK_AVATAR,
    duration: "42:20",
    views: "1.5M views",
    timeAgo: "2 months ago",
    description: "All Official Links from the Mufti Menk Channel can be found here:",
    language: "en",
    category: "Dua",
  },
  {
    id: "v33",
    videoId: "Fsy2AQYlvS8",
    title: "How Hardship Comes With Ease! | Mufti Menk | London - Excel 02",
    channel: "Mufti Menk",
    channelId: "mufti-menk",
    channelAvatar: MUFTI_MENK_AVATAR,
    duration: "30:10",
    views: "980K views",
    timeAgo: "4 months ago",
    description: "All Official Links from the Mufti Menk Channel can be found here:",
    language: "en",
    category: "Spirituality",
  },

  // ===========================
  // Assim Al Hakeem
  // ===========================
  {
    id: "v34",
    videoId: "J0Zb0pEUjvY",
    title: "The Untold Journey Of Sheikh Assim Al Hakeem From English teacher to global Da'ee || assim al hakeem",
    channel: "Assim Al Hakeem",
    channelId: "assim-al-hakeem",
    channelAvatar: ASSIM_AVATAR,
    duration: "55:30",
    views: "680K views",
    timeAgo: "1 month ago",
    description: "Sheikh Assim Al Hakeem",
    language: "en",
    category: "Seerah",
  },
  {
    id: "v35",
    videoId: "NBG2AJMCdGg",
    title: "Islamic bank charges fees - can I use a current account in a conventional bank? || assim al hakeem",
    channel: "Assim Al Hakeem",
    channelId: "assim-al-hakeem",
    channelAvatar: ASSIM_AVATAR,
    duration: "12:45",
    views: "450K views",
    timeAgo: "2 weeks ago",
    description: "assim al hakeem",
    language: "en",
    category: "Fiqh",
  },
];

// Derived: all unique categories with video counts
export const categoryData = Array.from(
  new Set(videoData.map((v) => v.category))
)
  .filter(Boolean)
  .map((name) => ({
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    description: getCategoryDescription(name),
    videoCount: videoData.filter((v) => v.category === name).length,
    languages: Array.from(
      new Set(videoData.filter((v) => v.category === name).map((v) => v.language))
    ),
  }));

function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    "Islamic Lecture": "General Islamic lectures from trusted scholars covering various topics",
    "Quran": "Lectures focused on Quranic teachings, tafsir, and recitation guidance",
    "Seerah": "Learn about the life and teachings of Prophet Muhammad (peace be upon him)",
    "Dua": "Powerful supplications and their meanings from authentic sources",
    "Spirituality": "Nurture your soul with lectures on spiritual growth and self-purification",
    "Dawah": "Lectures on sharing Islam with wisdom and answering common questions",
    "Aqeedah": "Understanding the core beliefs and creed of Islam",
    "Comparative Religion": "Exploring Islam in comparison with other faiths and worldviews",
    "Fiqh": "Islamic jurisprudence and legal rulings",
    "Hadith": "Study of prophetic traditions and their sciences",
  };
  return descriptions[category] || `Authentic Islamic content on ${category}`;
}