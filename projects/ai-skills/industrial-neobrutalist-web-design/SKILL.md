Markdown

````
---
name: industrial-neobrutalist-web-design
description: Build distinctive, production-quality websites using dark industrial neo-brutalism, restrained high-contrast accents, editorial typography, technical layouts, precise spacing, and functional interactions. Use when creating or redesigning developer tools, software products, documentation sites, portfolios, dashboards, and modern technical brands.
---

# Industrial Neo-Brutalist Web Design

## 1. Purpose and design philosophy

Create websites that feel engineered, intentional, and designed by a real person with strong visual judgment.

The aesthetic combines:
- Neo-brutalism and editorial design.
- Industrial interfaces and technical documentation.
- Minimalist layouts with deliberate asymmetry.
- High-contrast typography and restrained color.
- Strong geometry, visible structure, and purposeful borders.
- Subtle futuristic details without generic sci-fi decoration.

The result should feel like a serious software product, independent developer brand, or technical studio. It must look distinctive without sacrificing usability.

Do not interpret minimalism as emptiness, brutality as ugliness, or futuristic design as excessive glowing gradients.

**Core principle:** Every visual element must have a purpose. Use typography, spacing, geometry, color, and contrast to create the identity instead of relying on decorative effects.

## 2. Visual identity

### Color system

Use a near-black foundation, slightly lighter surfaces, warm off-white text, and one vivid accent color.

Default palette:

| Token | Color | Purpose |
|---|---|---|
| Background | `#0B0B0D` | Main page background |
| Surface | `#121316` | Cards, panels, navigation, and content regions |
| Raised surface | `#191A1E` | Hover states, selected areas, and elevated controls |
| Primary text | `#F3F2EF` | Headlines and primary content |
| Secondary text | `#A5A5AA` | Supporting text and descriptions |
| Muted text | `#777980` | Timestamps, labels, and low-priority metadata |
| Accent | `#FF3B00` | Primary emphasis, calls to action, active states, and key details |
| Border | `#303136` | Subtle structural separation |
| Strong border | `#F3F2EF` | High-contrast outlines when intentionally required |

Treat these as design tokens, not hard-coded colors scattered throughout the application.

The palette may be adapted to the brand, but preserve its visual logic: dark neutral foundation, high readability, and one dominant accent.

#### Color rules

- Use the accent sparingly. It should immediately identify the most important interactive or informational elements.
- Use neutral surfaces to establish hierarchy rather than assigning a different color to every section.
- Maintain readable contrast for body text, controls, labels, and focus indicators.
- Use borders to establish structure and boundaries.
- Avoid using accent-colored text for long paragraphs.
- Do not add gradients simply to make a section look more interesting.
- Avoid rainbow accents, unnecessary multicolor gradients, and generic purple-blue AI branding.
- Use semantic colors for success, warning, and errors only when their meaning is clear.
- Do not rely on color alone to communicate status.

The page should remain visually recognizable when the accent is removed. Its layout and typography must do most of the design work.

## 3. Typography

Typography is one of the main elements of the design, not a finishing detail.

### Font direction

Use a strong sans-serif for headlines and body text, paired with a monospace typeface for technical details.

Preferred options include:

- **Headlines:** Space Grotesk, Geist, or Inter.
- **Body text:** Inter, Geist, or a similarly neutral, highly readable sans-serif.
- **Code and technical labels:** JetBrains Mono, IBM Plex Mono, or Geist Mono.

Choose fonts based on the project's character and availability. Do not load multiple font families unnecessarily.

Use a practical fallback stack:

