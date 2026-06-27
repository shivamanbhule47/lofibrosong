import React from "react";
import { Play, Pause, Heart, Trash2, Clock, Music4, AlertCircle } from "lucide-react";
import { Playlist, Track } from "../types";

interface PlaylistViewProps {
  playlist: Playlist;
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayPlaylist: (playlist: Playlist) => void;
  onPlayTrack: (track: Track, tracksContext: Track[]) => void;
  likedTracks: Track[];
  onToggleLike: (track: Track) => void;
  onRemoveTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  onDeletePlaylist?: (playlistId: string) => void;
  isCustomPlaylist?: boolean;
}

export default function PlaylistView({
  playlist,
  currentTrack,
  isPlaying,
  onPlayPlaylist,
  onPlayTrack,
  likedTracks,
  onToggleLike,
  onRemoveTrackFromPlaylist,
  onDeletePlaylist,
  isCustomPlaylist = false,
}: PlaylistViewProps) {
  
  // Calculate total playlist duration
  const calculateTotalDuration = (tracks: Track[]) => {
    let totalSecs = 0;
    tracks.forEach((track) => {
      const parts = track.duration.split(":");
      const mins = parseInt(parts[0]) || 0;
      const secs = parseInt(parts[1]) || 0;
      totalSecs += mins * 60 + secs;
    });

    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const remainingSecs = totalSecs % 60;

    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min ${remainingSecs} sec`;
  };

  const isPlaylistActive = currentTrack && isPlaying && playlist.tracks.some((t) => t.id === currentTrack.id);

  return (
    <div id="playlist-view" className="flex-1 overflow-y-auto animate-fade-in pb-12">
      
      {/* 1. Playlists Header Banner */}
      <div 
        className="p-8 pt-10 pb-6 flex flex-col md:flex-row items-end gap-6 relative"
        style={{
          background: `linear-gradient(to bottom, ${playlist.accentColor || "#1f1f1f"} 0%, #121212 100%)`
        }}
      >
        {/* Subtle noise overlay */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>

        {/* Large Album Art Container */}
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-lg overflow-hidden bg-[#252525] shrink-0 shadow-2xl relative z-10">
          {playlist.coverUrl ? (
            <img 
              src={playlist.coverUrl} 
              alt={playlist.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-950">
              <Music4 className="w-16 h-16 text-[#b3b3b3]" />
            </div>
          )}
        </div>

        {/* Playlist metadata details */}
        <div className="relative z-10 flex-1 select-none text-white">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[2px] text-[#ff6b35]">
            {playlist.isRadio ? "Live Radio Station" : isCustomPlaylist ? "Curation Archive" : "Handcrafted Playlist"}
          </p>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mt-1 mb-3 line-clamp-1">
            {playlist.name}
          </h1>

          <p className="text-[#b3b3b3] text-sm leading-relaxed max-w-2xl mb-4">
            {playlist.description || "No description provided. Create cozy moments with custom notes."}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#b3b3b3]">
            <span className="font-bold text-white hover:underline cursor-pointer">Lofi Bros</span>
            <span>•</span>
            <span className="font-semibold text-white">{playlist.tracks.length} tracks</span>
            <span>,</span>
            <span>{calculateTotalDuration(playlist.tracks)}</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Actions Row */}
      <div className="px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Large circular green play button */}
          {playlist.tracks.length > 0 ? (
            <button
              onClick={() => onPlayPlaylist(playlist)}
              className="w-14 h-14 rounded-full bg-[#1ed760] hover:bg-[#1fdf68] active:scale-95 text-black shadow-xl flex items-center justify-center transition-all"
              title="Play Playlist"
            >
              {isPlaylistActive ? (
                <Pause className="w-6 h-6 fill-black text-black" />
              ) : (
                <Play className="w-6 h-6 fill-black text-black ml-1" />
              )}
            </button>
          ) : null}

          {/* Delete Custom Playlist button */}
          {isCustomPlaylist && onDeletePlaylist && (
            <button
              onClick={() => onDeletePlaylist(playlist.id)}
              className="flex items-center gap-2 px-4 py-2 border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-full text-xs uppercase tracking-[1.4px] transition-colors"
              title="Delete Playlist"
            >
              <Trash2 className="w-4 h-4" />
              Delete Playlist
            </button>
          )}
        </div>

        <div className="text-xs text-[#b3b3b3] font-mono select-none">
          {playlist.isRadio ? "99.8 FM MONO" : "STEREO HI-FI"}
        </div>
      </div>

      {/* 3. Tracks Table List */}
      <div className="px-8">
        {playlist.tracks.length > 0 ? (
          <div className="bg-[#181818] rounded-xl overflow-hidden border border-neutral-900 shadow-xl mb-12">
            {/* Table Header */}
            <div className="grid grid-cols-[36px_1fr_160px_60px] gap-4 px-6 py-3 border-b border-[#282828] text-xs font-bold text-[#b3b3b3] uppercase tracking-wider select-none">
              <span className="text-center">#</span>
              <span>Title</span>
              <span>Album</span>
              <span className="text-right flex items-center justify-end gap-1">
                <Clock className="w-3.5 h-3.5" />
                Time
              </span>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-[#1e1e1e]">
              {playlist.tracks.map((track, index) => {
                const isCurrent = currentTrack?.id === track.id;
                const isTrackLiked = likedTracks.some((t) => t.id === track.id);

                return (
                  <div
                    key={track.id}
                    onClick={() => onPlayTrack(track, playlist.tracks)}
                    className={`grid grid-cols-[36px_1fr_160px_60px] gap-4 px-6 py-4 items-center hover:bg-[#222] group cursor-pointer transition-colors ${
                      isCurrent ? "bg-[#1f1f1f]" : ""
                    }`}
                  >
                    {/* Index / Hover Play */}
                    <div className="flex items-center justify-center text-xs font-mono text-[#b3b3b3]">
                      <span className="group-hover:hidden">{index + 1}</span>
                      <span className="hidden group-hover:inline">
                        <Play className="w-3.5 h-3.5 text-white fill-current" />
                      </span>
                    </div>

                    {/* Track info: Album art + details */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded bg-[#2a2a2a] overflow-hidden shrink-0">
                        <img 
                          src={track.coverUrl} 
                          alt={track.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-bold truncate ${isCurrent ? "text-[#1ed760]" : "text-white"}`}>
                          {track.title}
                        </p>
                        <p className="text-xs text-[#b3b3b3] truncate">{track.artist}</p>
                      </div>
                    </div>

                    {/* Album Title */}
                    <div className="text-xs text-[#b3b3b3] truncate hidden sm:block">
                      {track.album}
                    </div>

                    {/* Actions and duration */}
                    <div className="flex items-center justify-end gap-3.5">
                      {/* Heart Toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleLike(track);
                        }}
                        className={`opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity ${
                          isTrackLiked ? "opacity-100 text-[#1ed760]" : "text-[#b3b3b3] hover:text-white"
                        }`}
                        title="Add to Liked Songs"
                      >
                        <Heart className={`w-4 h-4 ${isTrackLiked ? "fill-[#1ed760]" : ""}`} />
                      </button>

                      {/* Remove from custom playlist button */}
                      {isCustomPlaylist && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveTrackFromPlaylist(playlist.id, track.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-red-400 hover:text-red-500 transition-opacity"
                          title="Remove Song from Playlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      <span className="text-xs font-mono text-[#b3b3b3]">{track.duration}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-[#181818] border border-dashed border-[#282828] rounded-xl p-12 text-center max-w-md mx-auto mb-12">
            <AlertCircle className="w-10 h-10 text-[#ff6b35] mx-auto mb-3" />
            <p className="text-white font-bold text-sm">This playlist has no tracks</p>
            <p className="text-xs text-[#b3b3b3] mt-1 mb-4 leading-relaxed">
              Explore your library or search for lofi beats and click the heart/add icon to populate this list.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
