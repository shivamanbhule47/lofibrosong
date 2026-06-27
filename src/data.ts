import { Playlist, Track } from "./types";

// Album/Playlist cover assets from generated images
export const COFFEE_SHOP_COVER = "/src/assets/images/lofi_coffee_shop_night_1782564212223.jpg";
export const BEDROOM_CAT_COVER = "/src/assets/images/lofi_bedroom_cat_1782564228666.jpg";
export const VINYL_RECORD_COVER = "/src/assets/images/lofi_vinyl_record_1782564243525.jpg";
export const TRAIN_SUNSET_COVER = "/src/assets/images/lofi_train_sunset_1782564260576.jpg";

// Predefined lofi tracks
export const ALL_LOFI_TRACKS: Track[] = [
  // Playlist 1 tracks: Coffee Shop Night
  {
    id: "track-1",
    title: "Midnight Espresso",
    artist: "Lofi Bros",
    album: "Coffee Shop Sessions",
    duration: "2:45",
    coverUrl: COFFEE_SHOP_COVER,
    vibes: ["Study", "Relax"],
    tempo: 72,
  },
  {
    id: "track-2",
    title: "Cozy Barista",
    artist: "Rainy Day Club",
    album: "Coffee Shop Sessions",
    duration: "3:10",
    coverUrl: COFFEE_SHOP_COVER,
    vibes: ["Relax", "Focus"],
    tempo: 75,
  },
  {
    id: "track-3",
    title: "Rainy Window Pane",
    artist: "Sora & Yuki",
    album: "Coffee Shop Sessions",
    duration: "2:20",
    coverUrl: COFFEE_SHOP_COVER,
    vibes: ["Sleep", "Relax"],
    tempo: 68,
  },
  {
    id: "track-4",
    title: "Warm Cinnamon Latte",
    artist: "Decaf Beats",
    album: "Coffee Shop Sessions",
    duration: "2:55",
    coverUrl: COFFEE_SHOP_COVER,
    vibes: ["Focus", "Study"],
    tempo: 80,
  },
  {
    id: "track-5",
    title: "Steaming Mug Chatter",
    artist: "Cafe Ambient",
    album: "Coffee Shop Sessions",
    duration: "3:05",
    coverUrl: COFFEE_SHOP_COVER,
    vibes: ["Relax", "Study"],
    tempo: 70,
  },

  // Playlist 2 tracks: Bedroom Study / Cat
  {
    id: "track-6",
    title: "Purring by the Glass",
    artist: "Neko Chill",
    album: "Naps & Rain",
    duration: "2:30",
    coverUrl: BEDROOM_CAT_COVER,
    vibes: ["Sleep", "Relax"],
    tempo: 65,
  },
  {
    id: "track-7",
    title: "Nostalgic Bedroom Glow",
    artist: "Sleepy Head",
    album: "Naps & Rain",
    duration: "3:15",
    coverUrl: BEDROOM_CAT_COVER,
    vibes: ["Study", "Sleep"],
    tempo: 70,
  },
  {
    id: "track-8",
    title: "Soft Blankets, Hard Work",
    artist: "Study Buddy",
    album: "Naps & Rain",
    duration: "2:50",
    coverUrl: BEDROOM_CAT_COVER,
    vibes: ["Focus", "Study"],
    tempo: 82,
  },
  {
    id: "track-9",
    title: "Dreaming of Tuna",
    artist: "Neko Chill",
    album: "Naps & Rain",
    duration: "2:40",
    coverUrl: BEDROOM_CAT_COVER,
    vibes: ["Sleep", "Relax"],
    tempo: 60,
  },

  // Playlist 3 tracks: Train Sunset
  {
    id: "track-10",
    title: "Neon Horizon Line",
    artist: "Synth City Lofi",
    album: "Transit Melancholy",
    duration: "3:02",
    coverUrl: TRAIN_SUNSET_COVER,
    vibes: ["Focus", "Relax"],
    tempo: 85,
  },
  {
    id: "track-11",
    title: "Train Window Reflections",
    artist: "Sora & Yuki",
    album: "Transit Melancholy",
    duration: "2:35",
    coverUrl: TRAIN_SUNSET_COVER,
    vibes: ["Study", "Relax"],
    tempo: 78,
  },
  {
    id: "track-12",
    title: "Late Assignment Deadline",
    artist: "Midnight Grader",
    album: "Transit Melancholy",
    duration: "3:20",
    coverUrl: TRAIN_SUNSET_COVER,
    vibes: ["Focus", "Study"],
    tempo: 90,
  },
  {
    id: "track-13",
    title: "Keyboard & Raindrops",
    artist: "Typewriter Club",
    album: "Transit Melancholy",
    duration: "2:48",
    coverUrl: TRAIN_SUNSET_COVER,
    vibes: ["Focus", "Study"],
    tempo: 84,
  },

  // Playlist 4 tracks: Vinyl Classics
  {
    id: "track-14",
    title: "Dusty Analog Grooves",
    artist: "Vinyl Vintage",
    album: "Rhodes & Rust",
    duration: "2:58",
    coverUrl: VINYL_RECORD_COVER,
    vibes: ["Relax", "Focus"],
    tempo: 74,
  },
  {
    id: "track-15",
    title: "Warm Stylus Down",
    artist: "Rhodes Chillout",
    album: "Rhodes & Rust",
    duration: "3:12",
    coverUrl: VINYL_RECORD_COVER,
    vibes: ["Sleep", "Relax"],
    tempo: 66,
  },
  {
    id: "track-16",
    title: "Memory Flutter",
    artist: "Vintage Tape",
    album: "Rhodes & Rust",
    duration: "2:44",
    coverUrl: VINYL_RECORD_COVER,
    vibes: ["Study", "Relax"],
    tempo: 73,
  },
  {
    id: "track-17",
    title: "Subtle Crackle Hum",
    artist: "Atmosphere Project",
    album: "Rhodes & Rust",
    duration: "3:30",
    coverUrl: VINYL_RECORD_COVER,
    vibes: ["Sleep", "Focus"],
    tempo: 60,
  }
];

