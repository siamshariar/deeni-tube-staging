// lib/scholar-data.ts
export interface ScholarItem {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  designation: string;
  description: string;
  channelId: string;   // links to videoData
}

export const scholarData: ScholarItem[] = [
  {
    id: "scholar-1",
    name: "Dr. Mohammad Monzur-E-Elahi",
    slug: "monzur",
    avatar:
      "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj",
    designation: "Professor, Faculty of Shariah, Islamic University of Madinah",
    description:
      "Professor Dr. Mohammad Monzur-E-Elahi is a renowned Islamic scholar and academic. He holds a PhD in Shariah from the Islamic University of Madinah and has dedicated his life to teaching and spreading authentic Islamic knowledge. His lectures cover a wide range of topics including Quran, Hadith, Fiqh, and contemporary issues.",
    channelId: "monzur",
  },
  {
    id: "scholar-2",
    name: "Dr. Khandaker Abdullah Jahangir Rh.",
    slug: "abdullah",
    avatar:
      "https://yt3.googleusercontent.com/stJnVilfKhMtBiIq_hXTu-9DnanUT0GNtmsRePmQvLAi6c7bhXoIIHGlYL0HqUrdEjrL0KFs7Q=s160-c-k-c0x00ffffff-no-rj",
    designation: "Renowned Islamic Scholar & Author",
    description:
      "Dr. Khandaker Abdullah Jahangir (Rahimahullah) was a highly respected Islamic scholar, author, and educator. He wrote numerous books on Islam and delivered countless lectures that continue to inspire millions. His deep knowledge and clear explanations made him a beloved figure in the Islamic community.",
    channelId: "abdullah",
  },
];