"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Globe, Lock } from "lucide-react";
import { usePlaylists } from "@/hooks/usePlaylists";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AddToPlaylistDialogProps {
  video: { id: string; title: string; channel: string };
  children: React.ReactNode;
  onAdded?: () => void;
}

export function AddToPlaylistDialog({ video, children, onAdded }: AddToPlaylistDialogProps) {
  const [open, setOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistPublic, setNewPlaylistPublic] = useState(true);
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
    setNewPlaylistPublic(true);
    onAdded?.();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
              <button
                onClick={() => setNewPlaylistPublic(!newPlaylistPublic)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-colors",
                  newPlaylistPublic ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"
                )}
              >
                {newPlaylistPublic ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                {newPlaylistPublic ? "Public" : "Private"}
              </button>
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