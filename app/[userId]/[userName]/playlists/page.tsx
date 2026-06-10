"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, X, ChevronDown, Plus, Edit, Trash2, Share, Lock, Globe, MoreVertical, Play, ListVideo, Copy, Check } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMediaQuery } from "@/hooks/use-media-query"

const defaultPlaylists = [
  { id: "1", slug: "quran-tafsir-series", name: "Quran Tafsir Series", videoCount: 24, updatedAt: "2 weeks ago", isPublic: true },
  { id: "2", slug: "stories-of-prophets", name: "Stories of the Prophets", videoCount: 18, updatedAt: "1 month ago", isPublic: true },
  { id: "3", slug: "islamic-lectures", name: "Islamic Lectures", videoCount: 32, updatedAt: "3 days ago", isPublic: true },
  { id: "4", slug: "my-private-notes", name: "My Private Notes", videoCount: 5, updatedAt: "1 day ago", isPublic: false },
  { id: "5", slug: "dawah-training", name: "Dawah Training", videoCount: 47, updatedAt: "1 week ago", isPublic: true },
  { id: "6", slug: "watch-later", name: "Watch Later", videoCount: 12, updatedAt: "3 weeks ago", isPublic: false },
]

const userName = "ahmad123"
const userId = "550e8400-e29b-41d4-a716-446655440000"

// Storage keys
const STORAGE_KEY = `playlists_${userId}`

// Load playlists from localStorage
const loadPlaylists = (): typeof defaultPlaylists => {
  if (typeof window === 'undefined') return defaultPlaylists
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    // Ignore parse errors
  }
  // Initialize with defaults on first load
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPlaylists))
  return defaultPlaylists
}

// Save playlists to localStorage
const savePlaylists = (playlists: typeof defaultPlaylists) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists))
}

