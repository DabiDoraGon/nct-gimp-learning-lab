# THIRD_PARTY_LICENSES — NCT GIMP Learning Lab (Prototype 01)

This document records the licensing status of every third-party asset shipped
with this educational prototype. Update it whenever an asset is added or
replaced.

## Icon policy (important)

This prototype does **NOT** ship any official GIMP icon assets yet.

GIMP's own icon themes ship inside the GIMP source tree, which is licensed
under GPL-3.0-or-later. In principle that license permits redistribution of
the icon files with corresponding license attribution. However, as of this
prototype each individual SVG asset has NOT been verified for embedding here
(per-file license headers, "Default" vs "Legacy" theme variants, and GIMP
trademark/logo guidance, including the Wilber mascot, which is intentionally
NOT used anywhere in this app).

Because of that, all icons currently rendered are **temporary placeholders**
and the app must never present them as official GIMP icons.

## 1. Icons currently used: Lucide (temporary placeholders)

- Source: https://lucide.dev/
- Package: lucide-react
- License: ISC License — Copyright (c) Lucide contributors
  (based on Feather Icons, MIT — Copyright (c) 2013-2017 Cole Bemis)
- Usage status: TEMPORARY placeholders only. NOT official GIMP icons.
- Replacement path: all icons flow through the independent registry at
  `src/assets/iconRegistry.ts`. To switch to verified GIMP icons later,
  verify each SVG in the GIMP source (icons/Default/), add the files under
  `src/assets/gimp-icons/`, then update the registry entries — no component
  changes needed.

## 2. Libraries

| Library          | License     | Source                              |
|------------------|-------------|-------------------------------------|
| React            | MIT         | https://react.dev/                  |
| Vite             | MIT         | https://vitejs.dev/                 |
| Tailwind CSS     | MIT         | https://tailwindcss.com/            |
| Fabric.js        | MIT         | http://fabricjs.com/                |
| lucide-react     | ISC         | https://lucide.dev/                 |
| @supabase/supabase-js | MIT    | https://supabase.com/               |

## 3. Trademark notice

GIMP and the Wilber mascot are part of the GIMP project's identity. This
application is an independent educational simulation built for students of
Trường THPT Nguyễn Công Trứ and is NOT an official GIMP product, nor
affiliated with or endorsed by the GIMP team.
