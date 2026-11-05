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

- The scrolling car + smoke live in one fixed layer (src/components/DrivingCar.tsx) driven by a single ScrollTrigger timeline on #journey; booking talks to it via window events `car:launch` / `car:return` so sections never own the car.
- Fleet is stored in browser localStorage (src/lib/fleet.ts) until a backend is added; pricing/day rules live there and are covered by src/test/fleet.test.ts.
