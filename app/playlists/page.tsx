"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  X,
  ChevronDown,
  ListVideo,
  Globe,
  Lock,
  Plus,
  Edit,
  Trash2,
  Share,
  MoreVertical,
  Play,
} from "lucide-react";
import AppHeader from "@/components/app-header";
import MobileNav from "@/components/mobile-nav";
import DesktopSidebar from "@/components/desktop-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShareModal } from "@/components/share-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/use-media-query";
import { mockPlaylists } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Extended mock data with types (no Mixes/Owned needed, but kept for other features)
const extendedPlaylists = [
  ...mockPlaylists.map((pl, i) => ({
    ...pl,
    type: "playlist", // all are regular playlists in mock
    videoCount: pl.videoIds?.length ?? Math.floor(Math.random() * 50) + 1,
    thumbnailColor: ["#5A7A8C", "#8C6B5A", "#7A8C5A", "#6A5A8C"][i % 4],
  })),
  {
    id: "pl-extra-1",
    slug: "saved-for-later",
    name: "Saved for later",
    videoIds: Array.from({ length: 12 }, () => Math.random().toString()),
    updatedAt: "2 weeks ago",
    isPublic: false,
    type: "saved",
    videoCount: 12,
    thumbnailColor: "#4A6A8C",
  },
  {
    id: "pl-extra-2",
    slug: "music-playlist",
    name: "Music Playlist",
    videoIds: Array.from({ length: 27 }, () => Math.random().toString()),
    updatedAt: "1 month ago",
    isPublic: true,
    type: "playlist",
    videoCount: 27,
    thumbnailColor: "#8C4A6A",
  },
  {
    id: "pl-extra-3",
    slug: "owned-collection",
    name: "Owned Collection",
    videoIds: Array.from({ length: 5 }, () => Math.random().toString()),
    updatedAt: "3 days ago",
    isPublic: false,
    type: "playlist",
    videoCount: 5,
    thumbnailColor: "#6A8C4A",
  },
  {
    id: "pl-extra-4",
    slug: "study-playlist",
    name: "Study Playlist",
    videoIds: Array.from({ length: 34 }, () => Math.random().toString()),
    updatedAt: "Yesterday",
    isPublic: true,
    type: "playlist",
    videoCount: 34,
    thumbnailColor: "#4A6A8C",
  },
];

// Filters – removed Mixes and Owned
const chipFilters = [
  { key: "playlists", label: "Playlists" },
  { key: "saved", label: "Saved" },
];

