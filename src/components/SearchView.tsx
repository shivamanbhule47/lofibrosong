import React, { useState } from "react";
import { Search, Music, Play, Pause, Heart, Sparkles, AlertCircle } from "lucide-react";
import { Track, Playlist } from "../types";
import { ALL_LOFI_TRACKS, SEARCH_CATEGORIES, MOOD_TAGS } from "../data";

interface SearchViewProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track, tracksContext: Track[]) => void;
  likedTracks: Track[];
  onToggleLike: (track: Track) => void;
  onSelectVibe: (vibe: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  stationTracks: Track[];
}

export default function SearchView({
  currentTrack,
  isPlaying,
  onPlayTrack,
  likedTracks,
  onToggleLike,
  onSelectVibe,
  searchQuery,
  setSearchQuery,
  stationTracks,
}: SearchViewProps) {
  // Filter tracks matching search query
  const filteredTracks = stationTracks.filter((track) => {
    const q = searchQuery.toLowerCase();
    return (
      track.title.toLowerCase().includes(q) ||
      track.artist.toLowerCase().includes(q) ||
      track.album.toLowerCase().includes(q) ||
      track.vibes?.some(v => v.toLowerCase().includes(q))
    );
  });

  return (
    <div id="search-view" className="flex-1 overflow-y-auto px-8 py-6 space-y-8 animate-fade-in pb-12">
      {/* Search Header and Input */}
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Search Broadcasts</h1>
        
        {/* Pill-shaped search bar with inset border effect from Geometric Balance */}
        <div className="relative max-w-[500px] w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#1ed760] transition-colors" />
          <input
            type="text"
            placeholder="What cozy beat are you looking for?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-black text-sm font-medium pl-12 pr-10 py-3.5 rounded-full outline-none transition-all duration-300 placeholder-gray-500 focus:bg-neutral-100"
            style={{
              boxShadow: "0px 0px 0px 1px #7c7c7c inset, rgba(0,0,0,0.4) 0px 4px 12px"
            }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono bg-[#2a2a2a] hover:bg-[#333] px-2 py-0.5 rounded text-[#b3b3b3]"
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* RENDER DYNAMIC SEARCH RESULTS IF THERE'S A QUERY */}
      {searchQuery ? (
        <section className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">Matching Tracks</h2>
            <span className="text-xs font-mono text-[#b3b3b3]">{filteredTracks.length} tracks found</span>
          </div>

          {filteredTracks.length > 0 ? (
            <div className="bg-[#181818] rounded-xl overflow-hidden border border-neutral-900 shadow-xl">
              {/* Table header */}
              <div className="grid grid-cols-[16px_1fr_120px_48px] gap-4 px-6 py-3 border-b border-[#282828] text-xs font-bold text-[#b3b3b3] uppercase tracking-wider">
                <span>#</span>
                <span>Title / Artist</span>
                <span>Album</span>
                <span className="text-right">Time</span>
              </div>

              {/* Matching Tracks list */}
              <div className="divide-y divide-[#1e1e1e]">
                {filteredTracks.map((track, index) => {
                  const isCurrent = currentTrack?.id === track.id;
                  const isThisPlaying = isCurrent && isPlaying;
                  const isTrackLiked = likedTracks.some((t) => t.id === track.id);

                  return (
                    <div
                      key={track.id}
                      onClick={() => onPlayTrack(track, filteredTracks)}
                      className={`grid grid-cols-[16px_1fr_120px_48px] gap-4 px-6 py-3.5 items-center hover:bg-[#222] group cursor-pointer transition-colors ${
                        isCurrent ? "bg-[#1f1f1f]" : ""
                      }`}
                    >
                      {/* Left Play/Index */}
                      <div className="flex items-center justify-center text-xs font-mono text-[#b3b3b3]">
                        <span className="group-hover:hidden">{index + 1}</span>
                        <span className="hidden group-hover:inline">
                          <Play className="w-3.5 h-3.5 text-white fill-current" />
                        </span>
                      </div>

                      {/* Cover & Title */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded bg-[#252525] overflow-hidden shrink-0">
                          <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-bold truncate ${isCurrent ? "text-[#1ed760]" : "text-white"}`}>
                            {track.title}
                          </p>
                          <p className="text-xs text-[#b3b3b3] truncate">{track.artist}</p>
                        </div>
                      </div>

                      {/* Album Column */}
                      <div className="text-xs text-[#b3b3b3] truncate hidden sm:block">
                        {track.album}
                      </div>

                      {/* Action buttons + Duration */}
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleLike(track);
                          }}
                          className={`opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity ${
                            isTrackLiked ? "opacity-100 text-[#1ed760]" : "text-[#b3b3b3] hover:text-white"
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isTrackLiked ? "fill-[#1ed760]" : ""}`} />
                        </button>
                        <span className="text-xs font-mono text-[#b3b3b3]">{track.duration}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-[#181818] rounded-xl p-8 text-center border border-dashed border-[#282828] max-w-md mx-auto">
              <AlertCircle className="w-8 h-8 text-[#ff6b35] mx-auto mb-3" />
              <p className="text-white font-bold text-sm">No matches found for "{searchQuery}"</p>
              <p className="text-xs text-[#b3b3b3] mt-1 leading-relaxed">
                Check your spelling or explore the cozy atmospheric mood categories below instead.
              </p>
            </div>
          )}
        </section>
      ) : (
        /* DEFAULT CATEGORY GRID VIEW */
        <>
          {/* Mood chips quick selector */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-[1.4px] text-[#b3b3b3]">Jump directly into vibes</h2>
            <div className="flex flex-wrap gap-2.5">
              {MOOD_TAGS.map((tag) => (
                <button
                  key={tag.name}
                  onClick={() => onSelectVibe(tag.name)}
                  className="px-4 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white text-xs font-bold rounded-full border border-neutral-800 hover:border-neutral-700 transition-all uppercase tracking-[1px] active:scale-95"
                >
                  {tag.name} Mixes
                </button>
              ))}
            </div>
          </section>

          {/* Cozy Grid of Tiles inspired by Spotify's Search categories */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight">Cozy Listening Niches</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {SEARCH_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setSearchQuery(cat.name)}
                  className={`h-40 relative rounded-xl overflow-hidden cursor-pointer bg-gradient-to-br ${cat.color} group shadow-lg hover:shadow-2xl hover:shadow-black/60 transition-all duration-300 hover:-translate-y-1 border border-neutral-900/50 hover:border-neutral-800`}
                >
                  {/* Subtle noise pattern overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 to-transparent mix-blend-overlay"></div>
                  
                  {/* Category Name */}
                  <div className="p-5">
                    <h3 className="text-lg font-extrabold text-white leading-tight tracking-tight drop-shadow-md max-w-[70%]">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-white/60 font-mono uppercase tracking-wider mt-1 drop-shadow-sm">
                      FM Archive
                    </p>
                  </div>

                  {/* Rotated, floating album art sticking out of bottom right corner */}
                  <div className="absolute bottom-0 right-0 w-24 h-24 shadow-2xl rounded-md overflow-hidden transform translate-x-4 translate-y-4 rotate-[25deg] group-hover:scale-110 group-hover:rotate-[20deg] transition-all duration-500 bg-[#222]">
                    <img 
                      src={cat.cover} 
                      alt={cat.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
