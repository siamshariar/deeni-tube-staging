import ListPage from "@/components/list-page"

const channels = [
  { id: "1", name: "Islamic Guidance", slug: "islamic-guidance", image: "/medical-professional-profile.png", subtitle: "2.5M subscribers" },
  { id: "2", name: "Merciful Servant", slug: "merciful-servant", subtitle: "1.8M subscribers" },
  { id: "3", name: "Digital Mimbar", slug: "digital-mimbar", subtitle: "950K subscribers" },
  { id: "4", name: "Huda TV", slug: "huda-tv", subtitle: "3.2M subscribers" },
  { id: "5", name: "Peace TV", slug: "peace-tv", subtitle: "5.1M subscribers" },
  { id: "6", name: "One Islam Productions", slug: "one-islam", subtitle: "2.1M subscribers" },
  { id: "7", name: "Daily Dawah", slug: "daily-dawah", subtitle: "780K subscribers" },
  { id: "8", name: "The Deen Show", slug: "deen-show", subtitle: "450K subscribers" },
  { id: "9", name: "IlmFeed", slug: "ilmfeed", subtitle: "620K subscribers" },
  { id: "10", name: "Islam Channel", slug: "islam-channel", subtitle: "1.2M subscribers" },
  { id: "11", name: "Eman Channel", slug: "eman-channel", subtitle: "340K subscribers" },
  { id: "12", name: "Quran Weekly", slug: "quran-weekly", subtitle: "890K subscribers" },
]

export default function ChannelsPage() {
  return (
    <ListPage
      title="Channels"
      items={channels}
      basePath="channel"
      itemType="channel"
    />
  )
}