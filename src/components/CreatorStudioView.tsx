import React, { useState, useEffect } from "react";
import { 
  Database, 
  Copy, 
  Check, 
  Download, 
  Plus, 
  Trash2, 
  Github, 
  Globe, 
  Sparkles, 
  Search, 
  FileText, 
  BookOpen, 
  Music, 
  CheckCircle2 
} from "lucide-react";
import { Track } from "../types";

interface CreatorStudioViewProps {
  onAddGlobalTrack: (track: Track) => void;
  onResetDatabase: () => void;
  tracks: Track[];
}

export default function CreatorStudioView({ 
  onAddGlobalTrack, 
  onResetDatabase, 
  tracks 
}: CreatorStudioViewProps) {
  // Input Form States
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("Underground Sessions");
  const [duration, setDuration] = useState("2:50");
  const [vibe, setVibe] = useState("Relax");
  const [tempo, setTempo] = useState(70);
  const [coverUrl, setCoverUrl] = useState("");

  const [activeGuideTab, setActiveGuideTab] = useState<"github" | "seo" | "posts">("github");
  const [copiedDb, setCopiedDb] = useState(false);
  const [copiedSeo, setCopiedSeo] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  // Auto-generate some safe generic lo-fi art when url is blank
  const handleAddTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artist) return;

    const defaultCovers = [
      "/src/assets/images/lofi_coffee_shop_night_1782564212223.jpg",
      "/src/assets/images/lofi_bedroom_cat_1782564228666.jpg",
      "/src/assets/images/lofi_vinyl_record_1782564243525.jpg",
      "/src/assets/images/lofi_train_sunset_1782564260576.jpg"
    ];
    const finalCover = coverUrl.trim() || defaultCovers[Math.floor(Math.random() * defaultCovers.length)];

    const newTrack: Track = {
      id: `track-custom-${Date.now()}`,
      title: title.trim(),
      artist: artist.trim(),
      album: album.trim() || "Underground Sessions",
      duration: duration.trim() || "3:00",
      coverUrl: finalCover,
      vibes: [vibe],
      tempo: Number(tempo) || 70,
    };

    onAddGlobalTrack(newTrack);
    
    // Reset fields
    setTitle("");
    setArtist("");
    setCoverUrl("");
  };

  // Export tracks database code string
  const generateTypeScriptCode = () => {
    const formatted = tracks.map(t => {
      return `  {
    id: ${JSON.stringify(t.id)},
    title: ${JSON.stringify(t.title)},
    artist: ${JSON.stringify(t.artist)},
    album: ${JSON.stringify(t.album)},
    duration: ${JSON.stringify(t.duration)},
    coverUrl: ${t.coverUrl.startsWith("/src/") ? t.coverUrl.replace("/src/", "./") : JSON.stringify(t.coverUrl)},
    vibes: ${JSON.stringify(t.vibes || ["Relax"])},
    tempo: ${t.tempo || 70}
  }`;
    }).join(",\n");

    return `// Paste this complete array inside your "/src/data.ts" file to freeze updates!
export const ALL_LOFI_TRACKS: Track[] = [
${formatted}
];`;
  };

  // Generate JSON-LD Schema structured metadata markup for search engines
  const generateSchemaLD = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "MusicPlaylist",
      "name": "Lofi Bros Underground Radio",
      "description": "Continuous broadcasting of deep underground lo-fi beats, rain hum, and vintage vinyl static.",
      "numTracks": tracks.length,
      "genre": "Lofi Hip Hop / Chillhop",
      "track": tracks.slice(0, 8).map((t, idx) => ({
        "@type": "MusicRecording",
        "position": idx + 1,
        "name": t.title,
        "byArtist": {
          "@type": "MusicGroup",
          "name": t.artist
        },
        "duration": `PT${t.duration.split(":")[0]}M${t.duration.split(":")[1]}S`
      }))
    };

    return JSON.stringify(schema, null, 2);
  };

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredTracks = tracks.filter(t => 
    t.title.toLowerCase().includes(searchFilter.toLowerCase()) || 
    t.artist.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div id="creator-studio-view" className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#121212]">
      
      {/* HEADER HERO ACCENT BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#201511] via-[#1c1a27] to-[#111915] p-8 rounded-2xl border border-[#2b251f] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ff6b35]/10 text-[#ff6b35] rounded-full text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Bros Creator Studio
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white italic">
            LOFI BROADCAST & SEO SUITE
          </h1>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Manage your daily lo-fi music queue, construct SEO-friendly schema metadata, and export production-ready static databases designed to load lightning fast on **GitHub Pages**.
          </p>
        </div>
        <div className="flex gap-3">
          <a 
            href="https://github.com/shivamanbhule47/lofibrosong"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 text-xs font-bold text-white uppercase tracking-wider rounded-full hover:bg-neutral-800 transition-all cursor-pointer"
          >
            <Github className="w-4 h-4" />
            My GitHub Repo
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN - INTERACTIVE STATION DATABASE POSTING FORM (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#181818] border border-[#232323] rounded-2xl p-6 shadow-md">
            <h2 className="text-lg font-black text-white flex items-center gap-2.5 mb-5 uppercase tracking-wide">
              <Plus className="w-5 h-5 text-[#ff6b35]" />
              Post a New Cozy Beat
            </h2>

            <form onSubmit={handleAddTrack} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Track Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lavender Sleep Desk"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-[#2b2b2b] rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff6b35] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Lofi Artist / Project *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rainy Day Club"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-[#2b2b2b] rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff6b35] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Album / Compilation</label>
                  <input
                    type="text"
                    placeholder="e.g. Midnight Espresso"
                    value={album}
                    onChange={(e) => setAlbum(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-[#2b2b2b] rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff6b35] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 2:45"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-[#2b2b2b] rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff6b35] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Tempo (BPM)</label>
                  <input
                    type="number"
                    min={40}
                    max={140}
                    value={tempo}
                    onChange={(e) => setTempo(Number(e.target.value))}
                    className="w-full bg-[#1e1e1e] border border-[#2b2b2b] rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff6b35] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Vibe Atmospheric mood</label>
                  <select
                    value={vibe}
                    onChange={(e) => setVibe(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-[#2b2b2b] rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff6b35] transition-colors"
                  >
                    <option value="Study">📚 Study Vibe</option>
                    <option value="Sleep">🌙 Sleep Vibe</option>
                    <option value="Focus">🔥 Focus Vibe</option>
                    <option value="Relax">☕ Relax Vibe</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Cover Art URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="Leave blank for automatic lo-fi visuals"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-[#2b2b2b] rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff6b35] transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={onResetDatabase}
                  className="px-4 py-2 bg-red-950/40 hover:bg-red-900/30 text-red-400 border border-red-900/40 text-xs font-bold uppercase rounded-full transition-colors cursor-pointer"
                >
                  Reset to Defaults
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#ff6b35] hover:bg-[#ff7b4b] text-black font-extrabold text-xs uppercase tracking-wider rounded-full transition-all hover:scale-105"
                >
                  Post Track to Station
                </button>
              </div>
            </form>
          </div>

          {/* ACTIVE LIVE STATION SENSOR AND SEARCH */}
          <div className="bg-[#181818] border border-[#232323] rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-md font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#1ed760]" />
                  Active Station Playlist Database
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  You have <span className="text-[#ff6b35] font-mono font-bold">{tracks.length}</span> lo-fi loops live in memory.
                </p>
              </div>
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Filter station tracks..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="bg-[#222] border border-[#2d2d2d] rounded-full text-xs pl-8 pr-4 py-1.5 text-white w-full focus:outline-none"
                />
              </div>
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-1.5 pr-2 scrollbar-thin">
              {filteredTracks.map((track) => (
                <div 
                  key={track.id} 
                  className="flex items-center justify-between p-2 bg-[#1e1e1e] hover:bg-[#252525] rounded-xl border border-[#282828] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={track.coverUrl} 
                      alt="" 
                      className="w-10 h-10 rounded-lg object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{track.title}</h4>
                      <p className="text-[10px] text-neutral-400">{track.artist} • <span className="font-mono text-[9px] uppercase text-[#ff6b35]">{track.vibes?.[0]}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
                    <span>{track.duration}</span>
                    <span className="text-[10px] text-[#1ed760]">{track.tempo} BPM</span>
                  </div>
                </div>
              ))}
              {filteredTracks.length === 0 && (
                <p className="text-xs text-center text-neutral-500 py-6">No matching tracks found.</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - CODE EXPORTER & STEP BY STEP GUIDES (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* STATIC EXPORTER MODULE */}
          <div className="bg-[#181818] border border-[#232323] rounded-2xl p-5 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#ff6b35]" />
                Static DB Export for Git
              </h3>
              <button
                onClick={() => copyToClipboard(generateTypeScriptCode(), setCopiedDb)}
                className="flex items-center gap-1 text-[10px] bg-[#222] hover:bg-[#333] border border-[#333] px-2.5 py-1 rounded font-bold uppercase text-white transition-all cursor-pointer"
              >
                {copiedDb ? <Check className="w-3 h-3 text-[#1ed760]" /> : <Copy className="w-3 h-3" />}
                {copiedDb ? "Copied!" : "Copy code"}
              </button>
            </div>
            <p className="text-[11px] text-neutral-400">
              Paste this in <code className="text-white bg-neutral-900 px-1 py-0.5 rounded text-[10px]">/src/data.ts</code> to update the tracks permanently in your repository.
            </p>
            <div className="bg-black/80 rounded-xl p-3 border border-neutral-900 max-h-[160px] overflow-y-auto">
              <pre className="text-[10px] font-mono text-neutral-300 leading-normal select-all">
                {generateTypeScriptCode()}
              </pre>
            </div>
          </div>

          {/* INTERACTIVE COMPREHENSIVE ROADMAP GUIDE */}
          <div className="bg-[#181818] border border-[#232323] rounded-2xl p-6 shadow-md space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wide flex items-center gap-2 border-b border-neutral-800 pb-3">
              <BookOpen className="w-4.5 h-4.5 text-[#ff6b35]" />
              LOFI STATION ROADMAP & SEO GUIDE
            </h3>

            {/* TAB SYSTEM */}
            <div className="flex border-b border-neutral-800 gap-1.5">
              <button
                onClick={() => setActiveGuideTab("github")}
                className={`flex-1 text-center pb-2 text-[10px] font-bold uppercase tracking-wider transition-all border-b-2 ${
                  activeGuideTab === "github" 
                    ? "text-[#1ed760] border-[#1ed760]" 
                    : "text-neutral-500 border-transparent hover:text-white"
                }`}
              >
                1. Deployment
              </button>
              <button
                onClick={() => setActiveGuideTab("seo")}
                className={`flex-1 text-center pb-2 text-[10px] font-bold uppercase tracking-wider transition-all border-b-2 ${
                  activeGuideTab === "seo" 
                    ? "text-[#1ed760] border-[#1ed760]" 
                    : "text-neutral-500 border-transparent hover:text-white"
                }`}
              >
                2. SEO Engine
              </button>
              <button
                onClick={() => setActiveGuideTab("posts")}
                className={`flex-1 text-center pb-2 text-[10px] font-bold uppercase tracking-wider transition-all border-b-2 ${
                  activeGuideTab === "posts" 
                    ? "text-[#1ed760] border-[#1ed760]" 
                    : "text-neutral-500 border-transparent hover:text-white"
                }`}
              >
                3. Daily Posts
              </button>
            </div>

            {/* TAB CONTENT: GITHUB PAGES DEPLOYMENT */}
            {activeGuideTab === "github" && (
              <div className="space-y-4 text-xs text-neutral-300 leading-relaxed">
                <div>
                  <h4 className="font-bold text-white mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#ff6b35]" />
                    Setting Up sub-directory Routing
                  </h4>
                  <p className="text-[11px] text-neutral-400">
                    Since you are deploying to <code className="text-white">https://shivamanbhule47.github.io/lofibrosong/</code>, ensure your Vite configurations include the repository base prefix.
                  </p>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 font-mono text-[10px] text-neutral-400 mt-2 space-y-1">
                    <p className="text-white">// vite.config.ts</p>
                    <p>export default defineConfig({`{`}</p>
                    <p className="text-[#1ed760]">  base: "/lofibrosong/",</p>
                    <p>  plugins: [react()],</p>
                    <p>{`})`}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-[#1ed760]" />
                    Deploying with a single CLI command
                  </h4>
                  <p className="text-[11px] text-neutral-400">
                    Install the official <code className="text-white">gh-pages</code> node package as a development helper:
                  </p>
                  <pre className="bg-neutral-900 text-white rounded p-2 text-[10px] font-mono mt-1.5 select-all">
                    npm install gh-pages --save-dev
                  </pre>
                  <p className="text-[11px] text-neutral-400 mt-2">
                    Add deployment commands to your <code className="text-white">package.json</code> scripts:
                  </p>
                  <div className="bg-neutral-900 text-neutral-400 rounded p-2 text-[10px] font-mono mt-1.5">
                    <p>"predeploy": "npm run build",</p>
                    <p className="text-white">"deploy": "gh-pages -d dist"</p>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-2">
                    Run <code className="text-white">npm run deploy</code> to build and upload your site instantly to the GitHub pages branch!
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: SEARCH ENGINE OPTIMIZATION (SEO) */}
            {activeGuideTab === "seo" && (
              <div className="space-y-4 text-xs text-neutral-300 leading-relaxed">
                <div>
                  <h4 className="font-bold text-white mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1ed760]" />
                    Real-time Schema.org Markup
                  </h4>
                  <p className="text-[11px] text-neutral-400">
                    Google indexes dynamic single page apps beautifully when they contain highly structured metadata inside a JSON-LD block. Copy this code block and place it inside the <code className="text-white">&lt;head&gt;</code> of your <code className="text-white">index.html</code>:
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-t-lg border-b-0">
                    <span className="text-[9px] font-mono font-bold text-neutral-400">JSON-LD Metadata</span>
                    <button
                      onClick={() => copyToClipboard(generateSchemaLD(), setCopiedSeo)}
                      className="text-[9px] font-bold text-[#ff6b35] hover:underline"
                    >
                      {copiedSeo ? "Copied!" : "Copy Schema"}
                    </button>
                  </div>
                  <div className="bg-neutral-900 border border-[#2b2b2b] rounded-b-lg p-3 max-h-[140px] overflow-y-auto">
                    <pre className="text-[10px] font-mono text-[#ff6b35]">
                      {generateSchemaLD()}
                    </pre>
                  </div>
                </div>

                <div className="bg-[#ff6b35]/5 border border-[#ff6b35]/20 p-3 rounded-lg">
                  <h5 className="font-bold text-[11px] text-[#ff6b35] mb-1">💡 SEO Key Ranking Tip</h5>
                  <p className="text-[10px] text-neutral-300 leading-normal">
                    Update the metadata description inside your <code className="text-white">index.html</code> title tags to match search words like <em>"Lo-fi radio"</em>, <em>"Cozy coding beats"</em>, and <em>"No-copyright beats underground station"</em>.
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: DAILY POSTING FORMULA */}
            {activeGuideTab === "posts" && (
              <div className="space-y-4 text-xs text-neutral-300 leading-relaxed">
                <div className="space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-[#ff6b35]" />
                    How to Add Daily Posts Regularly
                  </h4>
                  <p className="text-[11px] text-neutral-400 leading-normal">
                    To make search engines index new updates daily, treat your lo-fi station like a live publication. 
                  </p>
                </div>

                <ul className="space-y-2.5 text-[11px] text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-[#ff6b35] font-black">01.</span>
                    <div>
                      <strong className="text-white">Open Creator Studio Tab:</strong> Type the song title and artist. Set its vibes/tempo, then tap <strong>Post Track to Station</strong> to instantly test it in the player.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ff6b35] font-black">02.</span>
                    <div>
                      <strong className="text-white">Copy the Static DB Code:</strong> From the top card, click <strong>"Copy code"</strong>. It captures all of your tracks formatted into high-performance TypeScript.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ff6b35] font-black">03.</span>
                    <div>
                      <strong className="text-white">Commit the Update:</strong> Replace `/src/data.ts` in your code and run <code>npm run deploy</code>. Your site goes live on GitHub Pages, and Google crawlers immediately pick up the new musical addition!
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
