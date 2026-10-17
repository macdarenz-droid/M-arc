# Lite UI support on the GT 6 and the page budget

Raw research output (agents, 2026-10-17). Paths under /tmp/... were the watch lane session's scratch folder; its tools are now in native/wear/tools/redteam.

```json
{
 "support": {
  "features": [
   {
    "feature": "div (flex container, onclick, border-radius, background-color)",
    "supported": "yes",
    "gt6_seen": true,
    "evidence": "Engine: ACE/src/core/components/component_factory.h:96 (K_DIV); div_component.cpp:227-255 (flex-direction, justify-content, align-items, flex-wrap). GT 6: HW/pages/index/index.hml:52,77,83 (div onclick), HW/pages/index/index.css:321,362,409 (border-radius 75/42/32 px on divs with background-color); M-arc app index.hml:1 (div with bound background-color, ran in device run D1, native/wear/README.md:170).",
    "notes": "A div with border-radius = height/2 plus a centred text is how the GT 6 app draws its pill buttons (HW .btn in detail.css, .small-btn, .toast)."
   },
   {
    "feature": "stack (overlay, children placed by left/top)",
    "supported": "yes",
    "gt6_seen": true,
    "evidence": "Engine: component_factory.h:99 (K_STACK); component.cpp:588-592 applies top/left as SetY/SetX. GT 6: HW/pages/index/index.hml:1 (root stack), index.css:387-388 (.dots top 430px left 193px), .toast top/left inside the stack.",
    "notes": "Use a stack to put the M/ARC + clock header or dots over a swiper."
   },
   {
    "feature": "text",
    "supported": "yes",
    "gt6_seen": true,
    "evidence": "Engine: text_component.cpp:96-125 (color, letter-spacing, text-align, font-size, font-family, text-overflow, line-height). Doc: DOC/js-components-basic-text.md:36-57. GT 6: every HW page; M-arc hello and 1.1.x pages.",
    "notes": "Every text needs a fixed width and height or it is cut off or invisible (HW CLAUDE.md 'Elemente wachsen nicht mit dem Inhalt'); text_component.cpp OnViewAttached picks clip/wrap/stretch from which of width/height is set. Wrap happens only when height is not set."
   },
   {
    "feature": "input type=button (font-size, color, background-color)",
    "supported": "yes",
    "gt6_seen": true,
    "evidence": "Engine: input_button_component.cpp:75 (font-size), :87 (background-color), :121-136 (:active pressed colour). Schema: SDK lite_component_map.js input type enum button/checkbox/password/radio/text. GT 6: M-arc native/wear/hello index.hml/.btn (background-color #2f7bf5, font-size 22px) and app index.css .b/.cb, both used in device runs (native/wear/README.md:145-149,170).",
    "notes": "Type cannot change at runtime (DOC/js-components-basic-input.md:19)."
   },
   {
    "feature": "border-radius on input type=button",
    "supported": "yes",
    "gt6_seen": false,
    "evidence": "Engine: input_button_component.cpp:106-112 applies K_BORDER_RADIUS to both PRESSED and RELEASED states. Doc: DOC/js-components-basic-input.md:62. Compiles: PROBE probe.css .pill border-radius 22px -> compiled \"borderRadius\":22.",
    "notes": "Not used by any app known to run on the GT 6. Rounded div + text is the device-proven alternative."
   },
   {
    "feature": "background-color on buttons (static and bound)",
    "supported": "yes",
    "gt6_seen": true,
    "evidence": "Engine: input_button_component.cpp:119-136 (sets both button states). GT 6: M-arc index.hml last line style=\"background-color: {{cb}}\" on input (1.1.x device runs); hello .btn #2f7bf5.",
    "notes": "':active' pseudo-class compiles to \"backgroundColor:active\" (PROBE probe.js) and the engine uses it as the pressed colour (input_button_component.cpp:121); not seen on the GT 6."
   },
   {
    "feature": "image (PNG)",
    "supported": "yes",
    "gt6_seen": true,
    "evidence": "Engine: component_factory.h:102, image_component.cpp:59 (src). GT 6: HW/pages/index/index.hml:26-27,35-36,54,78-84 (PNG icons). Build: build-lite-bin.sh step 2 converts PNG/JPG with img2bin.",
    "notes": "Use a small PNG for the check mark in 'Saved' instead of the U+2713 glyph (non-ASCII in .hml fails check-lite-js; font coverage unverified)."
   },
   {
    "feature": "swiper (horizontal paging, index binding, onchange, loop=false)",
    "supported": "yes",
    "gt6_seen": true,
    "evidence": "Engine: swiper_component.cpp:55-83 (duration, loop, index, vertical), :136 (change). Schema: lite_component_map.js swiper attrs index/loop/duration/vertical, events change. GT 6: HW/pages/index/index.hml:4 <swiper index=\"{{page}}\" loop=\"false\" onchange=\"onSwipe\">.",
    "notes": "A list cannot be a direct child of a swiper: compile ERROR 'tag swiper not support child tag list' (PROBE build.log); a list inside a div inside the swiper compiles. Huawei guide: swiper supports the crown after focus is set (SCRATCH/hw/lwguide_en.txt:212)."
   },
   {
    "feature": "swiper vertical paging",
    "supported": "yes",
    "gt6_seen": false,
    "evidence": "Engine: swiper_component.cpp:78-83 (K_VERTICAL -> SetDirection). Doc: DOC/js-components-container-swiper.md:22 (cannot be changed at runtime). Compiles: PROBE probe.js 'vertical' : true.",
    "notes": "Only horizontal paging is device-proven."
   },
   {
    "feature": "swiper indicator (built-in dots, indicator attribute or indicator-* styles)",
    "supported": "no",
    "gt6_seen": false,
    "evidence": "swiper_component.cpp has no indicator code (grep 'indicator' = 0 hits); lite schema has no indicator attr (compile WARNING 'tag swiper use customize attr indicator', PROBE build4.log); HW CLAUDE.md: 'keine indicator-* am swiper'. Doc swiper.md:22 mentions a 'vertical indicator' but no attribute or style controls it.",
    "notes": "Draw your own dots: divs with border-radius and bound background-color in a stack (HW index.hml dots block, index.css:387-397)."
   },
   {
    "feature": "progress type=arc",
    "supported": "yes",
    "gt6_seen": true,
    "evidence": "Engine: circle_progress_component.cpp:76 (percent), :164-192 (center-x/y, radius, start-angle, total-angle, color, stroke-width, background-color). GT 6: HW/pages/index/index.hml:8-10, index.css:41-55 (ring with bound color).",
    "notes": "Good for a rest-countdown ring around the 466 px edge."
   },
   {
    "feature": "progress type=horizontal",
    "supported": "yes",
    "gt6_seen": false,
    "evidence": "Engine: horizon_progress_component.cpp:76-91 (stroke-width, color, background-color). Doc: DOC/js-components-basic-progress.md:19 (type cannot change at runtime). Compiles: PROBE probe.js.",
    "notes": ""
   },
   {
    "feature": "marquee",
    "supported": "yes",
    "gt6_seen": false,
    "evidence": "Engine: component_factory.h:173, marquee_component.cpp:51-55 (scrollamount, scrolldelay). Schema: lite_component_map.js marquee attrs scrollamount. Doc: DOC/js-components-basic-marquee.md:19,39-41. Compiles: PROBE probe.js.",
    "notes": "Could scroll long exercise names; not proven on the GT 6."
   },
   {
    "feature": "list / list-item",
    "supported": "yes",
    "gt6_seen": true,
    "evidence": "Engine: component_factory.h:141-144. Schema: list children list-item; list-item parents list. GT 6: HW/pages/detail/detail.hml and settings.hml (list with for, if and onclick rows).",
    "notes": "For the later session screen (4)."
   },
   {
    "feature": "if directive",
    "supported": "yes",
    "gt6_seen": true,
    "evidence": "Schema: lite_component_map.js liteCommonTag attrs if/elif/else/for/show. GT 6: HW/pages/index/index.hml:15-27; M-arc index.hml (if on input and div).",
    "notes": ""
   },
   {
    "feature": "elif / else",
    "supported": "yes",
    "gt6_seen": false,
    "evidence": "Schema: liteCommonTag elif/else. PROBE probe.js: compiles to plain _i() calls with combined conditions (b&&!a, !b&&!a), the same runtime call as if.",
    "notes": "Same runtime path as if, so low risk."
   },
   {
    "feature": "show directive",
    "supported": "yes",
    "gt6_seen": false,
    "evidence": "Schema: liteCommonTag show. Engine: component.cpp:415 (K_SHOW). PROBE probe.js compiles to attrs show function.",
    "notes": ""
   },
   {
    "feature": "for directive",
    "supported": "yes",
    "gt6_seen": true,
    "evidence": "Schema: liteCommonTag for. GT 6: HW/pages/detail/detail.hml list-item for=\"{{rows}}\" with $item.",
    "notes": ""
   },
   {
    "feature": "class binding class=\"{{x}}\"",
    "supported": "no",
    "gt6_seen": false,
    "evidence": "Compile ERROR 'in tag text class selector does not support data binding' (PROBE build4.log, neg.hml:2); HW CLAUDE.md says the same.",
    "notes": "Selected pill state must come from style=\"background-color: {{x}}\" or if."
   },
   {
    "feature": "per-element style binding style=\"prop: {{x}}\"",
    "supported": "yes",
    "gt6_seen": true,
    "evidence": "Compiles to dynamicStyle (PROBE probe.js). GT 6: color and background-color bindings in HW/pages/index/index.hml:10,13,37,55,63 and the dots; M-arc index.hml (color, background-color). Dynamic font-size binding is in Huawei's own guide (SCRATCH/hw/lwguide_en.txt:163-207, fontSize '30px' -> '38px').",
    "notes": "Bound left/width: HW avoids binding widths ('Keine Breiten per style-Bindung'); left binding compiles (PROBE dot) but is unverified on device."
   },
   {
    "feature": "onclick on div",
    "supported": "yes",
    "gt6_seen": true,
    "evidence": "Engine: component.cpp:1624 (K_CLICK, common to all components). GT 6: HW/pages/index/index.hml:52,77,83; detail/settings rows.",
    "notes": ""
   },
   {
    "feature": "onclick on text",
    "supported": "yes",
    "gt6_seen": false,
    "evidence": "Engine: component.cpp:1624 (common events). Doc: DOC/js-components-basic-text.md:29 (click). Compiles: PROBE probe.js text onBubbleEvents click.",
    "notes": "Prefer a larger div touch target around the text."
   },
   {
    "feature": "swipe event (onswipe, direction left/right/up/down)",
    "supported": "yes",
    "gt6_seen": true,
    "evidence": "Engine: component.cpp:1632 (K_SWIPE). Doc: DOC/js-common-events.md:11,18. GT 6: M-arc native/wear/hello index.hml:1 <div onswipe>; native/wear/README.md:145 'Swipes left, up, down and right all reach the app; a right swipe does not close it.'",
    "notes": "longpress, touchstart/move/end/cancel and key are also in liteCommonTag events."
   },
   {
    "feature": "font-size",
    "supported": "yes",
    "gt6_seen": true,
    "evidence": "Engine stores it as uint8_t (text_component.h:91, input_button_component.h:79) from an int32 (component.h:543), so 1-255 px; 300px compiles without error but would wrap. ui_lite Text::SetFont (arkui_ui_lite frameworks/common/text.cpp:150-168): vector font takes any size; bitmap font needs an exact (name,size) entry (frameworks/font/ui_font_bitmap.cpp:113-129). graphic_config.h:121-132: LiteOS-M default is vector font on, bitmap off. GT 6 sizes in use: HW 18,20,22,23,24,26,28,30,32,36,42,44,124 px (index.css:102 124px); M-arc 20,22,26,40 px (device run D1).",
    "notes": "No fixed-size list was found anywhere. Thirteen sizes, including odd ones (23, 124), in an app that runs on the GT 6 point to a vector font. Inference, not a device screenshot: the HW screenshots are browser previews."
   },
   {
    "feature": "font-weight / bold",
    "supported": "no",
    "gt6_seen": false,
    "evidence": "Not in the SDK's LITE_PROP_NAME_GROUPS (validator.js); compile WARNING '`font-weight` is not a standard attribute name' (PROBE build.log, probe.css:6); the engine has no fontWeight key (grep over ACE/src = 0 hits; keys.h/key_parser.cpp/text_component.cpp: 0). Docs list no weight (DOC text.md:36-57).",
    "notes": "Only one font: font-family accepts only HYQiHei-65S (compile ERROR for Arial, PROBE build4.log). Whether 65S looks medium or bold on the watch is unverified. Hierarchy has to come from size, colour and letter-spacing."
   },
   {
    "feature": "font-family",
    "supported": "yes",
    "gt6_seen": false,
    "evidence": "validator.js LITE text.fontFamily enum ['HYQiHei-65S']; 'Arial' gives a compile ERROR (PROBE build4.log neg.css:2).",
    "notes": "Only the default font; no alternative or bold family."
   },
   {
    "feature": "letter-spacing",
    "supported": "yes",
    "gt6_seen": true,
    "evidence": "Engine: text_component.cpp:103. validator LITE text.letterSpacing. GT 6: HW/pages/index/index.css:213 (letter-spacing 3px on the small caps eyebrow label).",
    "notes": "Fits the 'CURRENT SET 2/3' and 'REST' labels (write them in upper case)."
   },
   {
    "feature": "text-overflow (clip / ellipsis)",
    "supported": "yes",
    "gt6_seen": false,
    "evidence": "Engine: text_component.cpp:119. validator LITE text.textOverflow enum clip/ellipsis. Doc: DOC/text.md:42.",
    "notes": "Useful for long exercise names; unverified on device."
   },
   {
    "feature": "line-height",
    "supported": "no",
    "gt6_seen": false,
    "evidence": "Not in LITE_PROP_NAME_GROUPS: compile WARNING (PROBE build.log, probe.css:7). Doc marks it API 10+ (DOC/text.md:57); this app targets API 6. The open engine has it (text_component.cpp:122), the GT 6 build is unknown.",
    "notes": "Use one text per line with a fixed height instead."
   },
   {
    "feature": "text-align",
    "supported": "yes",
    "gt6_seen": true,
    "evidence": "Engine: text_component.cpp:106; input_button_component.cpp SetTextAlign. GT 6: all HW and M-arc pages.",
    "notes": "left/center/right only."
   },
   {
    "feature": "padding",
    "supported": "yes",
    "gt6_seen": false,
    "evidence": "validator LITE boxModel padding*; engine component.cpp:773-788. Compiles to paddingTop/Right/Bottom/Left (PROBE probe.js .card).",
    "notes": "No GT 6 app uses it; margins are the device-proven spacing."
   },
   {
    "feature": "margin",
    "supported": "yes",
    "gt6_seen": true,
    "evidence": "Engine: component.cpp:741-772. GT 6: HW index.css (margin-top on many elements), M-arc index.css .row/.cb margin-top.",
    "notes": ""
   },
   {
    "feature": "left/top positioning",
    "supported": "yes",
    "gt6_seen": true,
    "evidence": "Engine: component.cpp:588-592 (SetY/SetX) and 819-843. Doc: DOC/text.md:56 (left/top 6+). GT 6: HW index.css:387-388 inside a stack.",
    "notes": "Works inside a stack. Inside a flex div the layout places the children itself (unverified whether left/top then has any effect)."
   },
   {
    "feature": "position: absolute",
    "supported": "no",
    "gt6_seen": false,
    "evidence": "Not in LITE_PROP_NAME_GROUPS: compile WARNING (PROBE build.log, probe.css:7). Engine handles K_POSITION only when GRAPHIC_ENABLE_FLEX_LAYOUT_ENHANCEMENT=1 (component.cpp:846-852; BUILD.gn:173-175).",
    "notes": "Use stack + left/top."
   },
   {
    "feature": "flex options",
    "supported": "yes",
    "gt6_seen": true,
    "evidence": "validator LITE flexbox: flex-direction row/column, flex-wrap nowrap/wrap, justify-content flex-start/flex-end/center/space-between/space-around/space-evenly, align-items stretch/flex-start/flex-end/center. GT 6: HW uses row/column, center, space-between, flex-end (index.css:96,134,354,390).",
    "notes": "align-self, flex-grow, flex-shrink, flex-basis give compile WARNINGs (PROBE build4.log) and are engine-only behind the enhancement flag (component.cpp:880-907). space-evenly is not used by any GT 6 app."
   },
   {
    "feature": "opacity",
    "supported": "yes",
    "gt6_seen": true,
    "evidence": "validator LITE common.opacity; engine component.cpp:922 (static) and :1099 (keyframes). GT 6: HW index.css:20-22 @keyframes pulse animates opacity 1 -> 0.3.",
    "notes": "Static opacity uses the same engine but is not used by any GT 6 app. @keyframes only take from/to (HW INSTALL-WATCH.md)."
   },
   {
    "feature": "colour formats",
    "supported": "yes",
    "gt6_seen": true,
    "evidence": "Compile: named and #RGB colours are turned into numbers ('white' -> #FFFFFF, '#fff' -> #ffffff notes in PROBE build.log); rgba(...) is passed on as a string. Runtime: ACE/src/core/base/js_fwk_common.cpp:985-1099 parses #RGB, #RRGGBB, #AARRGGBB (alpha first), rgb(), rgba(). GT 6: #RRGGBB static and bound (HW, M-arc).",
    "notes": "rgba and #AARRGGBB are unverified on device; stick to #RRGGBB (for example #5e6ad2, #a5abf0)."
   },
   {
    "feature": "@keyframes animation",
    "supported": "yes",
    "gt6_seen": true,
    "evidence": "validator LITE animation group; engine component.cpp:855-879. GT 6: HW index.css:20-34 (pulse, spin, rise).",
    "notes": "Could pulse the 'Pending' label."
   }
  ],
  "recommendations": "Paths used above: ACE = /tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/ohsrc/arkui_ace_engine_lite/frameworks (OpenHarmony master, 2026-10-01; the GT 6 runs Huawei's closed fork, so engine lines show what the engine can do, not proof for the watch). SDK schema = /tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/watchbuild/sdk/js/build-tools/ace-loader/lib/templater/lite_component_map.js and .../lib/styler/lib/validator.js (LITE_PROP_NAME_GROUPS). HW = /home/user/leonsuv/hwgt6/watchapp/entry/src/main/js/default (its CLAUDE.md says it runs on a real GT 6). DOC = /tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-feas/fontprobe/docs (OpenHarmony 4.0 arkui-js-lite docs). ui_lite sources = /tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-feas/fontprobe/uilite. PROBE = /tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-feas/fontprobe (app copy, out/, build*.log). Nothing in /home/user/M-arc was changed.\n\nFonts:\n- Sizes: no list of fixed sizes exists in any source or doc I opened. The engine accepts any whole size from 1 to 255 px (uint8).\n- Sizes already used on the GT 6: 18, 20, 22, 23, 24, 26, 28, 30, 32, 36, 40, 42, 44 and 124 px.\n- Bold does not exist. There is no font-weight, and the only font is HYQiHei-65S. How heavy 65S looks on the watch is unverified.\n- So the C2 hierarchy has to come from size, white versus #a5abf0 or #8a8f98 colours, and letter-spacing on the small upper-case labels.\n- A fake bold (the same text twice, 1 px apart, in a stack) doubles the elements and is unverified. Skip it unless a device check shows the text is too light.\n\nHow to build each part of the design:\n- **Pills** (Easy/Ideal/Max, +30 s, Skip rest, Complete set, Continue workout): use div + text with border-radius = height/2, as the GT 6 app does. Show the selected one with style=\"background-color: {{x}}\", because class binding fails to compile. Rounded input buttons are supported by the engine but untested on the GT 6.\n- **Header**: a row div holding two texts, \"M/ARC\" and the clock. Whether the clock shows local time on the GT 6 is unverified.\n- **Each text**: give it a fixed width and height (height at least about 1.2 x the font size). For two lines, use two texts.\n- **Avoid**:\n  - line-height, position, font-weight, align-self and flex-grow: they compile with a warning and are ignored;\n  - a list as a direct child of a swiper: compile error;\n  - swiper indicator attributes: there are none, so draw your own dots;\n  - non-ASCII text in .hml: it fails check-lite-js.\n- **Special characters**: show the check mark as a small PNG. Use 'x' and '.' unless a device check confirms the \u00d7 (x) and \u00b7 (middle dot) glyphs. \u00b0 is proven by the GT 6 app.\n\nSize budget (measured on PROBE builds):\n- This is the tightest limit. Today index.js is 45,709 B, so only 2,291 B are left under the 48,000 B hard limit. The WATCH-C card's own target is 46,000 B, which leaves only 291 B.\n- The current page's template and styles compile to 2,594 B.\n- Screens 2, 3, A and B as four separate if-blocks (PROBE pages/c2a) compile to 5,388 B: +2,794 B, which does not fit.\n- One shared layout (PROBE pages/c2s: header, five bound texts with bound colour and font-size, an if-ed effort row, an if-ed rest row and an if-ed wide pill) compiles to about 3,730 B: about +1,136 B. That fits under 48,000 B but not under 46,000 B, and it does not yet count the extra view logic in link.js.\n- Recommendation: build C2 as one shared layout driven by link.view(), with short class names. Re-measure, and if needed cut bytes in link.js or raise the 46,000 B aim by an explicit ruling. A second page is a poor fit: router.replace swaps the whole page, and the link state would have to restart.\n\nCheck on the device before relying on them (one probe screen is enough):\n- a 96-110 px countdown, and how heavy HYQiHei-65S looks;\n- border-radius on input buttons, and :active;\n- rgba colours;\n- text-overflow ellipsis;\n- marquee;\n- vertical swiper;\n- horizontal progress;\n- static opacity."
 },
 "budget": {
  "baseline": "Built the current app from a scratch copy (/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-feas/budget/app) in debug mode with the 7.0 SDK (26.0.0.38). The output folder was /tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-feas/budget/out-base. check-lite-js passed: app.js 2,324 B and pages/index/index.js 45,707 B. That is 2 B less than the README's 45,709; module ids and paths differ slightly between build locations.\n\nI split the page into its webpack modules with /tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-feas/budget/tools/split.cjs. Each module figure below includes its own wrapper:\n- wearengine.js: 23,326 B. Of this, 5,070 B is spaces that babel puts inside Huawei's licence comment, 2,611 B is comment text, and 336 B is babel's _typeof helper. The helper is pulled in by `typeof data == \"object\"` in Builder.setPayload. Babel prints the licence comment on the same line, after the helper, and pads every comment line out to that column (about 338 spaces per line, 15 lines). The source file is 17,576 B.\n- link.js: 14,196 B (583 B of comments, 2,424 B of indentation; source 12,141 B).\n- index.js: 3,244 B, plus the babel interopRequireDefault helper module, 376 B (used for the @system imports).\n- Compiled hml render: 1,950 B.\n- CSS (styleSheet JSON): 744 B.\n- Entry glue (new ViewModel): 428 B.\n- Webpack: 1,927 B in all. That is the 82 B preamble, 484 B of wrappers around the 7 modules (already counted inside the module figures above) and the 1,361 B bootstrap at the end.\n\nCheck: 82 + 44,264 (all modules) + 1,361 = 45,707.\n\nAlso inside the modules: the loader adds a requireModule tail to 4 of them (4 x 85 = 340 B), babel adds ES-module boilerplate (321 B) and \"use strict\" lines (60 B).\n\nA second limit binds first: test W4 caps the page sources at 34,000 B (native/wear/test/link.test.mjs:571). Today the sources are 33,502 B, so 498 B are left.",
  "prototype": "The prototype is in /tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-feas/budget/p1/entry/src/main/js/default:\n- pages/index/index.hml and index.css hold screens 2, 3, A and B;\n- pages/index/index.js has the new data fields and the handlers onEasy, onIdeal, onMax and onGo;\n- common/link.js has a sketch of the view() changes and a 40 px common/ok.png for the check mark (the check mark cannot be a character, because the files must be ASCII).\n\nHow it is built:\n- One root column with the \"M/ARC\" + clock header shared by every screen. Four `if` blocks (s2, s3, sa, sb) show one screen at a time.\n- Classes are shared: sm, bg, lb, rw, wb.\n- Colours are fixed in the CSS, from the C2 design. Only the three effort pills and the two wide buttons take their background from data (dynamicStyle). The Easy / Ideal / Max selection is a background bound to data, because lite has no bound class (app_style_manager.cpp:22-25 handles only staticStyle, dynamicStyle and staticClass).\n\nMeasured, debug, current SDK file:\n- New hml, css and index.js only: 48,995 B, which FAILS check-lite-js. Against today: render 3,930 B (+1,980), css 1,721 B (+977), index.js 3,574 B (+330).\n- Adding the link.js view() sketch: 49,910 B, which FAILS (link.js 15,111 B, +915). The sketch adds the clock, screen selection, the effort colours, the \"local\" rest line, the count of saved actions and go(). It is a sketch for measuring size, not reviewed logic.\n- Page sources: 36,671 B, over the W4 cap of 34,000.\n\nThe same prototype under each option:\n- debug, babel `comments: false`: 41,566 B\n- debug, trimmed SDK (c1b): 41,581 B, sources 33,720 B\n- both together: 38,657 B\n- debug + terser: 25,084 B\n- release: .js 23,430 B, .bc 23,798 B\n- link.js and wearengine.js in app.js: page 11,359 B, app.js 41,120 B\n\nCost of one element in the compiled render (debug): a fixed text about 72 B, a text bound to data about 89 B, an `if` about 51 B, a static button about 130 B, a button with a bound background about 198 B.\n\nThe compiled prototype pages were run in the desktop JerryScript build (ES5.1, 8 KB stack) with the rt-e prelude. On the debug, comment-free and terser builds they gave the same output and raised no exception: the set screen, Ideal, Complete, then the rest screen showing 01:27 and Saved.",
  "options": [
   {
    "option": "(a) Move link.js and wearengine.js into app.js; the page reaches them through the global $app",
    "bytes_freed_or_added": "Prototype page 49,910 -> 11,359 B (-38,551). app.js grows 2,324 -> 41,120 B in debug (6,880 B left under 48,000), or 32,776 B with comments:false. Page sources are unchanged (36,867 B).",
    "risk": "Medium to high until tested on the watch. Not documented for lite, and whether the GT 6 sets `$app` is unverified. app.js is read by the same Eval, so the 48 KB limit applies to it too. W4 tests that pin the file list and the page import would need rewriting. Benefit: the link would survive page changes, so later screens 1 and 4 could live on other pages.",
    "evidence": "The OpenHarmony lite source sets a global `$app` to the app ViewModel after app.js runs (ohsrc/arkui_ace_engine_lite/frameworks/src/core/context/js_app_context.cpp:181-188; js_fwk_common.h:158; js_ability_impl.cpp:81). getApp() exists there but returns the app only when app.js has `data` (modules/presets/app_data_module.cpp:25-57). The lite ViewModel keeps only `data` and functions (bound) from app.js options and drops other values (packages/runtime-core/src/core/index.js:42-56, 80-84), so plain exported objects are lost. `$def` appears nowhere in that tree. The OpenHarmony lite JS doc lists only `data` and `$refs` as page objects ([js-lite-framework-syntax-js.md](https://raw.githubusercontent.com/openharmony/docs/master/en/application-dev/reference/apis-arkui/arkui-js-lite/js-lite-framework-syntax-js.md)). The `this.$app.$def` results from the web search come from Quick App, Vela and the full OpenHarmony JS docs, not lite ([Vela global data](https://iot.mi.com/vela/quickapp/en/guide/framework/script/global-data-method.html), [XDA](https://forum.xda-developers.com/t/can-the-global-variables-defined-in-the-app-ux-file-of-a-quick-app-be-read-in-the-javascript-file.4267951/latest)). hwgt6's app.js comment mentions this.$app.$def, but none of its pages use it (grep). Built variant: /tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-feas/budget/a1 (app.js exposes m(); the page calls $app.m() in onInit)."
   },
   {
    "option": "(b) Second page via @system.router",
    "bytes_freed_or_added": "On its own it does not make room. A page holding only screens 2 and 3 is still 48,515 B (FAIL), because every page bundle carries its own link.js and wearengine.js (about 37.5 KB). It only helps combined with (a).",
    "risk": "High. Lite has only router.replace. The old page is destroyed: onDestroy clears the interval, unregisters the receiver and calls link.die(). The new page starts the link again: restart-guard read and write, outbox reload, P2P registration, then a blank screen until the phone answers the hello. die() marks the run clean only when no storage call is in flight (link.js:337). A page switch right after Complete, when storage is busy, therefore counts as a quick restart; two within 30 s pause the app for 10 minutes (link.js:183-190, 276).",
    "evidence": "router_module.cpp:125 registers only `replace`. js_router.cpp:56 is the replace path. hwgt6's pages note that lite has no push or back and use router.replace (pages/detail/detail.js:81-82, index.js:399-400). Measured: /tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-feas/budget/b1 is 48,515 B."
   },
   {
    "option": "(c) Trimmed wearengine.js keeping P2pClient, Message and Builder",
    "bytes_freed_or_added": "Removing only the unused Builder.setPayload, setBufferPlayload and setFilePlayload (lines 434-456): wearengine 23,326 -> 17,188 B (-6,138; that also drops _typeof and the 5,070 B padding), prototype 43,772 B. Also removing File (409-423) and PeerDeviceClient (497-562) and fixing the export line (c1b): wearengine 14,997 B (-8,329), prototype 41,581 B (6,419 B left), sources 33,720 B (fits W4's 34,000). Also removing ping and comment lines except the licence: wearengine 12,474 B. Removing all comments: 11,783 B. c1b together with (f): prototype 38,657 B.",
    "risk": "Low at runtime: the removed code has no callers (grep of the kept file finds no File, PeerDeviceClient or setPayload use), and every kept line is Huawei's. Process: W4 pins the SHA-256 of Huawei's file and the card says it stays unchanged, so the card and test must change. Every Huawei SDK update needs the trim run again. The page keeps importing { P2pClient, Message, Builder }.",
    "evidence": "Generator: /tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-feas/budget/tools/trim-we.cjs, with variants c1a to c1g under the same budget folder. Check: every line of c1b except the rewritten export line occurs in Huawei's file in the same order (461 lines checked; the original's sha256 8c7f1100... matches the W4 pin). The file keeps its CRLF line endings. Suggested proof for the repo: keep Huawei's file unchanged outside js/default, still pinned by hash. A test rebuilds the trimmed file from it with the fixed list of removed line ranges plus the export line, compares bytes, and asserts that each range starts and ends at the expected declaration."
   },
   {
    "option": "(d) Release or minified build output",
    "bytes_freed_or_added": "Release (mode production, terser mangle, plus jerry .bc): baseline .js 20,302 B and .bc 21,556 B; prototype .js 23,430 B and .bc 23,798 B. Debug build with Huawei's own terser step switched on (hapMode=true; no .bc, because only release adds the SnapshotPlugin): baseline 21,958 B, prototype 25,084 B (22,916 B left). Neither reduces sources.",
    "risk": "Release is high risk. In the OpenHarmony lite source a device runs in snapshot mode by default, so it would load index.bc first. CheckSnapshotVersion only logs a mismatch, and whether the SDK's jerry-snapshot version matches the GT 6 engine is unverified (README:206 also lists release .js vs .bc as unverified). Debug + terser is low to medium risk. The watch would still load only .js, the same way as today's debug builds that ran on the GT 6, but this minified code has not run on the watch yet. It also loses readable names in device logs, and it is a Huawei loader path that is not the default for debug builds.",
    "evidence": "ace-loader webpack.lite.config.js:229-236 (hapMode -> TerserPlugin {compress:false, mangle:true}) and 258-262 (only release adds the SnapshotPlugin). The release .bin holds both index.js and index.bc (dump-bin.py). Snapshot mode is on by default on a device (frameworks/targets/platform_adapter.cpp:41-57; liteos_m acelite_config.h:281 'user/data/jsparser_enable'). The engine falls back to the other suffix (js_app_context.cpp:142-178; js_page_state_machine.cpp:126, 273). The size check also applies to .bc (js_app_context.cpp:91-95; FILE_CONTENT_LENGTH_MAX 1024*48 at js_fwk_common.h:89). All 35 red-team scenarios (rt-e) give byte-identical output for the current app's debug and debug+terser builds, in /tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-feas/budget/jr/base and jr/hap. The terser output has no =>, let, const, class, template strings, .replace( or spread."
   },
   {
    "option": "(e) Shorter CSS class names, fewer elements",
    "bytes_freed_or_added": "Small, about 100-600 B. Class names are already 1-2 characters, and CSS property names are emitted as fixed camelCase keys. Typical savings: merge two fixed lines into one bound text (about 72 B), drop an `if` (about 51 B), share the `rl` and `tgt` texts across screens (about 89 B each). Factoring the 7 textAlign:center (about 20 B each) or the 13 colour declarations (about 17 B each) into a second class adds about 5 B per element in the render. Binding the phone's theme colour on every text, as the current page does, would instead add about 55 B per text (about 1 KB).",
    "risk": "Low. Using `show` instead of `if` maps to SetVisible (component.cpp:415); whether hidden views still take up layout space is unverified. Lite has no font-weight key (keys.h); bold must come from the font family, which is unverified on the GT 6.",
    "evidence": "Per-element costs were measured in /tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-feas/budget/out-p1-debug. Template transform: ace-loader lib/lite/lite-transform-template.js (transformIf builds _i(), and `show` is emitted as an attribute)."
   },
   {
    "option": "(f) Babel `comments: false` through a small webpack wrapper config in the build script; no source file changes",
    "bytes_freed_or_added": "Baseline 45,707 -> 37,365 B (-8,342; wearengine 15,576 B, link 13,602 B). Prototype 49,910 -> 41,566 B (6,434 B left). Sources unchanged (36,671 B, over the W4 cap of 34,000).",
    "risk": "Lowest risk on the device: the executed code is token-identical to today's debug build. Huawei's file and its W4 hash stay unchanged. The licence comment no longer appears in the compiled watch file; Huawei's own release build strips it too, and the repo keeps it. The wrapper should fail the build unless it finds exactly one babel rule, so a future SDK change cannot silently skip it.",
    "evidence": "Wrapper: /tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-feas/budget/tools/nocomment.config.js, run by tools/build-x.sh (a copy of build-lite-bin.sh with the XCFG and XHAP overrides). Token comparison (tools/tokeq.cjs, @babel/parser, module ids renumbered): current app 8,630 tokens IDENTICAL; prototype 9,888 tokens IDENTICAL. As a sanity check, the same comparer reports a difference between the baseline and the prototype. rt-e scenarios: all 35 outputs identical except s8's peak-heap figure (65,536 vs 65,544 B)."
   },
   {
    "option": "(f2) Other findings",
    "bytes_freed_or_added": "The fixed webpack overhead is 1,927 B per page, plus 340 B of requireModule tails and 321 B of ES-module boilerplate. Merging link.js into index.js would save about 300-450 B but break link.test.mjs's module import. The check-mark image adds about 85 B to the render and 6.4 KB to the .bin (ok.bin), but nothing to the JS limit.",
    "risk": "Adding the PNG under js/default changes W4's fixed file list (link.test.mjs:558). W4's markup test pins the button labels ['+30 s','Skip','Complete'] (link.test.mjs:600), so any new UI updates that test. With every option except (c), the W4 source cap of 34,000 B (link.test.mjs:571) must be changed by whoever owns the card (the coordinator), as on 2026-10-17. This is the card's own size proxy, not a device limit.",
    "evidence": "tools/split.cjs and the overhead script output for /tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-feas/budget/out-base. docs/watch-cards/WATCH-C.md:67 (source cap 34,000, compiled aim at most 46,000, check-lite-js enforces 48,000)."
   }
  ],
  "recommendation": "Recommendation: turn off babel comments for the build only, option (f). Everything else stays as it is: Huawei's wearengine.js (byte-identical, hash pin kept), the debug mode, the .js-only loading the GT 6 has already run, and one page.\n\nHow:\n- Pass a wrapper around Huawei's webpack.lite.config.js that sets the babel-loader option `comments: false`.\n- The wrapper fails the build unless it finds exactly one babel rule.\n\nResult:\n- The prototype for screens 2, 3, A and B, with a view() sketch, compiles to 41,566 B. That leaves 6,434 B under 48,000 and 4,434 B under the card's 46,000 aim.\n- The executed code is token-identical to today's debug build (proven on the current app and on the prototype).\n\nOne card decision is needed. The prototype's sources are 36,671 B, over W4's source cap of 34,000. The coordinator either raises that cap to about 37,000 or replaces it with the compiled limit the card already sets (46,000).\n\nIf the cap must stay at 34,000:\n- Add (c) c1b on top. It regenerates the SDK from Huawei's pinned original without File, PeerDeviceClient and the three setPayload methods, with a byte-for-byte regeneration test.\n- Sources become 33,720 B and the compiled page 38,657 B.\n\nDo not use:\n- release (.bc): which file the watch runs and whether the snapshot version matches are unverified;\n- router pages alone: still 48,515 B, and a switch can trip the restart guard.\n\nKeep in reserve:\n- (d) debug+terser, 25,084 B: same scenario outputs, but not yet run on the watch;\n- (a) app.js, page 11,359 B: the way to fit later screens 1 and 4, after a one-build device check that `$app` exists on the GT 6.\n\nNot verified on the watch: how the prototype screens look (font sizes, border-radius, bold text, check image) and whether the GT 6 engine is the same as the OpenHarmony source quoted here."
 }
}
```
