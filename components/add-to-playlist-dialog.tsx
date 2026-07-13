"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { usePlaylists } from "@/hooks/usePlaylists";
import { toast } from "sonner";

interface AddToPlaylistDialogProps {
  video: { id: string; title: string; channel: string };
  children?: React.ReactNode;
  onAdded?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddToPlaylistDialog({ video, children, onAdded, open: externalOpen, onOpenChange }: AddToPlaylistDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistPublic, setNewPlaylistPublic] = useState(false);
  useEffect(() => { if (open) { setNewPlaylistName(""); setNewPlaylistPublic(false); } }, [open]);
  const setOpen = (o: boolean) => {
    if (!o) { setNewPlaylistName(""); setNewPlaylistPublic(false); }
    (onOpenChange ?? setInternalOpen)(o);
  };
  const { playlists, addVideoToPlaylist, createPlaylist } = usePlaylists();

  const handleAddToExisting = (playlistId: string) => {
    addVideoToPlaylist(playlistId, video);
    toast.success("Added to playlist");
    onAdded?.();
    setOpen(false);
  };

  const handleCreateAndAdd = () => {
    if (!newPlaylistName.trim()) return;
    const newId = createPlaylist(newPlaylistName.trim(), newPlaylistPublic);
    addVideoToPlaylist(newId, video);
    toast.success("Playlist created and video added");
    setNewPlaylistName("");
    setNewPlaylistPublic(false);
    onAdded?.();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save to playlist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {playlists.map(pl => (
              <button
                key={pl.id}
                onClick={() => handleAddToExisting(pl.id)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left"
              >
                <span>{pl.name}</span>
                <span className="text-xs text-muted-foreground">{pl.videoIds.length} videos</span>
              </button>
            ))}
          </div>
          <div className="border-t pt-3">
            <p className="text-sm font-medium mb-2">Create new playlist</p>
            <Input
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="mb-2"
            />
            <div className="flex items-center justify-between">
              <select
                value={newPlaylistPublic ? "public" : "private"}
                onChange={e => setNewPlaylistPublic(e.target.value === "public")}
                className="h-9 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
              <Button size="sm" onClick={handleCreateAndAdd} disabled={!newPlaylistName.trim()}>
                <Plus className="h-4 w-4 mr-1" /> Create & add
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}