function PlaylistSkeleton() {
  return (
    <div className="flex items-center gap-4 px-2 py-3">
      <Skeleton className="w-24 h-16 rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  )
}

export default function PlaylistsPage() {
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"recent" | "asc" | "desc">("recent")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingPlaylist, setEditingPlaylist] = useState<typeof defaultPlaylists[0] | null>(null)
  const [deletingPlaylist, setDeletingPlaylist] = useState<typeof defaultPlaylists[0] | null>(null)
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [newPlaylistPublic, setNewPlaylistPublic] = useState(true)
  const [playlists, setPlaylists] = useState<typeof defaultPlaylists>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Load playlists on mount
  useEffect(() => {
    setMounted(true)
    const loaded = loadPlaylists()
    setPlaylists(loaded)
    setIsLoading(false)
  }, [])

  // Save playlists whenever they change (after initial load)
  useEffect(() => {
    if (mounted && playlists.length > 0) {
      savePlaylists(playlists)
    }
  }, [playlists, mounted])

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

  const openEditDialog = (playlist: typeof defaultPlaylists[0]) => {
    setEditingPlaylist(playlist)
    setNewPlaylistName(playlist.name)
    setNewPlaylistPublic(playlist.isPublic)
    setShowEditDialog(true)
  }

  const openDeleteDialog = (playlist: typeof defaultPlaylists[0]) => {
    setDeletingPlaylist(playlist)
    setShowDeleteDialog(true)
  }

  const handleDeletePlaylist = () => {
    if (deletingPlaylist) {
      setPlaylists(playlists.filter((p) => p.id !== deletingPlaylist.id))
      setShowDeleteDialog(false)
      setDeletingPlaylist(null)
    }
  }

  const handleShare = (playlist: typeof defaultPlaylists[0]) => {
    if (!playlist.isPublic) return
    const shareUrl = `${window.location.origin}/${userId}/${userName}/playlists/${playlist.slug}/${playlist.id}`
    navigator.clipboard?.writeText(shareUrl).then(() => {
      setCopiedId(playlist.id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="flex">
        <DesktopSidebar className="hidden md:block" />

        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
            <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-lg">Playlists</h1>
          </div>

          <div className="max-w-[1096px] mx-auto px-4 md:px-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 md:py-6">
              <div className="flex items-center gap-3">
                {!isMobile && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <ListVideo className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">Playlists</h1>
                      {!isLoading && (
                        <p className="text-sm text-muted-foreground">
                          {playlists.length} playlist{playlists.length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {isMobile && !isLoading && (
                  <span className="text-sm text-muted-foreground">
                    {playlists.length} playlist{playlists.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <Button onClick={() => { setNewPlaylistName(""); setNewPlaylistPublic(true); setShowCreateDialog(true) }} className="rounded-full gap-2" size="sm">
                <Plus className="h-4 w-4" />
                <span>New playlist</span>
              </Button>
            </div>

            {/* Search + Sort */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search playlists"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-9 h-9 text-sm rounded-full bg-muted/50"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full gap-2 flex-shrink-0" size="sm">
                    {sortOrder === "recent" ? "Recent" : sortOrder === "asc" ? "A-Z" : "Z-A"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortOrder("recent")} className="cursor-pointer">Recent</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("asc")} className="cursor-pointer">A-Z</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("desc")} className="cursor-pointer">Z-A</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Playlists List */}
            {isLoading ? (
              <div className="divide-y">
                <PlaylistSkeleton />
                <PlaylistSkeleton />
                <PlaylistSkeleton />
                <PlaylistSkeleton />
                <PlaylistSkeleton />
              </div>
            ) : filteredPlaylists.length === 0 ? (
              <div className="text-center py-16">
                {searchQuery ? (
                  <>
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No playlists found</h3>
                    <p className="text-muted-foreground mb-4">Try different keywords</p>
                    <Button variant="outline" className="rounded-full" onClick={() => setSearchQuery("")}>
                      Clear search
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <ListVideo className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No playlists yet</h3>
                    <p className="text-muted-foreground mb-4">Create a playlist to organize your videos</p>
                    <Button className="rounded-full" onClick={() => { setNewPlaylistName(""); setNewPlaylistPublic(true); setShowCreateDialog(true) }}>
                      <Plus className="h-4 w-4 mr-2" /> Create playlist
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="divide-y">
                {filteredPlaylists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="flex items-center gap-3 md:gap-4 px-2 py-3 hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/${userId}/${userName}/playlists/${playlist.slug}/${playlist.id}`)}
                  >
                    {/* Thumbnail */}
                    <div className="w-28 md:w-32 h-16 md:h-18 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50" />
                      <ListVideo className="h-6 w-6 text-muted-foreground/50" />
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 py-0.5 rounded font-medium">
                        {playlist.videoCount}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm md:text-base font-medium truncate group-hover:text-primary transition-colors">
                        {playlist.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        {playlist.isPublic ? (
                          <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> Public</span>
                        ) : (
                          <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Private</span>
                        )}
                        <span>•</span>
                        <span>{playlist.videoCount} video{playlist.videoCount !== 1 ? 's' : ''}</span>
                        <span>•</span>
                        <span>Updated {playlist.updatedAt}</span>
                      </div>
                    </div>

                    {/* Actions - Always visible */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-full hover:bg-muted transition-colors"
                          >
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="py-3 cursor-pointer flex items-center gap-3" onClick={(e) => { e.stopPropagation(); openEditDialog(playlist) }}>
                            <Edit className="h-4 w-4" />
                            <span>Edit playlist</span>
                          </DropdownMenuItem>
                          {playlist.isPublic && (
                            <DropdownMenuItem className="py-3 cursor-pointer flex items-center gap-3" onClick={(e) => { e.stopPropagation(); handleShare(playlist) }}>
                              {copiedId === playlist.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                              <span>{copiedId === playlist.id ? 'Copied!' : 'Copy link'}</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="py-3 cursor-pointer flex items-center gap-3 text-destructive" onClick={(e) => { e.stopPropagation(); openDeleteDialog(playlist) }}>
                            <Trash2 className="h-4 w-4" />
                            <span>Delete playlist</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Playlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input type="text" placeholder="Playlist name..." value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} className="h-10" autoFocus />
            <div className="flex items-center gap-2">
              <button onClick={() => setNewPlaylistPublic(!newPlaylistPublic)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-colors ${newPlaylistPublic ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
                {newPlaylistPublic ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                {newPlaylistPublic ? "Public" : "Private"}
              </button>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleCreatePlaylist} disabled={!newPlaylistName.trim()}>Create</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Playlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input type="text" placeholder="Playlist name..." value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} className="h-10" autoFocus />
            <div className="flex items-center gap-2">
              <button onClick={() => setNewPlaylistPublic(!newPlaylistPublic)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-colors ${newPlaylistPublic ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
                {newPlaylistPublic ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                {newPlaylistPublic ? "Public" : "Private"}
              </button>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowEditDialog(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleEditPlaylist} disabled={!newPlaylistName.trim()}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Playlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete "{deletingPlaylist?.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
              <Button variant="destructive" className="flex-1" onClick={handleDeletePlaylist}>Delete</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <MobileNav />
    </div>
  )
}