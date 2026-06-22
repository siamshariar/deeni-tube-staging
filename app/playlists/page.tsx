// app/playlists/page.tsx
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { extendedPlaylists, PlaylistItem } from "@/lib/playlist-data";
import { videoData } from "@/lib/video-data";
import Image from "next/image";

export default function PlaylistsPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"recent" | "asc" | "desc">("recent");
  const [playlists, setPlaylists] = useState<PlaylistItem[]>(extendedPlaylists);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<PlaylistItem | null>(null);
  const [deletingPlaylist, setDeletingPlaylist] = useState<PlaylistItem | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistPublic, setNewPlaylistPublic] = useState(true);
  const [editName, setEditName] = useState("");
  const [editPublic, setEditPublic] = useState(true);

  const getPlaylistThumbnail = (playlist: PlaylistItem) => {
    if (!playlist.videoIds.length) return null;
    const firstVideoId = playlist.videoIds[0];
    const video = videoData.find((v) => v.id === firstVideoId);
    if (video) {
      return `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
    }
    return null;
  };

  const filteredPlaylists = useMemo(() => {
    let list = playlists.filter((pl) =>
      pl.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // “Watch Later” always comes first, then sort the rest
    const watchLater = list.find(p => p.id === "pl-watch-later");
    const others = list.filter(p => p.id !== "pl-watch-later");

    if (sortOrder === "recent") {
      others.sort((a, b) => {
        if (a.updatedAt === "Just now") return -1;
        if (b.updatedAt === "Just now") return 1;
        return b.updatedAt.localeCompare(a.updatedAt);
      });
    } else if (sortOrder === "asc") {
      others.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "desc") {
      others.sort((a, b) => b.name.localeCompare(a.name));
    }

    return watchLater ? [watchLater, ...others] : others;
  }, [playlists, searchQuery, sortOrder]);

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) {
      toast.error("Please enter a playlist name");
      return;
    }
    const newPlaylist: PlaylistItem = {
      id: Date.now().toString(),
      slug: newPlaylistName.trim().toLowerCase().replace(/\s+/g, "-"),
      name: newPlaylistName.trim(),
      videoIds: [],
      updatedAt: "Just now",
      isPublic: newPlaylistPublic,
      type: "playlist",
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

  const openEditDialog = (playlist: PlaylistItem) => {
    setEditingPlaylist(playlist);
    setEditName(playlist.name);
    setEditPublic(playlist.isPublic);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (playlist: PlaylistItem) => {
    setDeletingPlaylist(playlist);
    setShowDeleteDialog(true);
  };

  const handleShare = (playlist: PlaylistItem) => {
    const url = `${window.location.origin}/playlists/${playlist.slug}/${playlist.id}`;
    setShareUrl(url);
    setShowShareModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
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

      <div className="px-4 md:px-6 py-2 md:py-6 mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            {!isMobile && <h1 className="text-2xl font-bold">Playlists</h1>}
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

        {/* Sort chips only */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  "bg-muted hover:bg-muted/80 text-foreground"
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
            {filteredPlaylists.map((playlist) => {
              const videoCount = playlist.videoIds?.length ?? 0;
              const thumbnailUrl = getPlaylistThumbnail(playlist);
              return (
                <div
                  key={playlist.id}
                  className="group cursor-pointer border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-card"
                  onClick={() => router.push(`/playlists/${playlist.slug}/${playlist.id}`)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full">
                    {thumbnailUrl ? (
                      <Image
                        src={thumbnailUrl}
                        alt={playlist.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <>
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
                      </>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                      <ListVideo className="h-3 w-3" />
                      {videoCount}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="p-4 space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors flex-1">
                        {playlist.name}
                      </h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="p-1 rounded-full hover:bg-muted transition-colors -mr-1 flex-shrink-0"
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

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {playlist.isPublic ? (
                        <Globe className="h-3 w-3" />
                      ) : (
                        <Lock className="h-3 w-3" />
                      )}
                      <span>{playlist.isPublic ? "Public" : "Private"}</span>
                      <span>•</span>
                      <span>{videoCount} videos</span>
                      <span>•</span>
                      <span>Updated {playlist.updatedAt}</span>
                    </div>
                    <div className="pt-1">
                      <button
                        className="text-xs font-medium text-primary hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/playlists/${playlist.slug}/${playlist.id}`);
                        }}
                      >
                        View full playlist
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
              <span className="font-semibold">{deletingPlaylist?.name}</span>? This action cannot be undone.
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

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        videoUrl={shareUrl}
      />
    </div>
  );
}