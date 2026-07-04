// app/playlists/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
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
  Check,
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { extendedPlaylists, PlaylistItem } from "@/lib/playlist-data";
import { videoData } from "@/lib/video-data";
import Image from "next/image";

// Matches Watch Later playlist defined in playlist-data.ts
const WATCH_LATER_IDS = ["v3", "v7", "v11", "v18", "v22", "v27", "v30", "v34"];

export default function PlaylistsPage() {
  const router = useRouter();
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
  // Video selection for create dialog
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);
  const [videoSearchQuery, setVideoSearchQuery] = useState("");

  const filteredDialogVideos = useMemo(() => {
    if (!videoSearchQuery.trim()) return videoData;
    const q = videoSearchQuery.toLowerCase();
    return videoData.filter(
      (v) => v.title.toLowerCase().includes(q) || v.channel.toLowerCase().includes(q)
    );
  }, [videoSearchQuery]);

  const toggleVideoSelection = (id: string) => {
    setSelectedVideoIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const addFromWatchLater = () => {
    setSelectedVideoIds((prev) => {
      const newIds = WATCH_LATER_IDS.filter((id) => !prev.includes(id));
      return [...prev, ...newIds];
    });
  };

  const resetCreateDialog = () => {
    setNewPlaylistName("");
    setNewPlaylistPublic(true);
    setSelectedVideoIds([]);
    setVideoSearchQuery("");
  };

  const getPlaylistThumbnail = (playlist: PlaylistItem) => {
    if (!playlist.videoIds.length) return null;
    const video = videoData.find((v) => v.id === playlist.videoIds[0]);
    return video ? `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg` : null;
  };

  const filteredPlaylists = useMemo(() => {
    let list = playlists.filter((pl) =>
      pl.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
      videoIds: selectedVideoIds,
      updatedAt: "Just now",
      isPublic: newPlaylistPublic,
      type: "playlist",
      thumbnailColor: "#" + Math.floor(Math.random() * 16777215).toString(16).padEnd(6, "0"),
    };
    setPlaylists((prev) => [newPlaylist, ...prev]);
    const count = selectedVideoIds.length;
    resetCreateDialog();
    setShowCreateDialog(false);
    toast.success(
      count > 0
        ? `Playlist created with ${count} video${count !== 1 ? "s" : ""}!`
        : "Playlist created!"
    );
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
      <div className="px-3 md:px-6 py-4 md:py-6 mt-14 md:mt-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Playlists</h1>
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
              onClick={() => { resetCreateDialog(); setShowCreateDialog(true); }}
            >
              <Plus className="h-4 w-4" />
              <span>New playlist</span>
            </Button>
          </div>
        </div>

        {/* Sort chip */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap bg-muted hover:bg-muted/80 text-foreground transition-colors">
                {sortOrder === "recent" && "Recently added"}
                {sortOrder === "asc" && "A-Z"}
                {sortOrder === "desc" && "Z-A"}
                <ChevronDown className="h-4 w-4 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40 rounded-xl">
              <DropdownMenuItem onClick={() => setSortOrder("recent")}>Recently added</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("asc")}>A-Z</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("desc")}>Z-A</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Playlist grid */}
        {filteredPlaylists.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ListVideo className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">
              {searchQuery ? "No playlists found" : "No playlists yet"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery
                ? "Try different search terms"
                : "Create your first playlist to organise your lectures"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => { resetCreateDialog(); setShowCreateDialog(true); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" /> New playlist
              </button>
            )}
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
                  <div className="relative aspect-video w-full bg-muted">
                    {thumbnailUrl ? (
                      <Image src={thumbnailUrl} alt={playlist.name} fill className="object-cover" />
                    ) : (
                      <>
                        <div className="absolute inset-0 opacity-30" style={{ backgroundColor: playlist.thumbnailColor }} />
                        <div className="absolute left-2 right-2 top-2 bottom-2 rounded-lg opacity-40" style={{ backgroundColor: playlist.thumbnailColor }} />
                        <div className="absolute left-4 right-4 top-4 bottom-4 rounded-lg flex items-center justify-center" style={{ backgroundColor: playlist.thumbnailColor }}>
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
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/playlists/${playlist.slug}/${playlist.id}`); }}>
                            <Play className="h-4 w-4 mr-2" /> Play all
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openEditDialog(playlist); }}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          {playlist.isPublic && (
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleShare(playlist); }}>
                              <Share className="h-4 w-4 mr-2" /> Share
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-red-600 dark:text-red-400"
                            onClick={(e) => { e.stopPropagation(); openDeleteDialog(playlist); }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
                      {playlist.isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                      <span>{playlist.isPublic ? "Public" : "Private"}</span>
                      <span>•</span>
                      <span>{videoCount} video{videoCount !== 1 ? "s" : ""}</span>
                      <span>•</span>
                      <span>Updated {playlist.updatedAt}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Playlist Dialog */}
      <Dialog
        open={showCreateDialog}
        onOpenChange={(open) => {
          setShowCreateDialog(open);
          if (!open) resetCreateDialog();
        }}
      >
        <DialogContent className="sm:max-w-lg flex flex-col max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Create new playlist</DialogTitle>
            <DialogDescription>
              Name your playlist, set privacy, and add videos.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto min-h-0 space-y-5 py-4 pr-0.5">
            {/* Name */}
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

            {/* Privacy */}
            <div className="flex items-center gap-3">
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
                {newPlaylistPublic ? "Anyone can see this playlist" : "Only you can see this playlist"}
              </span>
            </div>

            {/* Video selection */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Add videos
                  {selectedVideoIds.length > 0 && (
                    <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                      ({selectedVideoIds.length} selected)
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={addFromWatchLater}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  + Add Watch Later
                </button>
              </div>

              {/* Video search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search videos..."
                  value={videoSearchQuery}
                  onChange={(e) => setVideoSearchQuery(e.target.value)}
                  className="pl-9 h-8 text-sm rounded-full bg-muted/50"
                />
                {videoSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setVideoSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Selectable video list */}
              <div className="rounded-xl border overflow-hidden divide-y max-h-56 overflow-y-auto">
                {filteredDialogVideos.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">No videos found</div>
                ) : (
                  filteredDialogVideos.map((video) => {
                    const isSelected = selectedVideoIds.includes(video.id);
                    return (
                      <button
                        key={video.id}
                        type="button"
                        onClick={() => toggleVideoSelection(video.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 text-left transition-colors",
                          isSelected ? "bg-primary/10 hover:bg-primary/15" : "hover:bg-muted/50"
                        )}
                      >
                        <div className="relative w-14 h-8 rounded overflow-hidden flex-shrink-0 bg-black">
                          <Image
                            src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                            alt={video.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium line-clamp-1 leading-snug">{video.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{video.channel}</p>
                        </div>
                        <div className={cn(
                          "w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors",
                          isSelected ? "bg-primary border-primary" : "border-border"
                        )}>
                          {isSelected && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2 border-t">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => { setShowCreateDialog(false); resetCreateDialog(); }}
            >
              Cancel
            </Button>
            <Button
              className="rounded-full"
              onClick={handleCreatePlaylist}
              disabled={!newPlaylistName.trim()}
            >
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
            <DialogDescription>Update the name and privacy settings.</DialogDescription>
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
                {editPublic ? "Anyone can see this playlist" : "Only you can see this playlist"}
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
              <span className="font-semibold">{deletingPlaylist?.name}</span>? This action cannot be
              undone.
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

      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} videoUrl={shareUrl} />
    </div>
  );
}
