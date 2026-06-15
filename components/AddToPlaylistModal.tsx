"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, Plus, Globe, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPlaylists, createPlaylist, addVideoToPlaylist, Playlist } from '@/lib/playlistHelpers';
import { WatchLaterVideo } from '@/lib/watchLater';

interface AddToPlaylistModalProps {
  open: boolean;
  onClose: () => void;
  video: WatchLaterVideo;
  onAdded?: () => void;
}

export default function AddToPlaylistModal({ open, onClose, video, onAdded }: AddToPlaylistModalProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>(() => getPlaylists());
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistPublic, setNewPlaylistPublic] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [addedTo, setAddedTo] = useState<string | null>(null);

  const handleAddToExisting = (playlistId: string) => {
    const success = addVideoToPlaylist(playlistId, video);
    if (success) {
      setAddedTo(playlistId);
      setTimeout(() => {
        setAddedTo(null);
        onClose();
        onAdded?.();
      }, 1000);
    }
  };

  const handleCreate = () => {
    if (!newPlaylistName.trim()) return;
    const newPlaylist = createPlaylist(newPlaylistName.trim(), newPlaylistPublic);
    setPlaylists(prev => [newPlaylist, ...prev]);
    handleAddToExisting(newPlaylist.id);
    setShowCreate(false);
    setNewPlaylistName('');
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save to playlist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {!showCreate ? (
            <>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {playlists.map(playlist => (
                  <button
                    key={playlist.id}
                    onClick={() => handleAddToExisting(playlist.id)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <div>
                      <span className="font-medium">{playlist.name}</span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {playlist.isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                        <span>{playlist.videoCount} videos</span>
                      </div>
                    </div>
                    {addedTo === playlist.id && <Check className="h-5 w-5 text-green-500" />}
                  </button>
                ))}
              </div>
              <Button variant="outline" className="w-full" onClick={() => setShowCreate(true)}>
                <Plus className="h-4 w-4 mr-2" /> Create new playlist
              </Button>
            </>
          ) : (
            <div className="space-y-3">
              <Input
                placeholder="Playlist name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                autoFocus
              />
              <div className="flex items-center gap-2">
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
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button className="flex-1" onClick={handleCreate} disabled={!newPlaylistName.trim()}>Create</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}