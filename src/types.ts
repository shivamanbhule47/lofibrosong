export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string; // e.g. "2:45"
  coverUrl: string;
  audioUrl?: string; // Optional audio file link, we will also have procedural audio fallback
  genre?: string;
  vibes?: string[];
  tempo?: number; // BPM
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  tracks: Track[];
  accentColor?: string; // e.g. "#ff6b35" for warm orange
  isRadio?: boolean;
}

export interface PlaybackState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number; // in seconds
  duration: number; // in seconds
  volume: number; // 0 to 1
  playlistId: string | null;
  trackIndex: number;
  isLooping: boolean;
  isShuffled: boolean;
}
