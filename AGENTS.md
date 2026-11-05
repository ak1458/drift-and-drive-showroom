<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The showroom uses photographic full-width sections and scoped GSAP reveals with reduced-motion support; the superseded fixed driving-car layer is not mounted.
- Shared navigation and fleet imagery are browser-safe modules; booking is a local rental estimate, not a submitted reservation, until a backend is added.
- Fleet is stored in browser localStorage (src/lib/fleet.ts) until a backend is added; pricing/day rules live there and are covered by src/test/fleet.test.ts.
