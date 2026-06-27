import React, { useState, useEffect } from "react";
import { Play, Pause, Radio, CloudRain, Sparkles, BookOpen, Moon, Flame, Coffee } from "lucide-react";
import { Playlist, Track } from "../types";
import { STATIC_PLAYLISTS, MOOD_TAGS } from "../data";

interface HomeViewProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayPlaylist: (playlist: Playlist) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
  onSelectVibe: (vibe: string) => void;
}

export default function HomeView({
  currentTrack,
  isPlaying,
  onPlayPlaylist,
  onSelectPlaylist,
  onSelectVibe,
}: HomeViewProps) {
  const [greeting, setGreeting] = useState("Good Morning");

  // Determine dynamic greeting based on time of day
  useEffect(() => {
    const hrs = new Date().getHours();
    if (hrs < 12) setGreeting("Good Morning");
    else if (hrs < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <div id="home-view" className="flex-1 overflow-y-auto px-8 py-6 space-y-8 animate-fade-in pb-12">
      
      {/* Dynamic Header Greeting with a subtle warm vintage overlay */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-[#211612] to-[#121212] border border-[#2c1f19]/40 overflow-hidden shadow-lg select-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff6b35] opacity-[0.02] rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-[#1ed760] opacity-[0.015] rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-[#ff6b35] bg-[#ff6b35]/15 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                COZY STATION
              </span>
              <span className="text-xs font-mono font-bold text-[#1ed760] bg-[#1ed760]/10 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#1ed760] rounded-full animate-ping"></span>
                99.8 FM
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
              {greeting}, Listener
            </h1>
            <p className="text-[#b3b3b3] text-sm max-w-xl leading-relaxed">
              Pour some hot coffee, adjust the ambient rain volume in the bottom-right corner, and let these warm tape chords guide your day.
            </p>
          </div>
          
          {/* Quick Start Live Radio Feature */}
          <button
            onClick={() => {
              // Construct a simulated Radio playlist from STATIC_PLAYLISTS
              const radioPlaylist: Playlist = {
                id: "playlist-radio",
                name: "Lofi Bros Live Station",
                description: "Deep underground lo-fi beats, continuous playback.",
                coverUrl: STATIC_PLAYLISTS[0].coverUrl,
                tracks: STATIC_PLAYLISTS.flatMap(p => p.tracks)
              };
              onPlayPlaylist(radioPlaylist);
            }}
            className="flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-[#ff6b35] to-orange-600 text-white font-extrabold rounded-full text-xs uppercase tracking-[1.6px] transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-[#ff6b35]/25 hover:shadow-2xl shrink-0"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            Tune in Live Radio
          </button>
        </div>
      </div>

      {/* QUICK BENTO GRID RECENT PLAYLISTS */}
      <section className="space-y-4">
        <h2 className="text-[24px] font-bold tracking-tight text-white">Recent Stations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATIC_PLAYLISTS.map((playlist) => {
            const isThisPlaylistPlaying = currentTrack && isPlaying && playlist.tracks.some(t => t.id === currentTrack.id);
            return (
              <div 
                key={playlist.id}
                className="group relative flex items-center bg-[#181818] hover:bg-[#222222] rounded-lg overflow-hidden transition-all duration-300 shadow-md cursor-pointer border border-neutral-900 hover:border-neutral-800"
                onClick={() => onSelectPlaylist(playlist)}
              >
                <div className="w-16 h-16 shrink-0 bg-[#282828] relative">
                  <img 
                    src={playlist.coverUrl} 
                    alt={playlist.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 px-4 min-w-0 pr-12">
                  <p className="font-bold text-xs text-white truncate">{playlist.name}</p>
                  <p className="text-[10px] text-[#b3b3b3] truncate mt-0.5">{playlist.tracks.length} tracks</p>
                </div>

                {/* Circular Play Button on Hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayPlaylist(playlist);
                  }}
                  className="absolute right-4 w-9 h-9 rounded-full bg-[#1ed760] hover:bg-[#1fdf68] text-black shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 active:scale-90"
                  title="Play Mix"
                >
                  {isThisPlaylistPlaying ? (
                    <Pause className="w-4.5 h-4.5 fill-black text-black" />
                  ) : (
                    <Play className="w-4.5 h-4.5 fill-black text-black ml-0.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* MOOD-BASED CHILL VIBES CHIPS */}
      <section className="space-y-4">
        <div>
          <h2 className="text-[24px] font-bold tracking-tight text-white">Cozy Atmospheric Moods</h2>
          <p className="text-xs text-[#b3b3b3] mt-0.5">Filter the broadcast beats by your current cozy situation.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {MOOD_TAGS.map((tag) => {
            const getIcon = (iconName: string) => {
              switch(iconName) {
                case "BookOpen": return <BookOpen className="w-5 h-5 text-amber-400" />;
                case "Moon": return <Moon className="w-5 h-5 text-indigo-400" />;
                case "Flame": return <Flame className="w-5 h-5 text-emerald-400" />;
                case "Coffee": return <Coffee className="w-5 h-5 text-rose-400" />;
                default: return <Sparkles className="w-5 h-5 text-white" />;
              }
            };
            return (
              <button
                key={tag.name}
                onClick={() => onSelectVibe(tag.name)}
                className={`flex items-center gap-3 p-4 bg-[#181818] hover:bg-gradient-to-br border rounded-xl text-left transition-all duration-300 group hover:-translate-y-0.5 hover:shadow-lg ${tag.color}`}
              >
                <div className="p-2 rounded-lg bg-black/40 group-hover:scale-110 transition-transform">
                  {getIcon(tag.icon)}
                </div>
                <div>
                  <p className="font-bold text-sm text-white">{tag.name}</p>
                  <p className="text-[10px] text-[#b3b3b3] uppercase tracking-wider font-mono">Bros Mix</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* HORIZONTAL MIXES SECTION WITH COZY COVER CARDS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[24px] font-bold tracking-tight text-white">Your Top Lofi Mixes</h2>
            <p className="text-xs text-[#b3b3b3] mt-0.5 font-sans">Warm analog recordings handcrafted for your focus loops.</p>
          </div>
          <span className="text-xs font-mono text-[#ff6b35] hover:underline cursor-pointer">View All</span>
        </div>
        
        {/* Horizontal scroll grid */}
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-thin select-none snap-x">
          {STATIC_PLAYLISTS.map((playlist) => {
            const isThisPlaylistPlaying = currentTrack && isPlaying && playlist.tracks.some(t => t.id === currentTrack.id);
            return (
              <div
                key={playlist.id}
                onClick={() => onSelectPlaylist(playlist)}
                className="group flex-shrink-0 w-[180px] bg-[#181818] hover:bg-[#1f1f1f] p-4 rounded-xl cursor-pointer transition-all duration-300 shadow-md hover:shadow-2xl hover:shadow-black/60 snap-start border border-transparent hover:border-neutral-800"
              >
                {/* Square Album Cover */}
                <div className="w-full aspect-square rounded-md overflow-hidden bg-[#2a2a2a] relative mb-4 shadow-md">
                  <img 
                    src={playlist.coverUrl} 
                    alt={playlist.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Floating Green Play Button appearing on Hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayPlaylist(playlist);
                    }}
                    className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[#1ed760] hover:bg-[#1fdf68] text-black shadow-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:scale-105 active:scale-95"
                    title="Play Mix"
                  >
                    {isThisPlaylistPlaying ? (
                      <Pause className="w-5 h-5 fill-black text-black" />
                    ) : (
                      <Play className="w-5 h-5 fill-black text-black ml-0.5" />
                    )}
                  </button>
                </div>

                {/* Card Title & Subtitle */}
                <h3 className="font-bold text-xs text-white truncate mb-1">
                  {playlist.name}
                </h3>
                <p className="text-[10px] text-[#b3b3b3] line-clamp-2 leading-relaxed">
                  {playlist.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* DENSE BROADCAST ROW: CHILL BEATS VS FOCUS FLOW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Grid: Chill Beats */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-neutral-900">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-3 bg-[#1ed760] rounded"></span>
              Chill Beats Selection
            </h3>
            <span className="text-[10px] font-mono text-[#b3b3b3]">4 Tracks</span>
          </div>
          
          <div className="space-y-2.5">
            {STATIC_PLAYLISTS[1].tracks.slice(0, 4).map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;
              return (
                <div
                  key={track.id}
                  onClick={() => onSelectPlaylist(STATIC_PLAYLISTS[1])}
                  className={`flex items-center justify-between p-2.5 rounded-lg bg-[#181818] hover:bg-[#1f1f1f] cursor-pointer transition-colors group ${
                    isCurrent ? "border-l-2 border-[#1ed760] bg-[#1e1e1e]" : "border-l-2 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-[#b3b3b3] font-mono w-4 text-center">{idx + 1}</span>
                    <div className="w-9 h-9 rounded bg-[#282828] overflow-hidden shrink-0">
                      <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${isCurrent ? "text-[#1ed760]" : "text-white"}`}>
                        {track.title}
                      </p>
                      <p className="text-[10px] text-[#b3b3b3] truncate">{track.artist}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#b3b3b3] font-mono pr-2">{track.duration}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Grid: Focus Flow */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-neutral-900">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-3 bg-[#ff6b35] rounded"></span>
              Focus Flow Loops
            </h3>
            <span className="text-[10px] font-mono text-[#b3b3b3]">4 Tracks</span>
          </div>

          <div className="space-y-2.5">
            {STATIC_PLAYLISTS[2].tracks.slice(0, 4).map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;
              return (
                <div
                  key={track.id}
                  onClick={() => onSelectPlaylist(STATIC_PLAYLISTS[2])}
                  className={`flex items-center justify-between p-2.5 rounded-lg bg-[#181818] hover:bg-[#1f1f1f] cursor-pointer transition-colors group ${
                    isCurrent ? "border-l-2 border-[#ff6b35] bg-[#1e1e1e]" : "border-l-2 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-[#b3b3b3] font-mono w-4 text-center">{idx + 1}</span>
                    <div className="w-9 h-9 rounded bg-[#282828] overflow-hidden shrink-0">
                      <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${isCurrent ? "text-[#ff6b35]" : "text-white"}`}>
                        {track.title}
                      </p>
                      <p className="text-[10px] text-[#b3b3b3] truncate">{track.artist}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#b3b3b3] font-mono pr-2">{track.duration}</span>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
