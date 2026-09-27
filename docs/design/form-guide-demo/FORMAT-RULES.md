# .dc.html artboard rules (Design canvas). Breaking any of these fails SILENTLY.

Each artboard is ONE self-contained file `project/<Name>.dc.html`. Exact skeleton:

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Short screen name</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<style>
body{margin:0;font-family:...}
/* @keyframes and page-level CSS go here */
</style>
</helmet>
<div style="width: 390px; height: 844px; box-sizing: border-box; ...">
  ... markup ...
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"theme":{"editor":"enum","options":["silent-black","paper","ember","emerald","midnight"],"default":"silent-black"},"$preview":{"width":390,"height":844}}'>
class Component extends DCLogic {
  renderVals() {
    return { /* flat values, arrays, handlers */ };
  }
}
</script>
</body>
</html>
```

## Rules that bite
- Keep `<script src="./support.js"></script>` in head EXACTLY.
- Close every non-void element; quote every attribute.
- The root element has a FIXED size equal to the board (390×844 for phones) and the same `$preview`.
- Inline `style="…"` is what the properties panel edits. `<helmet><style>` holds page basics, `@keyframes`, and `a`/`a:hover` colours.
- Lay out sibling groups with flex or grid plus `gap`. Grids: `display:grid; grid-template-columns: repeat(N, minmax(0, 1fr))`.
- `{{hole}}` is a DOTTED LOOKUP ONLY into `renderVals()`, never an expression. `{{a + b}}`, `{{!x}}` and `{{fn()}}` all fail silently. Compute in `renderVals()` and expose the result by name.
- Attributes: `x="literal"` gives a string; `x="{{path}}"` gives the raw value; `x="a {{p}} b"` interpolates a string. `class` and `for` are fine.
- Always include the `<script type="text/x-dc" data-dc-script>` block: classic JS, `class Component extends DCLogic`, no imports or exports, no TypeScript. You get `this.props`, `this.state`, `this.setState`, `forceUpdate`, and React class lifecycle (`componentDidMount`, `componentWillUnmount`) but NOT `render()`. Initialise state in `constructor(props){ super(props); this.state = {...}; }`.
- ALL UI is `<x-dc>` markup. Never build UI from script (`innerHTML`, `appendChild`, your own `window.X` components).
- `data-props` is single-quoted JSON. Inside it: `&amp;` for `&`, `&#39;` for a literal single quote, `\"` for a double quote.
- Declare few tweaks (levers, not copy). Here: `theme` (enum), maybe `speed`. Never make copy a prop.
- No network, except an optional Google Fonts `css2` `<link>` in `<helmet>`. No `<iframe>`, `<object>` or `<embed>`. No global keydown handlers. No emoji: icons are inline stroke `<svg>`.
- Copy the viewer might retype stays literal markup.

## Syntax card
- **Events:** `onClick="{{ pick }}"`, where `pick` is a function returned from `renderVals()`. Per-item handlers go on the loop items in `renderVals()`: `items: xs.map(x => ({...x, pick: () => this.setState({picked: x.id})}))`, then `onClick="{{ item.pick }}"` inside `<sc-for>`.
- **Branches:** `<sc-if value="{{ cond }}" hint-placeholder-val="{{ true }}">…</sc-if>`. There's no else, so use a second sc-if with the precomputed opposite flag.
- **Loops:** `<sc-for list="{{ items }}" as="item" hint-placeholder-count="3">…{{ item.x }} {{ $index }}…</sc-for>`.
- **Conditional styling:** precompute per-item style strings or flags in `renderVals()`. A style hole is acceptable for live, state-driven values (selection, play state, zoom transform) and for the declared `theme` tweak (the CSS custom properties on the root).
- **Child components:** `<dc-import name="About" theme="paper" hint-size="390px,844px"></dc-import>` mounts sibling `About.dc.html`, and every other attribute becomes a prop (`this.props.theme`). Never self-close and never use capitalised tags. Avoid a prop called `name`.
- **Links between artboards:** `<a href="About.dc.html">…</a>` moves Play to that artboard. Style the `<a>` itself as the button, because a `<button>` inside it swallows the click.
- Put `lang` on `<html>` and give each artboard its own `<title>`.

## Craft rules (from the canvas type)
- No filler, invented stats or lorem ipsum.
- Accessible as drawn: real `<button>` elements, and `aria-label` on icon-only buttons. Text contrast is 4.5:1 (3:1 at 24px+). Touch targets are at least 44px. Colours that must be told apart also differ in lightness.
- No fake status bars, no gradient washes, no left-border cards, no emoji.

## Animation technique that works in this format
- Inline `<svg>` in the markup. Joints are nested `<g>` groups, and each group carries a class whose `@keyframes` live in `<helmet><style>`.
- Rotate about a joint with `transform-box: view-box; transform-origin: <x>px <y>px;` in viewBox units.
- Play and pause: a CSS custom property on the player root, set from state through a style hole, e.g. `style="--play: {{playState}}; --dur: {{dur}}s"`. Every animated element uses `animation-play-state: var(--play); animation-duration: var(--dur);`.
- Restart (Replay after the bounded reps end): swap between two identical keyframe sets (`name-a` / `name-b`) through a precomputed `animation-name` string from state. Get the reps count from `animationend` on a ref, or from a timer in the logic class (clear it in `componentWillUnmount`).
- Reduced motion: `@media (prefers-reduced-motion: reduce)` shows the static key poses instead, never a blank.