// Preconfigured Playlists
export const STATIC_PLAYLISTS: Playlist[] = [
  {
    id: "playlist-coffee",
    name: "Midnight Espresso Mix",
    description: "Cozy coffee-shop chatter and warm vinyl beats for rainy evenings.",
    coverUrl: COFFEE_SHOP_COVER,
    accentColor: "#ff6b35", // Warm orange accent
    tracks: ALL_LOFI_TRACKS.filter(t => t.id === "track-1" || t.id === "track-2" || t.id === "track-3" || t.id === "track-4" || t.id === "track-5"),
  },
  {
    id: "playlist-bedroom",
    name: "Cozy Cat & Study Desk",
    description: "Quiet lofi beats to keep you company during late-night projects.",
    coverUrl: BEDROOM_CAT_COVER,
    accentColor: "#1ed760", // Spotify Green
    tracks: ALL_LOFI_TRACKS.filter(t => t.id === "track-6" || t.id === "track-7" || t.id === "track-8" || t.id === "track-9"),
  },
  {
    id: "playlist-train",
    name: "Transit Horizon Mix",
    description: "Dynamic rhythms and neon sunset vibes for your active focus flow.",
    coverUrl: TRAIN_SUNSET_COVER,
    accentColor: "#f3727f", // Soft Red
    tracks: ALL_LOFI_TRACKS.filter(t => t.id === "track-10" || t.id === "track-11" || t.id === "track-12" || t.id === "track-13"),
  },
  {
    id: "playlist-vinyl",
    name: "Vintage Rhodes & Rust",
    description: "Crackles and vintage electronic piano chords recorded straight to tape.",
    coverUrl: VINYL_RECORD_COVER,
    accentColor: "#ffa42b", // Warm Warning Amber
    tracks: ALL_LOFI_TRACKS.filter(t => t.id === "track-14" || t.id === "track-15" || t.id === "track-16" || t.id === "track-17"),
  }
];

// Live underground radio stream
export const LIVE_RADIO_PLAYLIST: Playlist = {
  id: "playlist-radio",
  name: "Lofi Bros Live Radio",
  description: "Continuous broadcasting of the deepest underground lo-fi beats, crackle & rain included.",
  coverUrl: COFFEE_SHOP_COVER,
  accentColor: "#ff6b35",
  isRadio: true,
  tracks: ALL_LOFI_TRACKS,
};

// Mood tags for the Chill Vibes section
export const MOOD_TAGS = [
  { name: "Study", icon: "BookOpen", color: "from-amber-600/20 to-orange-600/10 border-orange-500/20" },
  { name: "Sleep", icon: "Moon", color: "from-indigo-600/20 to-blue-600/10 border-indigo-500/20" },
  { name: "Focus", icon: "Flame", color: "from-emerald-600/20 to-teal-600/10 border-emerald-500/20" },
  { name: "Relax", icon: "Coffee", color: "from-rose-600/20 to-pink-600/10 border-rose-500/20" }
];

// Search page category tiles
export const SEARCH_CATEGORIES = [
  { id: "cat-1", name: "Late Night Coffee", color: "from-orange-800 to-amber-950", cover: COFFEE_SHOP_COVER },
  { id: "cat-2", name: "Rainy Study Nook", color: "from-blue-900 to-indigo-950", cover: BEDROOM_CAT_COVER },
  { id: "cat-3", name: "Vinyl Archive", color: "from-amber-900 to-amber-950", cover: VINYL_RECORD_COVER },
  { id: "cat-4", name: "Commuter Melancholy", color: "from-rose-900 to-purple-950", cover: TRAIN_SUNSET_COVER },
  { id: "cat-5", name: "Lofi Girl Classics", color: "from-teal-800 to-emerald-950", cover: BEDROOM_CAT_COVER },
  { id: "cat-6", name: "Late Night Drive", color: "from-slate-800 to-neutral-950", cover: TRAIN_SUNSET_COVER }
];
