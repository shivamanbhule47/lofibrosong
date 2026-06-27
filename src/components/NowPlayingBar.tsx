import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Heart, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Repeat, 
  Shuffle,
  Laptop,
  Maximize2,
  CloudRain,
  Radio,
  Tv,
  Sparkles
} from "lucide-react";
import { Track } from "../types";
import { lofiAudio } from "../utils/audio";

interface NowPlayingBarProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayPauseToggle: () => void;
  onNext: () => void;
  onPrevious: () => void;
  isLiked: boolean;
  onToggleLike: (track: Track) => void;
}

export default function NowPlayingBar({
  currentTrack,
  isPlaying,
  onPlayPauseToggle,
  onNext,
  onPrevious,
  isLiked,
  onToggleLike,
}: NowPlayingBarProps) {
  // Volume state
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  
  // Custom lofi volumes
  const [rainVol, setRainVol] = useState(0.3);
  const [vinylVol, setVinylVol] = useState(0.4);
  const [synthVol, setSynthVol] = useState(0.6);

  // Playback timer variables
  const [currentTime, setCurrentTime] = useState(0);
  const [trackDurationSec, setTrackDurationSec] = useState(165); // Default 2:45 is 165 seconds
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  // Mixer toggle
  const [isMixerOpen, setIsMixerOpen] = useState(false);

  // Calculate track durations on change
  useEffect(() => {
    if (currentTrack) {
      const parts = currentTrack.duration.split(":");
      const mins = parseInt(parts[0]) || 2;
      const secs = parseInt(parts[1]) || 45;
      setTrackDurationSec(mins * 60 + secs);
      setCurrentTime(0);
    }
  }, [currentTrack]);

  // Audio simulation timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= trackDurationSec) {
            if (isLooping) {
              return 0; // Loop song
            } else {
              clearInterval(timer);
              // Trigger next track after a tiny delay
              setTimeout(() => {
                onNext();
              }, 300);
              return prev;
            }
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, trackDurationSec, isLooping, onNext]);

  // Sync initial audio volumes on load
  useEffect(() => {
    lofiAudio.setVolume(isMuted ? 0 : volume);
    lofiAudio.setRainVolume(rainVol);
    lofiAudio.setVinylVolume(vinylVol);
    lofiAudio.setSynthVolume(synthVol);
  }, []);

  // Format second counts to mm:ss format
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Sound Adjustment Handlers
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    lofiAudio.setVolume(val);
  };

  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    lofiAudio.setVolume(newMuted ? 0 : volume);
  };

  const handleRainVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setRainVol(val);
    lofiAudio.setRainVolume(val);
  };

  const handleVinylVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVinylVol(val);
    lofiAudio.setVinylVolume(val);
  };

  const handleSynthVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSynthVol(val);
    lofiAudio.setSynthVolume(val);
  };

  // Seeker Click
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseInt(e.target.value));
  };

  const progressPercentage = (currentTime / trackDurationSec) * 100;

  return (
    <div 
      id="now-playing-bar"
      className="h-24 bg-[#181818] border-t border-[#282828] px-6 flex items-center justify-between select-none relative z-40 shrink-0"
    >
      {/* LEFT: Currently Playing Track Info */}
      <div className="flex items-center w-[30%] min-w-[180px] gap-4">
        {currentTrack ? (
          <>
            <div className="w-14 h-14 rounded-md overflow-hidden bg-[#282828] relative group shrink-0 shadow-lg">
              <img 
                src={currentTrack.coverUrl} 
                alt={currentTrack.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                <CloudRain className="w-4 h-4 text-[#ff6b35] animate-pulse" />
              </div>
            </div>
            <div className="min-w-0">
              <h4 className="text-white text-sm font-bold truncate hover:underline cursor-pointer">
                {currentTrack.title}
              </h4>
              <p className="text-[#b3b3b3] text-xs truncate hover:underline hover:text-white cursor-pointer">
                {currentTrack.artist}
              </p>
            </div>
            <button
              onClick={() => onToggleLike(currentTrack)}
              className="text-[#b3b3b3] hover:text-white transition-colors p-1"
              title={isLiked ? "Remove from Liked Songs" : "Like Song"}
            >
              <Heart 
                className={`w-5 h-5 transition-transform active:scale-125 ${
                  isLiked ? "text-[#1ed760] fill-[#1ed760]" : ""
                }`} 
              />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-md bg-[#222] border border-dashed border-[#333] flex items-center justify-center text-xs text-[#555]">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#b3b3b3]">No track active</p>
              <p className="text-[10px] text-zinc-600">Select a lo-fi beat to start</p>
            </div>
          </div>
        )}
      </div>

      {/* CENTER: Playback Controls and Seeker */}
      <div className="flex flex-col items-center w-[40%] max-w-[600px]">
        {/* Button Controls */}
        <div className="flex items-center gap-6 mb-2">
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`transition-colors p-1 ${isShuffle ? "text-[#1ed760]" : "text-[#b3b3b3] hover:text-white"}`}
            title="Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={onPrevious}
            className="text-[#b3b3b3] hover:text-white transition-colors p-1"
            title="Previous Beat"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Large Circular Green Play Button */}
          <button
            onClick={onPlayPauseToggle}
            className="w-10 h-10 rounded-full bg-[#1ed760] hover:bg-[#1fdf68] active:scale-95 transition-all flex items-center justify-center text-black"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-black text-black" />
            ) : (
              <Play className="w-5 h-5 fill-black text-black ml-0.5" />
            )}
          </button>

          <button
            onClick={onNext}
            className="text-[#b3b3b3] hover:text-white transition-colors p-1"
            title="Next Beat"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`transition-colors p-1 ${isLooping ? "text-[#1ed760]" : "text-[#b3b3b3] hover:text-white"}`}
            title="Repeat"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Seeker */}
        <div className="w-full flex items-center gap-3 text-xs text-[#b3b3b3] font-mono">
          <span className="w-10 text-right">{formatTime(currentTime)}</span>
          <div className="flex-1 relative group flex items-center">
            <input
              type="range"
              min="0"
              max={trackDurationSec}
              value={currentTime}
              onChange={handleSeekChange}
              className="w-full h-1 bg-[#4d4d4d] rounded-lg appearance-none cursor-pointer outline-none accent-[#1ed760] group-hover:bg-[#5e5e5e] transition-colors"
              style={{
                background: `linear-gradient(to right, #1ed760 0%, #1ed760 ${progressPercentage}%, #4d4d4d ${progressPercentage}%, #4d4d4d 100%)`
              }}
            />
          </div>
          <span className="w-10 text-left">{formatTime(trackDurationSec)}</span>
        </div>
      </div>

      {/* RIGHT: Volume, Active Station Indicator & Ambient Sliders */}
      <div className="flex items-center justify-end w-[30%] min-w-[180px] gap-4 relative">
        {/* Real-time Atmospheric Live pulse indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#1f1f1f] rounded-full border border-orange-500/10 shrink-0 select-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6b35] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff6b35]"></span>
          </span>
          <span className="text-[10px] text-[#ff6b35] font-bold font-mono tracking-wide uppercase">LOFI RADIO</span>
        </div>

        {/* Custom Ambient Mixer Dropdown Trigger */}
        <div className="relative">
          <button
            onClick={() => setIsMixerOpen(!isMixerOpen)}
            className={`p-2 rounded-full transition-all flex items-center justify-center ${
              isMixerOpen ? "bg-[#ff6b35] text-black" : "bg-[#1f1f1f] text-[#b3b3b3] hover:text-white hover:bg-[#282828]"
            }`}
            title="Lofi Atmosphere Mixer"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* IMMERSIVE ATMO MIXER WINDOW */}
          {isMixerOpen && (
            <div className="absolute bottom-14 right-0 w-[260px] bg-[#1a1a1a] border border-[#2b2b2b] rounded-xl p-4 shadow-2xl z-50 text-white animate-fade-in">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#282828]">
                <div className="flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4 text-[#ff6b35]" />
                  <span className="text-xs font-bold uppercase tracking-wider">Atmosphere Mixer</span>
                </div>
                <span className="text-[10px] bg-[#ff6b35]/20 text-[#ff6b35] px-1.5 py-0.5 rounded font-mono">RADIO EQ</span>
              </div>

              {/* Slider 1: Cozy Rain Noise */}
              <div className="space-y-1 mb-3">
                <div className="flex items-center justify-between text-xs text-[#b3b3b3]">
                  <span>Cozy Rain Noise</span>
                  <span className="font-mono text-[10px]">{Math.round(rainVol * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={rainVol}
                  onChange={handleRainVolumeChange}
                  className="w-full h-1 bg-[#4d4d4d] rounded-lg appearance-none cursor-pointer outline-none accent-[#ff6b35]"
                  style={{
                    background: `linear-gradient(to right, #ff6b35 0%, #ff6b35 ${rainVol * 100}%, #4d4d4d ${rainVol * 100}%, #4d4d4d 100%)`
                  }}
                />
              </div>

              {/* Slider 2: Vintage Vinyl Crackle */}
              <div className="space-y-1 mb-3">
                <div className="flex items-center justify-between text-xs text-[#b3b3b3]">
                  <span>Vinyl Crackles & Pops</span>
                  <span className="font-mono text-[10px]">{Math.round(vinylVol * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={vinylVol}
                  onChange={handleVinylVolumeChange}
                  className="w-full h-1 bg-[#4d4d4d] rounded-lg appearance-none cursor-pointer outline-none accent-[#ff6b35]"
                  style={{
                    background: `linear-gradient(to right, #ff6b35 0%, #ff6b35 ${vinylVol * 100}%, #4d4d4d ${vinylVol * 100}%, #4d4d4d 100%)`
                  }}
                />
              </div>

              {/* Slider 3: Cozy Synth Instrument Volume */}
              <div className="space-y-1 mb-4">
                <div className="flex items-center justify-between text-xs text-[#b3b3b3]">
                  <span>Chill Synth Chords</span>
                  <span className="font-mono text-[10px]">{Math.round(synthVol * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={synthVol}
                  onChange={handleSynthVolumeChange}
                  className="w-full h-1 bg-[#4d4d4d] rounded-lg appearance-none cursor-pointer outline-none accent-[#1ed760]"
                  style={{
                    background: `linear-gradient(to right, #1ed760 0%, #1ed760 ${synthVol * 100}%, #4d4d4d ${synthVol * 100}%, #4d4d4d 100%)`
                  }}
                />
              </div>

              <div className="bg-[#242424] p-2 rounded-lg flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-[#1ed760] shrink-0" />
                <p className="text-[10px] text-[#b3b3b3] leading-snug">
                  This mixer generates real-time audio components directly in your browser. Crank up the rain to study!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Master Volume controls */}
        <div className="flex items-center gap-2 group w-24">
          <button 
            onClick={handleToggleMute}
            className="text-[#b3b3b3] hover:text-white transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-full h-1 bg-[#4d4d4d] rounded-lg appearance-none cursor-pointer outline-none accent-[#1ed760]"
            style={{
              background: `linear-gradient(to right, #1ed760 0%, #1ed760 ${(isMuted ? 0 : volume) * 100}%, #4d4d4d ${(isMuted ? 0 : volume) * 100}%, #4d4d4d 100%)`
            }}
          />
        </div>

        {/* Standard audio deck utilities */}
        <button className="text-[#b3b3b3] hover:text-white transition-colors hidden sm:block" title="Devices">
          <Laptop className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
