"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, X, ChevronDown, Plus, Edit, Trash2, Share, Lock, Globe } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const samplePlaylists = [
  { id: "1", slug: "quran-tafsir-series", name: "Quran Tafsir Series", videoCount: 24, updatedAt: "2 weeks ago", isPublic: true },
  { id: "2", slug: "stories-of-prophets", name: "Stories of the Prophets", videoCount: 18, updatedAt: "1 month ago", isPublic: true },
  { id: "3", slug: "islamic-lectures", name: "Islamic Lectures", videoCount: 32, updatedAt: "3 days ago", isPublic: true },
  { id: "4", slug: "my-private-notes", name: "My Private Notes", videoCount: 5, updatedAt: "1 day ago", isPublic: false },
  { id: "5", slug: "dawah-training", name: "Dawah Training", videoCount: 47, updatedAt: "1 week ago", isPublic: true },
  { id: "6", slug: "watch-later", name: "Watch Later", videoCount: 12, updatedAt: "3 weeks ago", isPublic: false },
]

const userName = "ahmad123"
const userId = "550e8400-e29b-41d4-a716-446655440000"

export default function PlaylistsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"recent" | "asc" | "desc">("recent")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingPlaylist, setEditingPlaylist] = useState<typeof samplePlaylists[0] | null>(null)
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [newPlaylistPublic, setNewPlaylistPublic] = useState(true)
  const [playlists, setPlaylists] = useState(samplePlaylists)

  const filteredPlaylists = playlists
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "asc") return a.name.localeCompare(b.name)
      if (sortOrder === "desc") return b.name.localeCompare(a.name)
      return 0
    })

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const slug = newPlaylistName.trim().toLowerCase().replace(/\s+/g, "-")
      const newPlaylist = {
        id: String(Date.now()),
        slug,
        name: newPlaylistName.trim(),
        videoCount: 0,
        updatedAt: "Just now",
        isPublic: newPlaylistPublic,
      }
      setPlaylists([newPlaylist, ...playlists])
      setNewPlaylistName("")
      setNewPlaylistPublic(true)
      setShowCreateDialog(false)
    }
  }

  const handleEditPlaylist = () => {
    if (editingPlaylist && newPlaylistName.trim()) {
      const slug = newPlaylistName.trim().toLowerCase().replace(/\s+/g, "-")
      setPlaylists(playlists.map((p) =>
        p.id === editingPlaylist.id
          ? { ...p, name: newPlaylistName.trim(), slug, isPublic: newPlaylistPublic }
          : p
      ))
      setShowEditDialog(false)
      setEditingPlaylist(null)
      setNewPlaylistName("")
    }
  }

  const openEditDialog = (playlist: typeof samplePlaylists[0]) => {
    setEditingPlaylist(playlist)
    setNewPlaylistName(playlist.name)
    setNewPlaylistPublic(playlist.isPublic)
    setShowEditDialog(true)
  }

  const handleDeletePlaylist = (id: string) => {
    setPlaylists(playlists.filter((p) => p.id !== id))
  }

  const handleShare = (playlist: typeof samplePlaylists[0]) => {
    if (!playlist.isPublic) return
    const shareUrl = `${window.location.origin}/${userId}/${userName}/playlists/${playlist.slug}/${playlist.id}`
    navigator.clipboard?.writeText(shareUrl)
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="flex">
        <DesktopSidebar className="hidden md:block" />

        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          {/* Mobile Back + Title */}
          <div className="md:hidden flex items-center gap-3 px-4 py-2 border-b">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-lg">Playlists</h1>
          </div>

          <div className="max-w-3xl mx-auto px-4">
            {/* Desktop Header */}
            <div className="hidden md:flex items-center justify-between py-4">
              <h1 className="text-2xl font-bold">Playlists</h1>
              <Button onClick={() => { setNewPlaylistName(""); setNewPlaylistPublic(true); setShowCreateDialog(true) }} size="sm" className="rounded-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Playlist
              </Button>
            </div>

            {/* Mobile Create Button */}
            <div className="md:hidden py-3">
              <Button onClick={() => { setNewPlaylistName(""); setNewPlaylistPublic(true); setShowCreateDialog(true) }} className="w-full rounded-full">
                <Plus className="h-4 w-4 mr-2" />
                Create New Playlist
              </Button>
            </div>

            {/* Search + Sort */}
            <div className="flex items-center gap-3 py-3 border-b">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search playlists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-9 h-9 text-sm rounded-full bg-muted/40"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setSortOrder(sortOrder === "recent" ? "asc" : sortOrder === "asc" ? "desc" : "recent")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-medium hover:bg-muted transition-colors flex-shrink-0"
              >
                {sortOrder === "recent" ? "Recent" : sortOrder === "asc" ? "A-Z" : "Z-A"}
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>

            {/* Playlist List - No pagination, all at once */}
            <div className="divide-y">
              {filteredPlaylists.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No playlists found
                </div>
              ) : (
                filteredPlaylists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="flex items-center gap-4 px-2 py-3 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/${userId}/${userName}/playlists/${playlist.slug}/${playlist.id}`)}
                  >
                    {/* List-based media object */}
                    <div className="w-24 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📋</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate">{playlist.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        {playlist.isPublic ? (
                          <><Globe className="h-3 w-3" /><span>Public</span></>
                        ) : (
                          <><Lock className="h-3 w-3" /><span>Private</span></>
                        )}
                        <span>|</span>
                        <span>{playlist.videoCount} videos</span>
                      </div>
                    </div>

                    {/* Actions: Edit, Delete, Share */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEditDialog(playlist) }}
                        className="p-1.5 rounded-full hover:bg-muted transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeletePlaylist(playlist.id) }}
                        className="p-1.5 rounded-full hover:bg-muted transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleShare(playlist) }}
                        className={`p-1.5 rounded-full hover:bg-muted transition-colors ${!playlist.isPublic ? "opacity-30 pointer-events-none" : ""}`}
                        disabled={!playlist.isPublic}
                        title={playlist.isPublic ? "Share" : "Private playlists cannot be shared"}
                      >
                        <Share className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Playlist Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Playlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              type="text"
              placeholder="Playlist name..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="h-10"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setNewPlaylistPublic(!newPlaylistPublic)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border ${newPlaylistPublic ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}
              >
                {newPlaylistPublic ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                {newPlaylistPublic ? "Public" : "Private"}
              </button>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleCreatePlaylist} disabled={!newPlaylistName.trim()}>
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Playlist Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Playlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              type="text"
              placeholder="Playlist name..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="h-10"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setNewPlaylistPublic(!newPlaylistPublic)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border ${newPlaylistPublic ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}
              >
                {newPlaylistPublic ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                {newPlaylistPublic ? "Public" : "Private"}
              </button>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleEditPlaylist} disabled={!newPlaylistName.trim()}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <MobileNav />
    </div>
  )
}