import React, { useState } from "react";
import { 
  Home, 
  Search, 
  Library, 
  Plus, 
  Heart, 
  Radio, 
  User, 
  Sparkles,
  Music4,
  Database
} from "lucide-react";
import { Playlist } from "../types";

interface SidebarProps {
  currentTab: "home" | "search" | "liked" | "playlist" | "creator";
  setCurrentTab: (tab: "home" | "search" | "liked" | "playlist" | "creator") => void;
  playlists: Playlist[];
  selectedPlaylistId: string | null;
  setSelectedPlaylistId: (id: string | null) => void;
  onCreatePlaylist: () => void;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  playlists,
  selectedPlaylistId,
  setSelectedPlaylistId,
  onCreatePlaylist,
}: SidebarProps) {
  return (
    <aside 
      id="lofi-sidebar"
      className="w-[240px] bg-black flex flex-col h-full border-r border-[#1f1f1f] text-sm select-none shrink-0"
    >
      {/* Brand Logo Section */}
      <div className="p-6 pb-4">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => {
            setCurrentTab("home");
            setSelectedPlaylistId(null);
          }}
        >
          <div className="relative">
            <Radio className="w-8 h-8 text-[#1ed760] transition-transform duration-500 group-hover:rotate-12" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1ed760] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1ed760]"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-1 text-xl font-black italic tracking-tighter leading-none">
              <span className="text-[#ff6b35]">LOFI</span>
              <span className="text-white">BROS</span>
            </div>
            <p className="text-[9px] text-[#b3b3b3] font-mono tracking-widest uppercase mt-0.5">Underground FM</p>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="px-3 py-2 space-y-1">
        <button
          id="nav-home"
          onClick={() => {
            setCurrentTab("home");
            setSelectedPlaylistId(null);
          }}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-md font-semibold transition-all duration-200 ${
            currentTab === "home" && !selectedPlaylistId
              ? "text-white bg-[#1f1f1f]" 
              : "text-[#b3b3b3] hover:text-white"
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          id="nav-search"
          onClick={() => {
            setCurrentTab("search");
            setSelectedPlaylistId(null);
          }}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-md font-semibold transition-all duration-200 ${
            currentTab === "search"
              ? "text-white bg-[#1f1f1f]" 
              : "text-[#b3b3b3] hover:text-white"
          }`}
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>

        <button
          id="nav-creator"
          onClick={() => {
            setCurrentTab("creator");
            setSelectedPlaylistId(null);
          }}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-md font-semibold transition-all duration-200 ${
            currentTab === "creator"
              ? "text-white bg-[#ff6b35]/25 border-l-2 border-[#ff6b35]" 
              : "text-[#b3b3b3] hover:text-white"
          }`}
        >
          <Database className="w-5 h-5 text-[#ff6b35]" />
          <span className="flex items-center gap-1.5">
            Creator Studio
            <span className="text-[8px] bg-[#ff6b35]/15 text-[#ff6b35] px-1 py-0.2 rounded uppercase tracking-wider font-mono">Dev</span>
          </span>
        </button>
      </nav>

      {/* Playlist Actions */}
      <div className="px-3 pt-4 border-t border-[#1c1c1c] space-y-2">
        <button
          id="btn-create-playlist"
          onClick={onCreatePlaylist}
          className="w-full flex items-center justify-between gap-3 px-4 py-2 bg-[#1f1f1f] hover:bg-[#282828] text-white font-bold rounded-full uppercase tracking-[1.4px] text-xs transition-colors"
        >
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#1ed760]" />
            New Playlist
          </span>
          <span className="text-[10px] bg-[#2a2a2a] px-1.5 py-0.5 rounded text-[#b3b3b3]">Create</span>
        </button>

        <button
          id="nav-liked"
          onClick={() => {
            setCurrentTab("liked");
            setSelectedPlaylistId(null);
          }}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-md font-semibold transition-all duration-200 ${
            currentTab === "liked"
              ? "text-white bg-[#1f1f1f]" 
              : "text-[#b3b3b3] hover:text-white"
          }`}
        >
          <div className="p-1.5 bg-gradient-to-br from-purple-700 to-indigo-800 rounded-sm">
            <Heart className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <span>Liked Songs</span>
        </button>
      </div>

      {/* Your Library Playlists */}
      <div className="flex-1 flex flex-col min-h-0 px-3 mt-4">
        <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#b3b3b3] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Library className="w-4 h-4" />
            Your Library
          </span>
          <span className="text-[10px] text-[#ff6b35] font-mono font-bold animate-pulse">● LIVE</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1 py-1">
          {playlists.map((playlist) => {
            const isSelected = selectedPlaylistId === playlist.id;
            return (
              <button
                key={playlist.id}
                onClick={() => {
                  setSelectedPlaylistId(playlist.id);
                  setCurrentTab("playlist");
                }}
                className={`w-full text-left px-4 py-2.5 rounded-md flex items-center gap-3 group transition-all duration-150 ${
                  isSelected 
                    ? "bg-[#1f1f1f] text-white" 
                    : "text-[#b3b3b3] hover:bg-[#151515] hover:text-white"
                }`}
              >
                <div className="w-8 h-8 rounded overflow-hidden shrink-0 bg-[#252525] relative flex items-center justify-center">
                  {playlist.coverUrl ? (
                    <img 
                      src={playlist.coverUrl} 
                      alt={playlist.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Music4 className="w-4 h-4 text-[#b3b3b3]" />
                  )}
                  {playlist.isRadio && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#ff6b35] rounded-full border border-[#121212]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-xs truncate">{playlist.name}</p>
                  <p className="text-[10px] text-[#b3b3b3] truncate">
                    {playlist.isRadio ? "Underground Radio" : `${playlist.tracks.length} tracks`}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* User Profile Footer - Geometric Balance Style */}
      <div className="p-3 bg-black border-t border-[#1f1f1f]">
        <div className="flex items-center space-x-3 p-2 bg-[#181818] rounded-full cursor-pointer border border-transparent hover:border-[#282828] transition-all">
          <div className="w-8 h-8 rounded-full bg-[#ff6b35] flex items-center justify-center font-bold text-black text-xs shrink-0">
            LF
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-white truncate leading-tight">Lofi Listener</p>
            <p className="text-[9px] text-[#1ed760] font-mono uppercase tracking-wider">Premium Station</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-[#1ed760] shadow-[0_0_8px_#1ed760] mr-1 shrink-0"></div>
        </div>
      </div>
    </aside>
  );
}
