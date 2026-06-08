import ListPage from "@/components/list-page"

const categories = [
  { id: "1", name: "Aqeedah", slug: "aqeedah", description: "Islamic Creed and Belief" },
  { id: "2", name: "Fiqh", slug: "fiqh", description: "Islamic Jurisprudence" },
  { id: "3", name: "Hadith", slug: "hadith", description: "Prophetic Traditions" },
  { id: "4", name: "Tafsir", slug: "tafsir", description: "Quranic Exegesis" },
  { id: "5", name: "Seerah", slug: "seerah", description: "Prophetic Biography" },
  { id: "6", name: "Dawah", slug: "dawah", description: "Islamic Propagation" },
  { id: "7", name: "Family", slug: "family", description: "Marriage and Family Life" },
  { id: "8", name: "Finance", slug: "finance", description: "Islamic Finance" },
  { id: "9", name: "Youth", slug: "youth", description: "Youth Development" },
  { id: "10", name: "Spirituality", slug: "spirituality", description: "Tazkiyah and Purification" },
  { id: "11", name: "Quran", slug: "quran", description: "Quran Recitation and Memorization" },
  { id: "12", name: "Salah", slug: "salah", description: "Prayer and Worship" },
]

export default function CategoriesPage() {
  return (
    <ListPage
      title="Categories"
      items={categories}
      languageFilter={false}
      basePath="categories"
      itemType="category"
    />
  )
}