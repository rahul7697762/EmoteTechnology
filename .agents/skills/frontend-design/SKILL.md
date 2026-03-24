---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.

  **EdTech Color System** — When building for educational platforms, use palettes that inspire focus, trust, and progress without feeling corporate or sterile. Recommended combinations:

  | Palette Name | Primary | Secondary | Accent | Surface | Use When |
  |---|---|---|---|---|---|
  | **Indigo Focus** | `#3B4FD8` (deep indigo) | `#6C7EF5` (periwinkle) | `#F5A623` (warm amber) | `#F7F8FF` (cool white) | Study tools, LMS dashboards |
  | **Teal Clarity** | `#0D7377` (dark teal) | `#14A085` (emerald) | `#F9C74F` (golden yellow) | `#F0FAFA` (mint white) | Science/STEM courses |
  | **Slate & Coral** | `#2D3A45` (deep slate) | `#4A90A4` (steel blue) | `#FF6B6B` (coral) | `#FAFCFD` (soft white) | Creative arts, language learning |
  | **Forest Deep** | `#1B4332` (forest green) | `#40916C` (sage) | `#FFD166` (warm yellow) | `#F6FAF7` (nature white) | Eco / sustainability ed |
  | **Night Study** *(dark mode)* | `#1A1D2E` (near-black) | `#252A41` (dark navy) | `#7C6FE8` (soft violet) | `#0F1120` (deep bg) | Night-mode reading / code editors |
  | **Warm Scholar** | `#3D2B1F` (espresso) | `#7B4F3A` (warm brown) | `#E8A87C` (peach) | `#FEF8F2` (cream) | Humanities, history, writing |

  **EdTech Color Rules**:
  - Use **blue/indigo family** as trust anchors — they increase perceived credibility and focus.
  - Use **warm yellows/ambers** sparingly as progress indicators, CTAs, or gamification highlights.
  - **Avoid pure red** for errors — use `#E25C5C` softened coral-red instead (less alarming for learners).
  - **Green** signals success/completion (`#2DC653`); reserve orange/amber for warnings.
  - Maintain **4.5:1+ contrast** on all text — accessibility is non-negotiable in education.
  - For dark modes, offset background layers by `hsl(225, 30%, N%)` steps (8% → 12% → 18%) for depth without harshness.
  - In typography+color pairing: light surfaces need deep primary text (`#1A1D2E`); dark surfaces need off-white (`#E8EAF2`) not pure white.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.
