import React, { useState, useEffect, useMemo } from "react";
import { 
  Plus, 
  X, 
  Sparkles, 
  Music4, 
  FolderPlus, 
  CheckCircle2, 
  HelpCircle,
  Radio,
  FileCheck
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import NowPlayingBar from "./components/NowPlayingBar";
import HomeView from "./components/HomeView";
import SearchView from "./components/SearchView";
import PlaylistView from "./components/PlaylistView";
import CreatorStudioView from "./components/CreatorStudioView";
import { Track, Playlist } from "./types";
import { STATIC_PLAYLISTS, ALL_LOFI_TRACKS, LIVE_RADIO_PLAYLIST } from "./data";
import { lofiAudio } from "./utils/audio";

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<"home" | "search" | "liked" | "playlist" | "creator">("home");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Stateful tracks to support dynamic daily posts and offline-first storage
  const [stationTracks, setStationTracks] = useState<Track[]>(() => {
    const saved = localStorage.getItem("lofi_bros_custom_tracks");
    if (saved) {
      try {
        const custom = JSON.parse(saved) as Track[];
        return [...ALL_LOFI_TRACKS, ...custom];
      } catch (e) {
        console.error("Failed to load custom tracks from storage", e);
      }
    }
    return ALL_LOFI_TRACKS;
  });

  // Dynamically computed live stream playlist
  const radioPlaylist = useMemo(() => {
    return {
      ...LIVE_RADIO_PLAYLIST,
      tracks: stationTracks
    };
  }, [stationTracks]);

  // Playlists and Likes (Durable Cloud/Local persistence using standard Cache/Localstorage)
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem("lofi_bros_playlists");
    return saved ? JSON.parse(saved) : [];
  });

  const [likedTracks, setLikedTracks] = useState<Track[]>(() => {
    const saved = localStorage.getItem("lofi_bros_liked");
    if (saved) return JSON.parse(saved);
    // Seed with 2 default favorite songs
    return [ALL_LOFI_TRACKS[0], ALL_LOFI_TRACKS[5]];
  });

  // Now Playing Core States
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTracksContext, setActiveTracksContext] = useState<Track[]>(ALL_LOFI_TRACKS);

  // Modals & Popups
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDesc, setNewPlaylistDesc] = useState("");
  
  // Custom Track Add Panel
  const [trackToAddToPlaylist, setTrackToAddToPlaylist] = useState<Track | null>(null);

  // Success notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("lofi_bros_playlists", JSON.stringify(userPlaylists));
  }, [userPlaylists]);

  useEffect(() => {
    localStorage.setItem("lofi_bros_liked", JSON.stringify(likedTracks));
  }, [likedTracks]);

  // Toast auto-clear
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Combine static and user playlists for global listing
  const allPlaylists = useMemo(() => {
    return [radioPlaylist, ...STATIC_PLAYLISTS, ...userPlaylists];
  }, [radioPlaylist, userPlaylists]);

  // Handlers for adding and resetting the live lo-fi station tracks
  const handleAddGlobalTrack = (newTrack: Track) => {
    const saved = localStorage.getItem("lofi_bros_custom_tracks");
    const currentCustom = saved ? JSON.parse(saved) : [];
    const updatedCustom = [...currentCustom, newTrack];
    localStorage.setItem("lofi_bros_custom_tracks", JSON.stringify(updatedCustom));
    setStationTracks([...ALL_LOFI_TRACKS, ...updatedCustom]);
    showToast(`Posted: "${newTrack.title}" to dynamic radio!`);
  };

  const handleResetDatabase = () => {
    localStorage.removeItem("lofi_bros_custom_tracks");
    setStationTracks(ALL_LOFI_TRACKS);
    showToast("Station database reset to default lo-fi loops.");
  };

  // Active Selected Playlist object helper
  const selectedPlaylist = useMemo(() => {
    if (currentTab === "liked") {
      const likedPlaylist: Playlist = {
        id: "playlist-liked",
        name: "Liked Songs",
        description: "Your absolute favorite underground lo-fi beats, saved in your local listening station.",
        coverUrl: "/src/assets/images/lofi_bedroom_cat_1782564228666.jpg", // custom cover
        tracks: likedTracks,
        accentColor: "#1db954", // Spotify green
      };
      return likedPlaylist;
    }
    return allPlaylists.find((p) => p.id === selectedPlaylistId) || null;
  }, [currentTab, selectedPlaylistId, allPlaylists, likedTracks]);

  // Audio Playback Triggers
  const handlePlayTrack = (track: Track, tracksContext: Track[]) => {
    setCurrentTrack(track);
    setActiveTracksContext(tracksContext);
    setIsPlaying(true);
    lofiAudio.play(track);
    showToast(`Now playing: ${track.title}`);
  };

  const handlePlayPauseToggle = () => {
    if (!currentTrack) {
      // Play first track available in current context if none playing
      if (activeTracksContext.length > 0) {
        handlePlayTrack(activeTracksContext[0], activeTracksContext);
      }
      return;
    }

    const nextPlaying = !isPlaying;
    setIsPlaying(nextPlaying);
    if (nextPlaying) {
      lofiAudio.play(currentTrack);
    } else {
      lofiAudio.pause();
    }
  };

  const handleNext = () => {
    if (activeTracksContext.length === 0) return;
    const currentIndex = activeTracksContext.findIndex((t) => t.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % activeTracksContext.length;
    handlePlayTrack(activeTracksContext[nextIndex], activeTracksContext);
  };

  const handlePrevious = () => {
    if (activeTracksContext.length === 0) return;
    const currentIndex = activeTracksContext.findIndex((t) => t.id === currentTrack?.id);
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = activeTracksContext.length - 1;
    handlePlayTrack(activeTracksContext[prevIndex], activeTracksContext);
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    if (playlist.tracks.length === 0) {
      showToast("This station has no tracks to play.");
      return;
    }
    handlePlayTrack(playlist.tracks[0], playlist.tracks);
  };

  // Toggle Like Status
  const handleToggleLike = (track: Track) => {
    const isAlreadyLiked = likedTracks.some((t) => t.id === track.id);
    if (isAlreadyLiked) {
      setLikedTracks(likedTracks.filter((t) => t.id !== track.id));
      showToast("Removed from Liked Songs");
    } else {
      setLikedTracks([...likedTracks, track]);
      showToast("Added to Liked Songs");
    }
  };

  // Helper helper to show brief status message
  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Create custom Playlist
  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    // Pick a random cover photo from our beautiful generated ones
    const coverPhotos = [
      "/src/assets/images/lofi_coffee_shop_night_1782564212223.jpg",
      "/src/assets/images/lofi_bedroom_cat_1782564228666.jpg",
      "/src/assets/images/lofi_vinyl_record_1782564243525.jpg",
      "/src/assets/images/lofi_train_sunset_1782564260576.jpg"
    ];
    const randomCover = coverPhotos[Math.floor(Math.random() * coverPhotos.length)];

    const newPlaylist: Playlist = {
      id: `user-playlist-${Date.now()}`,
      name: newPlaylistName,
      description: newPlaylistDesc || "A cozy collection of curated underground lo-fi beats.",
      coverUrl: randomCover,
      tracks: [],
      accentColor: "#ff6b35", // Brand warm tone accent
    };

    setUserPlaylists([...userPlaylists, newPlaylist]);
    setNewPlaylistName("");
    setNewPlaylistDesc("");
    setIsCreateModalOpen(false);

    // Auto-select and navigate to newly created playlist
    setSelectedPlaylistId(newPlaylist.id);
    setCurrentTab("playlist");
    showToast(`Created playlist "${newPlaylist.name}"!`);
  };

  // Delete Custom Playlist
  const handleDeletePlaylist = (playlistId: string) => {
    setUserPlaylists(userPlaylists.filter((p) => p.id !== playlistId));
    setCurrentTab("home");
    setSelectedPlaylistId(null);
    showToast("Playlist deleted.");
  };

  // Remove song from custom playlist
  const handleRemoveTrackFromPlaylist = (playlistId: string, trackId: string) => {
    setUserPlaylists(
      userPlaylists.map((p) => {
        if (p.id === playlistId) {
          return {
            ...p,
            tracks: p.tracks.filter((t) => t.id !== trackId),
          };
        }
        return p;
      })
    );
    showToast("Removed song from playlist.");
  };

  // Add song to custom playlist workflow
  const handleAddTrackToPlaylist = (playlistId: string) => {
    if (!trackToAddToPlaylist) return;

    const playlist = userPlaylists.find((p) => p.id === playlistId);
    if (!playlist) return;

    // Check if song is already in the playlist to prevent duplicates
    if (playlist.tracks.some((t) => t.id === trackToAddToPlaylist.id)) {
      showToast("This beat is already in the playlist.");
      setTrackToAddToPlaylist(null);
      return;
    }

    setUserPlaylists(
      userPlaylists.map((p) => {
        if (p.id === playlistId) {
          return {
            ...p,
            tracks: [...p.tracks, trackToAddToPlaylist],
          };
        }
        return p;
      })
    );

    showToast(`Added to "${playlist.name}"!`);
    setTrackToAddToPlaylist(null);
  };

  // Trigger quick vibe selector
  const handleSelectVibe = (vibeName: string) => {
    setSearchQuery(vibeName);
    setCurrentTab("search");
    setSelectedPlaylistId(null);
  };

  return (
    <div 
      id="lofi-bros-app"
      className="flex flex-col h-screen w-screen bg-[#121212] overflow-hidden text-white font-sans select-none relative"
    >
      
      {/* 1. Main View Body (Sidebar + Content Space) */}
      <div className="flex flex-1 min-h-0 relative">
        
        {/* Sidebar Left Navigation */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          playlists={allPlaylists}
          selectedPlaylistId={selectedPlaylistId}
          setSelectedPlaylistId={setSelectedPlaylistId}
          onCreatePlaylist={() => setIsCreateModalOpen(true)}
        />

        {/* Content Area Space with scroll */}
        <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-[#1f1f1f] to-[#121212] overflow-hidden relative">
          
          {/* Subtle Dynamic Top Utility Navigation Rail */}
          <header className="h-14 px-8 flex items-center justify-between border-b border-[#1f1f1f] shrink-0 select-none bg-black/40 backdrop-blur-md z-30">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono tracking-widest text-[#b3b3b3]">LOFI BROS RADIO NETWORK</span>
              <span className="px-2 py-0.5 bg-[#1ed760]/10 text-[#1ed760] font-mono text-[9px] font-bold rounded">ONLINE STABLE</span>
            </div>

            {/* Quick Helper Button */}
            <div className="flex items-center gap-4">
              <div 
                className="text-xs text-[#b3b3b3] hover:text-white flex items-center gap-1.5 cursor-pointer"
                onClick={() => {
                  // Preload random nice song
                  const randomTrack = ALL_LOFI_TRACKS[Math.floor(Math.random() * ALL_LOFI_TRACKS.length)];
                  handlePlayTrack(randomTrack, ALL_LOFI_TRACKS);
                }}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ff6b35]" />
                <span>Surprise Mix</span>
              </div>
            </div>
          </header>

          {/* Render Active View Tab screen */}
          {currentTab === "home" && !selectedPlaylistId && (
            <HomeView
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayPlaylist={handlePlayPlaylist}
              onSelectPlaylist={(playlist) => {
                setSelectedPlaylistId(playlist.id);
                setCurrentTab("playlist");
              }}
              onSelectVibe={handleSelectVibe}
            />
          )}

          {currentTab === "search" && (
            <SearchView
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={handlePlayTrack}
              likedTracks={likedTracks}
              onToggleLike={handleToggleLike}
              onSelectVibe={handleSelectVibe}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              stationTracks={stationTracks}
            />
          )}

          {currentTab === "playlist" && selectedPlaylist && (
            <PlaylistView
              playlist={selectedPlaylist}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayPlaylist={handlePlayPlaylist}
              onPlayTrack={handlePlayTrack}
              likedTracks={likedTracks}
              onToggleLike={handleToggleLike}
              onRemoveTrackFromPlaylist={handleRemoveTrackFromPlaylist}
              onDeletePlaylist={handleDeletePlaylist}
              isCustomPlaylist={userPlaylists.some((p) => p.id === selectedPlaylistId)}
            />
          )}

          {currentTab === "liked" && (
            <PlaylistView
              playlist={selectedPlaylist!}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayPlaylist={handlePlayPlaylist}
              onPlayTrack={handlePlayTrack}
              likedTracks={likedTracks}
              onToggleLike={handleToggleLike}
              onRemoveTrackFromPlaylist={() => {}}
            />
          )}

          {currentTab === "creator" && (
            <CreatorStudioView
              onAddGlobalTrack={handleAddGlobalTrack}
              onResetDatabase={handleResetDatabase}
              tracks={stationTracks}
            />
          )}

          {/* Quick Custom Track Selector Trigger Floating Icon */}
          {!currentTrack && currentTab !== "creator" && (
            <div className="absolute inset-0 flex items-center justify-center p-10 pointer-events-none">
              <div className="bg-[#1a1a1a]/95 border border-[#2c1f19] rounded-2xl p-6 text-center shadow-2xl max-w-sm pointer-events-auto animate-bounce duration-[3000]">
                <Radio className="w-10 h-10 text-[#ff6b35] mx-auto mb-3 animate-spin duration-1000" />
                <h3 className="font-bold text-sm text-white mb-1">Interactive Radio Station</h3>
                <p className="text-xs text-[#b3b3b3] mb-4 leading-normal">
                  Click on any playlist card or select a mood chip to begin streaming beautiful procedural lo-fi chords, rain hum, and vintage vinyl static.
                </p>
                <button
                  onClick={() => handlePlayPlaylist(STATIC_PLAYLISTS[0])}
                  className="px-5 py-2.5 bg-[#1ed760] text-black font-extrabold text-xs uppercase tracking-wider rounded-full hover:scale-105 active:scale-95 transition-all"
                >
                  Quick Start Playback
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 2. Interactive Bottom Playing Deck Control Bar */}
      <NowPlayingBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPauseToggle={handlePlayPauseToggle}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isLiked={currentTrack ? likedTracks.some((t) => t.id === currentTrack.id) : false}
        onToggleLike={handleToggleLike}
      />

      {/* --- MODAL DIALOGS --- */}

      {/* Create custom playlist overlay dialog */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <form 
            onSubmit={handleCreatePlaylist}
            className="w-full max-w-md bg-[#181818] border border-[#282828] rounded-2xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#242424]">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-[#ff6b35]" />
                Create Cozy Playlist
              </h3>
              <button 
                type="button" 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-[#b3b3b3] hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#b3b3b3] uppercase tracking-wider">Playlist Title</label>
              <input
                type="text"
                required
                maxLength={40}
                placeholder="My Coffee Reading Vibes"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="w-full bg-[#1f1f1f] border border-[#333] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff6b35] transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#b3b3b3] uppercase tracking-wider">Short description (Optional)</label>
              <textarea
                placeholder="A warm tape-saturated background playlist for books and notebooks."
                maxLength={100}
                value={newPlaylistDesc}
                onChange={(e) => setNewPlaylistDesc(e.target.value)}
                rows={3}
                className="w-full bg-[#1f1f1f] border border-[#333] rounded-lg p-4 text-sm text-white focus:outline-none focus:border-[#ff6b35] transition-colors resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#b3b3b3] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1ed760] hover:bg-[#1db954] text-black font-extrabold text-xs uppercase tracking-wider rounded-full transition-all hover:scale-105 active:scale-95"
              >
                Create Station
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Status Toast Success message */}
      {toastMessage && (
        <div className="fixed bottom-28 left-6 bg-[#1f1f1f] border border-[#2b2b2b] px-4 py-3 rounded-lg flex items-center gap-2 text-xs font-semibold text-white shadow-2xl z-50 animate-fade-in animate-slide-up">
          <CheckCircle2 className="w-4.5 h-4.5 text-[#1ed760]" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
