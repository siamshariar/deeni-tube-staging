# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run lint     # ESLint
npm run start    # serve production build
```

There is no test suite. TypeScript build errors are suppressed (`typescript.ignoreBuildErrors: true` in `next.config.mjs`) — the project relies on ESLint rather than tsc for code quality.

## Stack

- **Next.js 14** (App Router), **TypeScript**, **Tailwind CSS v3**
- **shadcn/ui** (Radix UI primitives) — components live in `components/ui/`
- **lucide-react** for icons, **next-themes** for dark/light mode, **sonner** for toasts
- No backend, no API routes, no database — all data is static mock data

## Architecture

### Layout shell

`app/layout.tsx` composes the full shell in this order:

```
HeaderProvider
  AppHeader          (fixed top, 56px, z-40)
  DesktopSidebar     (fixed left, 240px/72px, z-30, hidden on video/playlist/signin pages)
  AppShell           (<main> that offsets left-padding to match sidebar width)
    {children}
  MobileNav          (fixed bottom bar, mobile only, hidden on detail/fullscreen pages)
```

**AppShell** (`components/app-shell.tsx`) dynamically sets `md:pl-[240px]` or `md:pl-[72px]` on `<main>` by reading sidebar width from `window.__sidebarGetState`. The desktop sidebar and AppShell both listen to the custom `"sidebar-state-change"` window event to stay in sync.

### Sidebar communication (global window pattern)

The desktop sidebar exposes two globals set in a `useEffect`:

- `window.__sidebarToggle()` — toggles collapsed state; called only by the hamburger in `AppHeader`
- `window.__sidebarGetState()` — returns current `isCollapsed` boolean

Sidebar state is persisted to `localStorage` key `'sidebar-collapsed'`. The sidebar reads this on mount to restore state across navigations. The header hamburger button toggles the desktop sidebar on pages that have one, and opens the mobile sidebar overlay on pages that don't (`/videos/*`, `/playlists/*`, `/signin`).

### Data layer

All data is static TypeScript arrays in `lib/`:

| File | Contents |
|---|---|
| `lib/video-data.ts` | `VideoItem[]` — main feed videos with YouTube video IDs |
| `lib/shorts-data.ts` | Shorts feed data |
| `lib/mock-data.ts` | Channels and scholars for listing pages |
| `lib/channel-data.ts` | Sidebar channel list |
| `lib/scholar-data.ts` | Sidebar scholar list |
| `lib/playlist-data.ts` | Static playlist definitions |

All videos are YouTube embeds using `<iframe src="https://www.youtube.com/embed/{videoId}?...">`. On the Shorts page, iframes include `enablejsapi=1` and are controlled via the YouTube postMessage protocol (see Shorts page section below). On all other pages, `isPlaying` state is UI-only and does not control the iframe.

### User state via localStorage

All user-generated state is persisted directly to `localStorage`:

| Key | Contents |
|---|---|
| `'sidebar-collapsed'` | Desktop sidebar state |
| `'deeni-lang-prefs'` | Auth/guest status (`{ isGuest: boolean }`) |
| `'recentSearches'` | Search history array |
| `'deeni-playlists-list'` | User playlist metadata |
| `'playlist_videos_{id}'` | Per-playlist video items |

The `hooks/usePlaylists.ts`, `hooks/useLikedVideos.ts`, and `hooks/useWatchLater.ts` hooks encapsulate the localStorage read/write pattern.

### Shorts page (`app/shorts/page.tsx`)

The most complex file (~1400 lines), entirely `"use client"`. Key layout mechanics:

- **Scroll container**: `position: fixed; inset: 0; top: 56px` with `overflow-y-scroll snap-y snap-mandatory`
- **Each section**: `h-[calc(100vh-56px)]` on mobile (full screen), `h-[calc(100vh-80px)]` on desktop (leaves 24px of next video peeking at bottom)
- **Video container**: `h-full md:h-[calc(100%-4px)] md:mt-0.5 md:aspect-[9/16]` — 2px gaps top/bottom on desktop; aspect ratio enforces 9:16
- **Mobile iframe cover**: CSS class `.shorts-video-iframe` uses `position: absolute; height: 100%; aspect-ratio: 9/16; min-width: 100%; transform: translate(-50%, -50%)` to cover any portrait container without letterboxing
- **Scroll detection**: `scrollend` event (Chrome/Firefox) with a 250ms debounced fallback; a 500ms `useEffect([currentIndex])` safety net guarantees controls always appear after a video switch
- **Controls visibility**: gated on `isActive && !isScrolling` for the current video; `(isHovered || isActive) && !isScrolling` for top controls
- **YouTube postMessage protocol**: iframes use `enablejsapi=1`. After each iframe loads (`onLoad` + 500ms delay) and on every `currentIndex` change (1000ms delay), a `{ event: 'listening', id }` message is sent to the iframe to register as a listener. YouTube then sends periodic `infoDelivery` messages containing `currentTime` and `duration`, which drive the progress bar. Play/pause sends `{ event: 'command', func: 'playVideo'/'pauseVideo' }`. Seek sends `{ event: 'command', func: 'seekTo', args: [seconds, true] }`. All postMessage calls target `'https://www.youtube.com'`.
- **Progress bar**: `absolute bottom-0` inside the video container, 3px tall, red fill. `videoCurrentTime`/`videoDuration` state is reset to 0 on every video switch. `videoDurationRef` (a ref mirroring `videoDuration`) is used inside mouse/touch drag closures to avoid stale state captures. Drag-to-seek wires `mousemove`/`mouseup` on `window` and `touchmove` on the bar element.

### Contexts

`app/contexts/header-context.tsx` provides `{ headerVisible, setHeaderVisible }` — used by the Shorts page to auto-hide the header and by `AppHeader`/`DesktopSidebar` to slide up/down.

### Theming

CSS custom properties defined in `app/globals.css` for all colour tokens (`--background`, `--foreground`, `--primary`, etc.). Tailwind uses these via `hsl(var(--...))` mappings in `tailwind.config.ts`. Dark mode is toggled via the `class` strategy (`next-themes`).

### Route patterns

- `/` — home feed
- `/videos/[slug]/[id]` — video detail (no desktop sidebar, full-width player)
- `/playlists/[slug]/[id]` — playlist detail (no desktop sidebar)
- `/shorts` — vertical shorts feed (fullscreen, header auto-hides)
- `/channels/[slug]`, `/scholars/[slug]`, `/categories/[slug]` — entity detail pages
- `/signin` — auth page (no desktop sidebar)
