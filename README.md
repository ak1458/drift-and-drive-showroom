# Drift & Drive

A car-rental showroom interface for Lucknow, with photographic sections, scroll animation, fleet selection, and a local rental estimator.

[![React: UI](https://img.shields.io/badge/React-UI-149ECA?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript: Typed](https://img.shields.io/badge/TypeScript-Typed-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TanStack: Start](https://img.shields.io/badge/TanStack-Start-F97316?style=flat-square)](package.json)

[Pricing rules](src/lib/fleet.ts) · [Roadmap](roadmap.md)

## What is here

- Responsive showroom sections and GSAP reveal animations.
- Fleet selection and day-based price estimates.
- Browser-local fleet data, theme controls, and reduced-motion support.
- Vitest coverage for the fleet and pricing rules.

## Run locally

```bash
git clone https://github.com/ak1458/drift-and-drive-showroom.git
cd drift-and-drive-showroom
npm install
npm run dev
```

The repository includes a Bun lockfile; use `bun install --frozen-lockfile` if you want to follow that dependency lock instead of npm resolution.

## Engineering notes

`src/routes/` holds pages; `src/components/Booking.tsx` handles the estimator; `src/lib/fleet.ts` contains fleet and pricing rules. Available checks: `npm test`, `npm run lint`, and `npm run build`.

**Current scope:** estimates are calculated locally. No reservation is submitted, no availability is confirmed, and no payment is collected. A booking backend is future work.

Repository changes sync to the connected visual editor. Preserve published Git history when working on that integration.

## License

No license file is currently included. Reuse permissions have not been specified.