```css
:root {
  --font-display: "Space Grotesk", "Inter", sans-serif;
  --font-body: "Inter", "Helvetica Neue", sans-serif;
  --font-mono: "JetBrains Mono", "IBM Plex Mono", monospace;
}
````

If the selected display font also works well for body text, simplify the system instead of introducing unnecessary typefaces.

### Headline style

* Use large, assertive headlines with tight but readable line heights.

* Favor short, direct statements over long marketing slogans.

* Allow deliberate line breaks to create composition.

* Use negative space around major headlines.

* Use medium-to-heavy weights where appropriate.

* Prefer sentence case or restrained capitalization over making everything uppercase.

* Use uppercase monospace text for small labels, categories, section markers, and technical metadata.

* Make size differences between headlines, body text, and labels intentional.

A landing page hero should have a clear visual hierarchy. The main headline should be the first thing the viewer notices, followed by supporting text and the primary action.

Do not make every heading enormous. Oversized typography is a deliberate focal point, not the default for every section.

### Technical labels

Use small monospace labels for elements such as:

* `SYSTEM STATUS`

* `01 / OVERVIEW`

* `VERSION 1.0`

* `DOCUMENTATION`

* `AVAILABLE NOW`

These labels should add structure and a technical tone. Do not decorate every component with arbitrary identifiers or fake terminal output.

### Body copy

* Keep paragraphs relatively short.

* Use a comfortable line height.

* Limit long text blocks to a readable width.

* Avoid excessively small text.

* Maintain a clear distinction between primary copy and metadata.

* Never sacrifice readability for visual style.

## 4. Neo-brutalist layout

Build layouts using strong geometry, deliberate spacing, and visible structural divisions.

### Structural principles

* Use a consistent spacing scale.

* Align content to a clear grid.

* Establish a strong relationship between headings, content, and actions.

* Combine broad open spaces with tightly structured information.

* Use asymmetry when it improves composition.

* Use large horizontal sections, split layouts, and strong editorial alignment.

* Allow some elements to break the grid intentionally, but ensure the result still feels controlled.

* Use thin borders and occasional strong outlines to separate content.

* Avoid wrapping every paragraph or feature in an individual card.

Neo-brutalism should come from the structure and visual decisions, not from random offsets or deliberately broken usability.

### Suggested spacing scale

CSS

```
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;
  --space-32: 8rem;

  --content-width: 1200px;
  --reading-width: 720px;
  --page-gutter: clamp(1.25rem, 4vw, 4rem);
}
```

Adjust these values to the content and viewport. Do not force the same spacing onto every component.

### Page composition

Prefer a small number of strong sections over a long sequence of repetitive cards.

Useful compositions include:

* A bold hero with a large headline and asymmetric supporting content.

* A horizontal strip of technical metadata.

* A feature grid with varied content density.

* A large bordered product preview.

* An editorial text section beside a technical diagram or screenshot.

* A numbered process or architecture overview.

* A strong closing call to action.

* A compact footer with clear navigation.

Do not use every composition on every website. Select only the sections needed by the actual content.

## 5. Borders, corners, and surfaces

Neo-brutalist interfaces use visible structure.

### Borders

Use borders to define regions, separate information, and make interactive elements feel tangible.

Examples:

CSS

```
.panel {
  background: var(--surface);
  border: 1px solid var(--border);
}

.panel--featured {
  border: 1px solid var(--text-primary);
}

