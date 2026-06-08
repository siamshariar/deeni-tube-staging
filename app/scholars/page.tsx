import ListPage from "@/components/list-page"

const scholars = [
  { id: "1", name: "Sheikh Abdul Alim", slug: "abdul-alim", subtitle: "Islamic Scholar", image: "/portrait-of-abdul-alim.png" },
  { id: "2", name: "Dr. Bilal Philips", slug: "bilal-philips", subtitle: "Islamic Preacher" },
  { id: "3", name: "Mufti Menk", slug: "mufti-menk", subtitle: "Grand Mufti" },
  { id: "4", name: "Sheikh Yasir Qadhi", slug: "yasir-qadhi", subtitle: "Islamic Scholar" },
  { id: "5", name: "Nouman Ali Khan", slug: "nouman-ali-khan", subtitle: "Quran Instructor" },
  { id: "6", name: "Omar Suleiman", slug: "omar-suleiman", subtitle: "Islamic Scholar" },
  { id: "7", name: "Dr. Zakir Naik", slug: "zakir-naik", subtitle: "Comparative Religion" },
  { id: "8", name: "Sheikh Assim Al Hakeem", slug: "assim-al-hakeem", subtitle: "Islamic Scholar" },
  { id: "9", name: "Sheikh Hamza Yusuf", slug: "hamza-yusuf", subtitle: "Islamic Scholar" },
  { id: "10", name: "Imam Nawawi", slug: "imam-nawawi", subtitle: "Hadith Scholar" },
]

export default function ScholarsPage() {
  return (
    <ListPage
      title="Scholars"
      items={scholars}
      basePath="scholars"
      itemType="scholar"
    />
  )
}