export default function PlaylistsPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("playlists"); // default to Playlists
  const [sortOrder, setSortOrder] = useState<"recent" | "asc" | "desc">("recent");
  const [playlists, setPlaylists] = useState(extendedPlaylists);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<any>(null);
  const [deletingPlaylist, setDeletingPlaylist] = useState<any>(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistPublic, setNewPlaylistPublic] = useState(true);
  const [editName, setEditName] = useState("");
  const [editPublic, setEditPublic] = useState(true);

  const filteredPlaylists = useMemo(() => {
    let list = playlists.filter((pl) =>
      pl.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply category filter (Playlists / Saved)
    if (activeFilter === "playlists") {
      list = list.filter((pl) => pl.type === "playlist");
    } else if (activeFilter === "saved") {
      list = list.filter((pl) => pl.type === "saved");
    }

    // Apply sort
    if (sortOrder === "recent") {
      list.sort((a, b) => {
        if (a.updatedAt === "Just now") return -1;
        if (b.updatedAt === "Just now") return 1;
        return b.updatedAt.localeCompare(a.updatedAt);
      });
    } else if (sortOrder === "asc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "desc") {
      list.sort((a, b) => b.name.localeCompare(a.name));
    }

    return list;
  }, [playlists, searchQuery, activeFilter, sortOrder]);

  // Handlers for dialogs
  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) {
      toast.error("Please enter a playlist name");
      return;
    }
    const newPlaylist = {
      id: Date.now().toString(),
      slug: newPlaylistName.trim().toLowerCase().replace(/\s+/g, "-"),
      name: newPlaylistName.trim(),
      videoIds: [],
      updatedAt: "Just now",
      isPublic: newPlaylistPublic,
      type: "playlist",
      videoCount: 0,
      thumbnailColor: "#" + Math.floor(Math.random() * 16777215).toString(16).padEnd(6, "0"),
    };
    setPlaylists((prev) => [newPlaylist, ...prev]);
    setNewPlaylistName("");
    setNewPlaylistPublic(true);
    setShowCreateDialog(false);
    toast.success("Playlist created!");
  };

  const handleEditPlaylist = () => {
    if (!editName.trim() || !editingPlaylist) return;
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === editingPlaylist.id
          ? { ...p, name: editName.trim(), isPublic: editPublic, updatedAt: "Just now" }
          : p
      )
    );
    setShowEditDialog(false);
    setEditingPlaylist(null);
    toast.success("Playlist updated!");
  };

  const handleDeletePlaylist = () => {
    if (!deletingPlaylist) return;
    setPlaylists((prev) => prev.filter((p) => p.id !== deletingPlaylist.id));
    setShowDeleteDialog(false);
    setDeletingPlaylist(null);
    toast.success("Playlist deleted!");
  };

  const openEditDialog = (playlist: any) => {
    setEditingPlaylist(playlist);
    setEditName(playlist.name);
    setEditPublic(playlist.isPublic);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (playlist: any) => {
    setDeletingPlaylist(playlist);
    setShowDeleteDialog(true);
  };

  const handleShare = (playlist: any) => {
    const url = `${window.location.origin}/playlists/${playlist.slug}/${playlist.id}`;
    setShareUrl(url);
    setShowShareModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          {/* Mobile header */}
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-lg">Playlists</h1>
          </div>

          <div className="px-4 md:px-6 py-4 md:py-6">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                {!isMobile && <h1 className="text-2xl font-bold">Playlists</h1>}
                <p className="text-sm text-muted-foreground mt-1">
                  {playlists.length} playlist{playlists.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search playlists"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-9 h-9 text-sm rounded-full bg-muted/50 focus:bg-muted transition-colors"
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
                <Button
                  className="rounded-full gap-2 flex-shrink-0"
                  size="sm"
                  onClick={() => {
                    setNewPlaylistName("");
                    setNewPlaylistPublic(true);
                    setShowCreateDialog(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">New playlist</span>
                </Button>
              </div>
            </div>

            {/* Chip bar */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
              {/* Recently added – dropdown for sorting */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                      "bg-muted hover:bg-muted/80 text-foreground" // not highlighted as active; it's a control
                    )}
                  >
                    {sortOrder === "recent" && "Recently added"}
                    {sortOrder === "asc" && "A-Z"}
                    {sortOrder === "desc" && "Z-A"}
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40 rounded-xl">
                  <DropdownMenuItem onClick={() => setSortOrder("recent")}>
                    Recently added
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                    A-Z
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                    Z-A
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Category filters */}
              {chipFilters.map((chip) => (
                <button
                  key={chip.key}
                  onClick={() => setActiveFilter(chip.key)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    activeFilter === chip.key
                      ? "bg-foreground text-background"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  )}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Playlist grid */}
            {filteredPlaylists.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  {searchQuery ? "No playlists found" : "No playlists in this category"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredPlaylists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="group cursor-pointer"
                    onClick={() =>
                      router.push(`/playlists/${playlist.slug}/${playlist.id}`)
                    }
                  >
                    {/* Thumbnail with collection stack effect */}
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                      <div
                        className="absolute inset-0 opacity-30"
                        style={{ backgroundColor: playlist.thumbnailColor }}
                      />
                      <div
                        className="absolute left-2 right-2 top-2 bottom-2 rounded-lg opacity-40"
                        style={{ backgroundColor: playlist.thumbnailColor }}
                      />
                      <div
                        className="absolute left-4 right-4 top-4 bottom-4 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: playlist.thumbnailColor }}
                      >
                        <ListVideo className="h-10 w-10 text-white/60" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                        <ListVideo className="h-3 w-3" />
                        {playlist.videoCount || playlist.videoIds.length}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                        {playlist.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        {playlist.isPublic ? (
                          <Globe className="h-3 w-3" />
                        ) : (
                          <Lock className="h-3 w-3" />
                        )}
                        <span>{playlist.isPublic ? "Public" : "Private"}</span>
                        <span>•</span>
                        <span>{playlist.videoCount || playlist.videoIds.length} videos</span>
                        <span>•</span>
                        <span>Updated {playlist.updatedAt}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <button
                          className="text-xs font-medium text-primary hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/playlists/${playlist.slug}/${playlist.id}`);
                          }}
                        >
                          View full playlist
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="p-1 rounded-full hover:bg-muted transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/playlists/${playlist.slug}/${playlist.id}`);
                              }}
                            >
                              <Play className="h-4 w-4 mr-2" /> Play all
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditDialog(playlist);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            {playlist.isPublic && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShare(playlist);
                                }}
                              >
                                <Share className="h-4 w-4 mr-2" /> Share
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-red-600 dark:text-red-400"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteDialog(playlist);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <MobileNav />

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        videoUrl={shareUrl}
      />

      {/* Create Playlist Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create new playlist</DialogTitle>
            <DialogDescription>
              Give your playlist a name and choose privacy setting.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Playlist name</label>
              <Input
                placeholder="My playlist"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="h-10 rounded-full"
                autoFocus
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setNewPlaylistPublic(!newPlaylistPublic)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-colors",
                  newPlaylistPublic
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:bg-muted"
                )}
              >
                {newPlaylistPublic ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                {newPlaylistPublic ? "Public" : "Private"}
              </button>
              <span className="text-xs text-muted-foreground">
                {newPlaylistPublic
                  ? "Anyone can see this playlist"
                  : "Only you can see this playlist"}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-full" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button className="rounded-full" onClick={handleCreatePlaylist} disabled={!newPlaylistName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Playlist Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit playlist</DialogTitle>
            <DialogDescription>
              Update the name and privacy settings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Playlist name</label>
              <Input
                placeholder="Playlist name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="h-10 rounded-full"
                autoFocus
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditPublic(!editPublic)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-colors",
                  editPublic
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:bg-muted"
                )}
              >
                {editPublic ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                {editPublic ? "Public" : "Private"}
              </button>
              <span className="text-xs text-muted-foreground">
                {editPublic
                  ? "Anyone can see this playlist"
                  : "Only you can see this playlist"}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-full" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button className="rounded-full" onClick={handleEditPlaylist} disabled={!editName.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Playlist Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete playlist</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deletingPlaylist?.name}</span>? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="rounded-full" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" className="rounded-full" onClick={handleDeletePlaylist}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}