.section-divider {
  border: 0;
  border-top: 1px solid var(--border);
}
```

Use strong light-colored borders selectively. If every element has a thick white outline, the design becomes noisy.

### Corner radius

Prefer square corners and restrained rounding.

* Default panels: square or subtly rounded.

* Inputs: modest rounding if it improves usability.

* Buttons: square or slightly rounded.

* Pills: reserved for genuinely compact labels or status indicators.

Avoid making every element a large rounded pill or floating glass card.

### Shadows

Use shadows sparingly. Flat surfaces and borders should provide most of the visual separation.

A small shadow may be useful for an overlay or dropdown. Avoid oversized, soft shadows that make the interface look like a generic SaaS template.

## 6. Buttons and interactive elements

Interactive elements should feel deliberate, clear, and responsive.

### Primary buttons

Use the accent color for the main action. Maintain strong text contrast and a recognizable interactive shape.

### Secondary buttons

Use dark surfaces, neutral borders, and clear hover states.

### Interaction requirements

* Provide visible hover and keyboard-focus states.

* Keep button dimensions consistent within a component family.

* Use concise action labels.

* Make the entire intended control area clickable.

* Ensure controls have accessible names.

* Do not rely on hover alone to expose essential functionality.

* Respect reduced-motion preferences.

* Provide clear disabled, loading, success, and error states.

Animations should be quick and purposeful. Prefer small color changes, border transitions, and restrained movement.

Do not add animations that delay access to content or make navigation feel sluggish.

## 7. Background details and decoration

The background should establish depth without competing with the content.

Suitable details include:

* A faint grid.

* Sparse technical linework.

* Thin separators.

* Subtle noise or texture.

* Small geometric markers.

* Deliberately aligned coordinate-like labels.

* Minimal schematic elements.

Use these sparingly and consistently.

If a grid is used, keep its contrast extremely low:

CSS

```
.background-grid {
  background-image:
    linear-gradient(
      to right,
      rgb(243 242 239 / 3%) 1px,
      transparent 1px
    ),
    linear-gradient(
      to bottom,
      rgb(243 242 239 / 3%) 1px,
      transparent 1px
    );

  background-size: 48px 48px;
}
```

Do not put the grid behind every section by default. Use it as a compositional tool, particularly around hero sections or technical visualizations.

Avoid excessive glow, animated particle backgrounds, floating geometric clutter, fake scanlines, and decorative terminal windows that have no real purpose.

## 8. Hero sections

The hero should communicate what the website is, who it serves, and why it matters within a few seconds.

### Recommended structure

1. Optional compact eyebrow label.

2. One distinctive headline.

3. Short supporting copy.

4. One primary action and, if useful, one secondary action.

5. A meaningful product preview, technical visual, diagram, or carefully composed empty space.

Use a strong headline and a controlled composition. Do not force a centered layout when an asymmetric layout better expresses the brand.

The headline should be specific to the actual product or organization.

Avoid generic phrases such as:

* "The future starts here."

* "Unlock your full potential."

* "Redefining what's possible."

* "One platform. Infinite possibilities."

* "Where innovation meets simplicity."

Do not substitute generic marketing language for meaningful information.

### Product previews

When the website represents software, use authentic screenshots, real interface previews, diagrams, or code examples whenever available.

Do not invent product features or depict interface functionality that does not exist.

A useful, accurate preview is better than an elaborate but misleading illustration.

## 9. Feature sections

Features should be easy to scan without looking like repeated template cards.

Vary composition when the content supports it:

* Text beside a screenshot.

* A large feature beside two smaller ones.

* A numbered list with concise explanations.

* A bordered architecture diagram.

* A code example beside its explanation.

* A full-width section with a strong heading and supporting details.

Each feature should explain a concrete capability or benefit.

Avoid repetitive icon-plus-heading-plus-paragraph cards across the entire page. Use icons only when they improve recognition or communicate something useful.

Keep illustrations and diagrams consistent with the rest of the visual identity.

## 10. Navigation

Navigation should be compact, legible, and easy to understand.

* Establish a clear relationship between the logo and navigation.

* Keep primary navigation concise.

* Make the active section recognizable.

* Use a restrained border or surface distinction when appropriate.

* Ensure the mobile menu works with touch, keyboard, and screen readers.

* Avoid unnecessary floating navigation elements.

* Keep the main call to action visually distinct without overwhelming the header.

A sticky header is optional. Use it only when it helps people navigate the page.

## 11. Documentation and technical websites

For developer tools, documentation, and technical products, combine the visual identity with high information density and practical navigation.

Use:

* A clear documentation sidebar.

* A readable main content column.

* Monospace styling for code and technical labels.

* Distinct heading levels.

* Bordered callouts used only when meaningful.

* Consistent code blocks.

* Visible active navigation states.

* Functional search where appropriate.

* Clear previous/next navigation for long documentation.

Do not apply marketing-page typography indiscriminately to long-form documentation. Documentation should prioritize scanning, readability, and accurate technical content.

For dashboards and application interfaces, reduce decorative elements further. Prioritize information hierarchy, performance, and the user's workflow.

## 12. Responsive design

Design deliberately for mobile, tablet, and desktop.

Do not treat mobile as a compressed desktop layout.

### Desktop

Use broad compositions, generous margins, split layouts, and strong alignment.

### Tablet

Reduce column counts and adjust spacing while preserving the main hierarchy.

### Mobile

* Use a single-column flow where appropriate.

* Reduce headline sizes with fluid typography.

* Keep touch targets comfortably large.

* Avoid horizontal overflow.

* Stack actions when necessary.

* Simplify decorative details.

* Preserve adequate side padding.

* Make code and tables usable on small screens.

* Keep navigation accessible.

* Avoid excessively tall heroes that push useful content far below the fold.

Use fluid sizing where appropriate:

CSS

```
.hero-title {
  font-size: clamp(2.75rem, 7vw, 6.5rem);
  line-height: 0.98;
  letter-spacing: -0.055em;
}
```

Test at multiple viewport widths rather than assuming a responsive layout works because a few media queries exist.

## 13. Motion and transitions

Motion should clarify interactions, not serve as decoration.

Prefer:

* Short opacity transitions.

* Small position changes.

* Subtle border and surface transitions.

* Simple entrance effects when they improve hierarchy.

* Immediate feedback after user actions.

Avoid:

* Long entrance sequences.

* Excessive parallax.

* Constantly moving backgrounds.

* Scroll hijacking.

* Large spring animations on ordinary controls.

* Animations that repeatedly restart when the component rerenders.

Respect `prefers-reduced-motion`. Core content must remain accessible without animation.

## 14. Writing and content design

The writing should sound like a knowledgeable human who understands the product.

* Be direct and specific.

* Use ordinary language where it communicates better than jargon.

* Vary sentence length naturally.

* Keep headings concise.

* Explain technical claims accurately.

* Prefer concrete examples to vague promises.

* Preserve established names, headings, and information architecture when revising an existing site unless asked to change them.

* Do not invent benchmarks, testimonials, integrations, or product capabilities.

* Avoid excessive em dashes, artificial rhetorical contrasts, repetitive three-part lists, and overly polished generic slogans.

* Do not rewrite every sentence when a small edit would solve the problem.

Visual design and writing should reinforce one another. A minimal interface requires particularly clear content because there is less decoration to distract from weak copy.

## 15. Technical implementation

Build a real website, not a static mockup that only resembles a finished product.

Before implementation:

1. Inspect the existing repository and framework.

2. Identify current design tokens, components, routes, assets, and responsive behavior.

3. Understand which functionality must remain unchanged.

4. Reuse the existing stack unless there is a clear technical reason to change it.

5. Establish a consistent design system before duplicating styles across pages.

During implementation:

* Use reusable components for shared interface patterns.

* Define color, typography, spacing, borders, and radii as centralized tokens.

* Keep styles maintainable.

* Avoid unnecessary dependencies.

* Optimize images and fonts.

* Prevent layout shifts.

* Use semantic HTML.

* Provide accessible labels and keyboard navigation.

* Maintain adequate contrast.

* Preserve search engine metadata and useful page titles.

* Avoid duplicating entire page implementations when shared components are appropriate.

For React-based projects, avoid excessive component state and unnecessary rerenders. Do not introduce complex client-side behavior where static HTML or CSS is sufficient.

For all frameworks, ensure that interactive controls perform their stated actions and that navigation points to valid destinations.

Do not replace functional application logic with placeholder buttons or decorative elements.

## 16. Accessibility

Neo-brutalist design does not justify poor accessibility.

Ensure that:

* Text remains readable against its background.

* Keyboard focus is visible.

* Navigation and dialogs work with a keyboard.

* Controls have accessible names.

* Images have appropriate alternative text.

* Decorative images are hidden from assistive technology.

* Heading levels are logical.

* Reduced-motion preferences are respected.

* Interactive elements are not distinguishable by color alone.

* Mobile controls are usable with touch.

* Focus is managed correctly when opening and closing dialogs.

Use semantic elements before introducing custom interaction patterns.

## 17. Performance

A visually polished website must also be fast.

* Avoid unnecessary JavaScript.

* Prefer CSS for simple visual effects.

* Lazy-load below-the-fold images when appropriate.

* Optimize image dimensions and formats.

* Load only the fonts and weights actually used.

* Avoid heavy animation libraries for simple transitions.

* Keep component updates efficient.

* Avoid unnecessary polling and background tasks.

* Prevent layout shifts caused by late-loading content.

* Test on mobile-sized viewports and constrained devices.

Do not sacrifice loading speed for decorative effects.

## 18. Common design failures to avoid

Never default to the following:

* Generic SaaS landing page layouts.

* Identical rounded cards for every feature.

* Purple-to-blue gradients.

* Glassmorphism everywhere.

* Excessive orange backgrounds.

* Huge headlines on every section.

* Random asymmetry without a grid.

* Thick borders around every element.

* Fake terminal windows with meaningless output.

* Unnecessary glowing borders.

* Excessive uppercase labels.

* Tiny, low-contrast metadata.

* Repetitive icon grids.

* Unnecessary animation.

* Placeholder product screenshots.

* Decorative complexity that obscures content.

A strong design is not achieved by applying every neo-brutalist effect simultaneously. It comes from making a small number of consistent, confident choices.

## 19. Required design workflow

When creating or redesigning a website, follow this process:

### Step 1: Understand the product

Identify the target audience, purpose, important content, primary action, existing functionality, and technical constraints.

Do not begin by blindly applying a template.

### Step 2: Establish the visual system

Define the color tokens, fonts, typography scale, spacing, border treatment, corner radius, and interaction states.

Use the defaults in this skill as a starting point.

### Step 3: Design the hierarchy

Determine the primary headline, supporting information, main action, navigation, and content order.

Make the important information visually dominant.

### Step 4: Build the structure

Implement the main layout and responsive behavior before adding decorative details.

Use real content and functional components.

### Step 5: Refine the aesthetic

Apply the accent color, borders, technical labels, background details, and subtle transitions.

Remove anything that does not strengthen the design.

### Step 6: Verify functionality

Test links, buttons, forms, menus, dialogs, navigation, and any existing product behavior.

### Step 7: Inspect responsive layouts

Check desktop, tablet, and mobile layouts. Fix overflow, poor spacing, awkward line breaks, and inaccessible interactions.

### Step 8: Review the finished result

Evaluate the website as a whole. Check whether it feels cohesive, distinctive, readable, technically credible, and intentionally designed.

Run the available build, lint, and test commands. Fix regressions rather than merely reporting them.

## 20. Final quality standard

The finished website should feel like a distinctive technical brand with a clear visual point of view.

It should have:

* A dark, neutral, high-contrast foundation.

* Restrained use of a vivid accent.

* Strong typography with editorial character.

* A deliberate grid and clear spacing.

* Visible but controlled structural borders.

* Minimal decorative effects.

* Functional, accessible interactions.

* Responsive layouts.

* Specific, credible content.

* Efficient implementation.

* A consistent visual language across every page.

The goal is industrial precision with editorial restraint. Make the website memorable through composition, typography, contrast, and structure, not through piles of effects or generic AI-generated design patterns.
