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
const ZAKIR_AVATAR =
  "https://yt3.googleusercontent.com/ytc/AIdro_kgWD-o3akIt5SI_BWvWHc6mHyPRm3BA5t69TAZlqQcpIF6=s176-c-k-c0x00ffffff-no-rj-mo";

export const videoData: VideoItem[] = [
  // Monzur-E-Elahi
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
    description:
      "প্রফেসর ড. মোহাম্মদ মানজুরে ইলাহী\nপিএইচডি, শারী'আহ অনুষদ, মদীনা ইসলামী বিশ্ববিদ্যালয়",
    language: "bn",
    category: "Islamic Lecture",
  },
  {
    id: "v2",
    videoId: "UugARckPloo",
    title:
      "তরুণদের জন্য কুরআন-সুন্নাহ নির্দেশনা (পর্ব-১) ।। Prof. Dr. Mohammad Monzur-E-Elahi",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: MONZUR_AVATAR,
    duration: "25:10",
    views: "1.8M views",
    timeAgo: "3 months ago",
    description:
      "প্রফেসর ড. মোহাম্মদ মানজুরে ইলাহী\nপিএইচডি, শারী'আহ অনুষদ, মদীনা ইসলামী বিশ্ববিদ্যালয়",
    language: "bn",
    category: "Islamic Lecture",
  },
  {
    id: "v3",
    videoId: "gZ3C_UO_tZM",
    title:
      "প্রকৃত ঈমানদার ও তাকওয়াবান ব্যক্তির গুণাবলি ।। Prof. Dr. Mohammad Monzur-E-Elahi",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: MONZUR_AVATAR,
    duration: "32:45",
    views: "1.2M views",
    timeAgo: "2 weeks ago",
    description:
      "প্রফেসর ড. মোহাম্মদ মানজুরে ইলাহী\nপিএইচডি, শারী'আহ অনুষদ, মদীনা ইসলামী বিশ্ববিদ্যালয়",
    language: "bn",
    category: "Islamic Lecture",
  },
  {
    id: "v4",
    videoId: "rPEGK8WV1v4",
    title:
      "১৩৫. ইলম অর্জনে তারুণ্যের প্রতি কুরআন-সুন্নাহর দিক-নির্দেশনা।। Dr. Mohammad Monzur-E-Elahi",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: MONZUR_AVATAR,
    duration: "28:55",
    views: "950K views",
    timeAgo: "1 month ago",
    description:
      "প্রফেসর ড. মোহাম্মদ মানজুরে ইলাহী\nপিএইচডি, শারী'আহ অনুষদ, মদীনা ইসলামী বিশ্ববিদ্যালয়",
    language: "bn",
    category: "Islamic Lecture",
  },
  {
    id: "v5",
    videoId: "EtlK09Ikq4o",
    title:
      "জুমু'আর খুতবাহ : কুরআন মুখী জীবন ।। Dr. Mohammad Monzur-E-Elahi",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: MONZUR_AVATAR,
    duration: "20:18",
    views: "1.5M views",
    timeAgo: "4 months ago",
    description:
      "স্থান : মাসজিদ আত তাওহীদ ও ইসলামী কমপ্লেক্স খুতবাহ\nতারিখ : ১৯ এপ্রিল ২০২৪\n\nড. মোহাম্মদ মানজুরে ইলাহী\nপিএইচডি, শারী'আহ অনুষদ, মদীনা ইসলামী বিশ্ববিদ্যালয়",
    language: "bn",
    category: "Islamic Lecture",
  },

  // Abdullah Jahangir
  {
    id: "v6",
    videoId: "908GzCFuysY",
    title:
      "জীবন ঘনিষ্ঠ গুরুত্বপূর্ণ কিছু প্রশ্নোত্তর│Question & Answer│Dr. Khondokar Abdullah Jahangir",
    channel: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelId: "abdullah",
    channelAvatar: ABDULLAH_AVATAR,
    duration: "45:12",
    views: "3.1M views",
    timeAgo: "1 year ago",
    description:
      "জীবন ঘনিষ্ঠ গুরুত্বপূর্ণ কিছু ইসলামিক প্রশ্নোত্তর। Islamic Question & Answer (Full Video) by Dr. Khondokar Abdullah Jahangir. বর্তমান সময়ের উপযোগী ডঃ খন্দকার আব্দুল্লাহ জাহাঙ্গীর (রহিমাহুল্লাহ) এর অতীব গুরুত্বপূর্ণ এবং তথ্যবহুল এই প্রশ্নোত্তরগুলি প্রতিটি মুসলিম নারী পুরুষকে অবশ্যই জেনে রাখা উচিৎ।",
    language: "bn",
    category: "Islamic Lecture",
  },
  {
    id: "v7",
    videoId: "bUNorIRvpaY",
    title:
      "Biography of Prophet (S.) Dr.Khandaker Abdullah Jahangir (Rh.) ড.খন্দকার আব্দুল্লাহ জাহাঙ্গীর (রহ.)।",
    channel: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelId: "abdullah",
    channelAvatar: ABDULLAH_AVATAR,
    duration: "55:30",
    views: "2.4M views",
    timeAgo: "2 years ago",
    description: "ড.খন্দকার আব্দুল্লাহ জাহাঙ্গীর (রহ.)।",
    language: "bn",
    category: "Islamic Lecture",
  },
  {
    id: "v8",
    videoId: "rtVnA9EA0xg",
    title:
      "আত্মার তৃপ্তি কোথায়? | Dr. Abdullah Jahangir R. | অন্তরের প্রকৃত শান্তি পাওয়ার উপায়",
    channel: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelId: "abdullah",
    channelAvatar: ABDULLAH_AVATAR,
    duration: "40:05",
    views: "1.9M views",
    timeAgo: "8 months ago",
    description:
      "আসসালামু আলাইকুম,\nআজকের এই আধুনিক যুগে আমাদের চারপাশে সব ধরনের ভোগ-বিলাসের উপাদান থাকা সত্ত্বেও মানুষের মনে শান্তি নেই। সব পেয়েও যেন মানুষ এক চরম মানসিক অশান্তি ও শূন্যতায় ভুগছে। ড. আব্দুল্লাহ জাহাঙ্গীর (রাহিমাহুল্লাহ) এই ভিডিওতে কুরআন ও সুন্নাহর আলোকে আলোচনা করেছেন যে, মানুষের আত্মার আসল তৃপ্তি ও প্রশান্তি আসলে কোথায় লুকিয়ে আছে।",
    language: "bn",
    category: "Islamic Lecture",
  },
  {
    id: "v9",
    videoId: "kVbpcXFFeWQ",
    title:
      "এত সুন্দর করে আর কে বুঝাবে || খন্দকার আবদুল্লাহ জাহাঙ্গীর Abdullaha Jahangir, MAAS Islamic Media",
    channel: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelId: "abdullah",
    channelAvatar: ABDULLAH_AVATAR,
    duration: "22:15",
    views: "1.3M views",
    timeAgo: "5 months ago",
    description:
      "হৃদয়স্পর্শী লেকচার || এত সুন্দর করে আর কে বুঝাবে  || খন্দকার আবদুল্লাহ জাহাঙ্গীর Abdullaha Jahangir, MAAS Islamic Media",
    language: "bn",
    category: "Islamic Lecture",
  },
  {
    id: "v10",
    videoId: "9K_wuVawflg",
    title:
      "আখিরাতের চিন্তা এবং আব্দুল কাদের জিলানী রহমতুল্লাহি আলাইহির জীবনী│by Dr. Khondokar Abdullah Jahangir",
    channel: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelId: "abdullah",
    channelAvatar: ABDULLAH_AVATAR,
    duration: "35:48",
    views: "2.7M views",
    timeAgo: "10 months ago",
    description:
      "আল্লাহুয়াকবার! কি প্রাণচঞ্চল একটি আলোচনা! আখিরাতের চিন্তা এবং আব্দুল কাদের জিলানী রহমতুল্লাহি আলাইহির জীবনী। Amazing Islamic Lecture by Dr. Khondokar Abdullah Jahangir.",
    language: "bn",
    category: "Islamic Lecture",
  },

  // Zakir Naik – English
  {
    id: "v11",
    videoId: "XNojvAddjL8",
    title: "How to Enter Paradise in the Eyes of Islam – Talk by Dr Zakir Naik",
    channel: "Dr Zakir Naik",
    channelId: "zakir-naik",
    channelAvatar: ZAKIR_AVATAR,
    duration: "2:30:15",
    views: "1.5M views",
    timeAgo: "2 weeks ago",
    description:
      "How to Enter Paradise in the Eyes of Islam\nTalk by Dr Zakir Naik\nAt Hotel Royal Chulan Ballroom, Kuala Lumpur, Malaysia.\n20th June 2026",
    language: "en",
    category: "Islamic Lecture",
  },
  {
    id: "v12",
    videoId: "72-todksmcs",
    title: "Muslim's Power is in Unity and Closeness to Allah - Dr Zakir Naik",
    channel: "Dr Zakir Naik",
    channelId: "zakir-naik",
    channelAvatar: ZAKIR_AVATAR,
    duration: "1:45:30",
    views: "980K views",
    timeAgo: "1 month ago",
    description:
      "Muslim's Power is in Unity and Closeness to Allah - Dr Zakir Naik",
    language: "en",
    category: "Islamic Lecture",
  },
  {
    id: "v13",
    videoId: "ZD6p-op93EI",
    title: "Overwhelmingly Intellectual Answers to an Atheist by Dr Zakir Naik",
    channel: "Dr Zakir Naik",
    channelId: "zakir-naik",
    channelAvatar: ZAKIR_AVATAR,
    duration: "2:10:45",
    views: "2.3M views",
    timeAgo: "3 weeks ago",
    description:
      "Dr Zakir Naik Convincingly Answered all Intellectual Questions posed by an Atheist\nLecture Name: Ask Dr Zakir (Dubai - Part 1)",
    language: "en",
    category: "Islamic Lecture",
  },

  // Zakir Naik – Bengali
  {
    id: "v14",
    videoId: "wli20ZZztF4",
    title:
      "খ্রিস্টান শিক্ষক VS ডাঃ জাকির নায়েক - কে জিতবে এই তর্কে! | DR ZAKIR NAIK | বাংলা লেকচার",
    channel: "Dr Zakir Naik",
    channelId: "zakir-naik",
    channelAvatar: ZAKIR_AVATAR,
    duration: "1:20:10",
    views: "1.1M views",
    timeAgo: "5 months ago",
    description:
      "খ্রিস্টান শিক্ষক VS ডাঃ জাকির নায়েক - কে জিতবে এই তর্কে! | DR ZAKIR NAIK | ডাঃ জাকির নায়েক",
    language: "bn",
    category: "Islamic Lecture",
  },
  {
    id: "v15",
    videoId: "7NMRiv2IqPw",
    title:
      "আমাদের জীবনের উদ্দেশ্য কি? Dr. Zakir Naik What is the Purpose of Our Life? New Bangla Lecture 2018",
    channel: "Dr Zakir Naik",
    channelId: "zakir-naik",
    channelAvatar: ZAKIR_AVATAR,
    duration: "2:05:00",
    views: "780K views",
    timeAgo: "1 year ago",
    description:
      "আমাদের জীবনের উদ্দেশ্য কি?\nDr. Zakir Naik\n(পর্ব ১-৬)\nসম্পূর্ণ লেকচার (প্রশ্নোত্তর ছাড়া)\nপিস টিভি বাংলা\nPeace TV Bangla",
    language: "bn",
    category: "Islamic Lecture",
  },
  {
    id: "v16",
    videoId: "Nc4Iid3pSa8",
    title:
      "Historical International Lecture Dr Zakir Naik Bangla #drzakirnaik #zakirnaik #islamicscholar",
    channel: "Dr Zakir Naik",
    channelId: "zakir-naik",
    channelAvatar: ZAKIR_AVATAR,
    duration: "1:55:30",
    views: "1.3M views",
    timeAgo: "2 months ago",
    description:
      "Historical International Lecture Dr Zakir Naik Bangla #drzakirnaik #zakirnaik #islamicscholar",
    language: "bn",
    category: "Islamic Lecture",
  },
];