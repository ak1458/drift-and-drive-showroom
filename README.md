<p align="center"><img src=".github/assets/readme-header.svg" alt="Drift &amp; Drive — Lucknow rental showroom · Fleet selection &amp; local estimates" width="100%" /></p>

# Drift & Drive

Drift & Drive is a photographic car-rental showroom interface for Lucknow. It uses React, TanStack Start, and TypeScript with GSAP reveals and automotive details. The current booking panel calculates a local rental estimate from selected dates and a vehicle. Fleet data is stored in the browser. These boundaries matter: the page is a functional UI prototype, but it does not submit reservations, confirm inventory availability, charge a customer, or provide a server-managed fleet.

[![Stars](https://img.shields.io/github/stars/ak1458/drift-and-drive-showroom?style=flat-square)](https://github.com/ak1458/drift-and-drive-showroom/stargazers)
[![Watching](https://img.shields.io/github/watchers/ak1458/drift-and-drive-showroom?style=flat-square&label=watching)](https://github.com/ak1458/drift-and-drive-showroom/watchers)
[![Forks](https://img.shields.io/github/forks/ak1458/drift-and-drive-showroom?style=flat-square)](https://github.com/ak1458/drift-and-drive-showroom/forks)
[![Activity](https://img.shields.io/github/last-commit/ak1458/drift-and-drive-showroom?style=flat-square)](https://github.com/ak1458/drift-and-drive-showroom/activity)
[![License: Not specified](https://img.shields.io/badge/License-Not%20specified-64748b?style=flat-square)](#license)

**[How it works](#how-it-works) · [Run locally](#run-locally) · [Configuration](#configuration) · [Commands](#development-commands) · [Versions](#versions-and-distribution) · [License](#license)**

## How it works

1. Browse the showroom and fleet cards, then select a vehicle.
2. Choose pickup and return dates in the rental panel.
3. The local pricing helper computes trip days and total based on the selected vehicle’s daily rate.
4. Review or reset the estimate. A confirmed reservation would require a separate backend integration.

## Architecture

| Path | Purpose |
| --- | --- |
| [src/routes/](<src/routes/>) | TanStack page routes and root layout. |
| [src/components/Booking.tsx](<src/components/Booking.tsx>) | Date/vehicle form, validation, and estimate result. |
| [src/lib/fleet.ts](<src/lib/fleet.ts>) | Fleet data, localStorage handling, and price/day rules. |
| [src/test/fleet.test.ts](<src/test/fleet.test.ts>) | Fleet and pricing regression cases. |
| [src/assets/](<src/assets/>) | Photographic fleet/showroom assets. |
| [src/components/ui/](<src/components/ui/>) | Reusable interface primitives. |

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


## Configuration

The core local workflow has no checked-in environment template or required provider key. Browser origin/storage and runtime capabilities still matter. Do not invent cloud credentials to run the basic interface.

## Development commands

Workspace: [package.json](<package.json>). Run these commands from its directory.

| Command | Script defined in manifest |
| --- | --- |
| `npm run dev` | `vite dev` |
| `npm run build` | `vite build` |
| `npm run build:dev` | `vite build --mode development` |
| `npm run preview` | `vite preview` |
| `npm run lint` | `eslint .` |
| `npm run test` | `vitest run` |
| `npm run test:watch` | `vitest` |

These are available commands, not a claim that all checks passed in this documentation pass. Connected checks require the services, credentials, and isolated data described above.

## Operational notes

Use the checked-in Bun lockfile when reproducible Bun installs are desired; npm installation resolves independently without a root npm lockfile. Respect reduced-motion settings when changing GSAP effects. The source is connected to a visual editor and published commits synchronize back there. Avoid rewriting shared history during routine development; editor sync and existing clones rely on that ancestry.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| The fleet differs across browsers | The current fleet store is localStorage, not a shared database. |
| A visitor expects a confirmation email | The current flow produces an estimate only; it does not submit a booking or send email. |
| Animation feels different for a user | Check reduced-motion preference and component mounting before adding global scroll effects. |

## Versions and distribution

No published GitHub Release or version tag was recorded in this snapshot. The default branch is a development/source snapshot; it must not be described as a stable downloadable release merely to populate the sidebar.

GitHub Packages is a separate registry. This README does not imply that a registry package exists; use the installation path documented here rather than an invented package-install command.

## Documentation and maintenance

- [roadmap.md](<roadmap.md>)
- [src/lib/fleet.ts](<src/lib/fleet.ts>)
- [src/components/Booking.tsx](<src/components/Booking.tsx>)

Include the affected workflow, reproduction steps, and relevant check output when reporting a problem. Do not include credentials or live customer data.

## License

No root project license file is included in this snapshot. Reuse rights have not been granted by this README. Obtain the owner’s permission for distribution or reuse; bundled dependencies retain their own licenses and notices.
