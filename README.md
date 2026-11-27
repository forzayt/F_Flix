# Forza Flix (F-Flix)

A modern, responsive media discovery and streaming aggregator built with **React**, **TypeScript**, **Vite**, and **Electron**.

---

## ⬇️ Download

Get the latest Windows desktop app (no install or build required):

[![Download F-Flix Launcher](https://img.shields.io/badge/Download-Latest%20Launcher-2ea44f?style=for-the-badge&logo=windows)](https://github.com/forzayt/F_Flix/releases/download/V1/F_Flix.Setup.1.0.0.exe)

**[⬇️ Download F_Flix.Setup.1.0.0.exe (Latest)](https://github.com/forzayt/F_Flix/releases/download/V1/F_Flix.Setup.1.0.0.exe)**

> Looking for older or newer builds? See all [Releases](https://github.com/forzayt/F_Flix/releases).

---

## ⚠️ Anti-Piracy & Legal Disclaimer

**Please read this notice carefully before using or contributing to this project.**

1. **No Media Hosting:**
   Forza Flix (F-Flix) does **not** host, store, upload, transcode, or distribute any video files, audio files, or copyrighted media on its own servers or within this repository.

2. **Publicly Indexed Content Only:**
   This application functions strictly as a **client-side interface and search/discovery tool**—similar to a standard web browser or search engine.
   - All movie, TV series, and anime metadata (titles, synopses, cast, posters) is retrieved from public third-party databases (such as TMDB).
   - All playable streams and live TV channels reference **publicly indexed, third-party URLs, embeds, and M3U playlists** already available on the open internet.

3. **No Control Over External Sources:**
   F-Flix is not affiliated with, endorsed by, or responsible for any external third-party content providers. We do not control the availability, accuracy, or legality of external streams, and we do not endorse or promote copyright infringement or piracy.

4. **Anti-Piracy & Copyright Notice (DMCA):**
   We respect intellectual property rights and encourage users to support creators through official, licensed streaming platforms. Because F-Flix does not host or serve any media files, we cannot remove content from external servers. Any copyright inquiries or DMCA takedown requests should be directed to the respective third-party hosting providers or source domains.

---

## 🛠️ Technical Architecture

### 1. Web Frontend Stack
- **Core:** React 18, TypeScript, Vite (`@vitejs/plugin-react-swc`)
- **Routing & State:** `react-router-dom` v6, `@tanstack/react-query`
- **UI & Styling:** Tailwind CSS, `shadcn/ui` (Radix UI primitives), `lucide-react`
- **Media Playback:** `hls.js` for HTTP Live Streaming (`.m3u8`) and sandboxed/embedded player components

### 2. Key Modules (`src/`)
- **Pages (`src/pages/`):**
  - `Index.tsx` (`/`): Featured hero banner and categorized content carousels.
  - `Movies.tsx` (`/movies`), `TVSeries.tsx` (`/tv-series`), `Anime.tsx` (`/anime`): Browsable catalogs with genre filtering (`GenreFilter.tsx`).
  - `Search.tsx` (`/search`): Real-time catalog search.
  - `MovieDetails.tsx` (`/movie/:id`) & `TVDetails.tsx` (`/tv/:id`): Metadata, cast (`CastSection.tsx`), and season/episode views.
  - `Player.tsx` (`/watch/:type/:id`): Unified playback view.
  - `Live.tsx` (`/Live`): Live channel viewer powered by publicly indexed M3U playlists.
- **Services & Constants:**
  - `src/services/tmdb.ts`: Client-side API integration for fetching public media metadata.
  - `src/constants/sources.ts` & `src/constants/livetv.m3u`: Definitions for external third-party source endpoints and live TV playlists.
  - `src/components/HLSPlayer.tsx`, `StreamPlayer.tsx`, `VideoPlayer.tsx`: Modular video player components.
  - `src/components/TVNavigationHandler.tsx`: Keyboard/TV-style directional navigation support.

### 3. Electron Windows Desktop Wrapper (`electron/`)
F-Flix includes a lightweight desktop wrapper in [`electron/main.cjs`](electron/main.cjs) designed for Windows:
- **Dynamic Remote Configuration (Zero Rebuild Updates):**
  On launch, Electron fetches the active web app URL from `https://forzayt.github.io/F_Flix/src/config/url.json` with `cache: 'no-store'`. Whenever the deployment domain changes in `url.json`, the desktop app automatically loads the new URL without requiring a client update or reinstall.
- **No Hardcoded Fallback:**
  If the configuration cannot be reached (e.g., offline or network failure), the app displays a built-in error screen with a **Retry** button rather than falling back to a stale URL.
- **Security & Native UX:**
  - Strict renderer isolation (`nodeIntegration: false`, `contextIsolation: true`, `sandbox: true`).
  - Single-instance lock (`app.requestSingleInstanceLock()`) to prevent duplicate windows.
  - External links (outside the active app hostname) are intercepted and opened in the user's default OS browser.
  - Custom app icon (`electron/icon.ico` / `electron/icon.png`) and hidden menu bar for a clean native feel.

---

## 📁 Project Structure

```text
F_Flix/
├── electron/
│   ├── main.cjs          # Electron main process & dynamic URL loader
│   ├── icon.ico          # Windows application icon
│   └── icon.png          # PNG icon asset
├── public/
│   ├── favicon.ico       # Website favicon (ICO)
│   ├── favicon.png       # Website favicon (PNG)
│   └── logo.jpg          # Brand logo asset
├── src/
│   ├── components/       # UI, player, and navigation components
│   ├── config/
│   │   └── url.json      # Remote target URL configuration
│   ├── constants/        # External source definitions & M3U playlists
│   ├── pages/            # Route views (Home, Movies, TV, Anime, Live, Player)
│   ├── services/         # Public metadata API client (tmdb.ts)
│   └── App.tsx           # Router & provider setup
├── index.html            # Entry HTML with favicon links
└── package.json          # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm

### Installation
```bash
npm install
```

### Running the Web App (Development)
```bash
npm run dev
```

### Building the Web App (Production)
```bash
npm run build
```

### Running the Electron Windows App
```bash
npm run electron
```
> **Just want to use the app?** Skip the build steps and grab the prebuilt installer from [Download](#️-download) above.
> **Windows PowerShell note:** If PowerShell blocks `npm` scripts due to execution policy, run `npm.cmd run electron` instead.
