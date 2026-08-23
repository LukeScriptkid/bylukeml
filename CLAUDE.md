# CLAUDE.md — bylukeml (Portfolio Site)

## Project
- **What:** Luke's network architect themed portfolio site
- **Stack:** React 19 + TypeScript + Vite 7 + Tailwind CSS v4 + Framer Motion 12 + Lucide React
- **Structure:** `src/components/`, `src/hooks/`, `src/constants.ts`, `src/App.tsx`
- **Live:** https://lukescriptkid.github.io/bylukeml/
- **Repo:** LukeScriptkid/bylukeml

## Commands
- `npm run dev` — start Vite dev server
- `npm run build` — TypeScript check + Vite production build
- `npm run lint` — run ESLint
- `npm run preview` — preview production build locally

## Deployment
- GitHub Actions → GitHub Pages
- Pushes to main auto-deploy

## Rules
- All source files should have detailed comments
- Code quality score target: 9+/10
- Keep animations subtle and performant
- Portfolio should reflect network engineering / CCNA → CCIE career direction
- Dark mode is the default; light mode activated via .light class on html
- Theme colors: baby blue accent (#7dd3fc), deep dark backgrounds
- Fonts: JetBrains Mono (terminal/headings), Inter (body text)
