# Design System (Specs)

## Colors

### Brand & Accent
- **White** (`{colors.primary}`): `#FFFFFF` — Primary CTA, display headlines, body text.
- **Sky Blue** (`{colors.accent-blue}`): `#0099FF` — Hyperlinks, focus-input rings, selection halos. Never for fills.

### Surface
- **Canvas** (`{colors.canvas}`): `#0A0A0A` — Page background.
- **Surface 1** (`{colors.surface-1}`): `#161616` — Pricing cards, secondary buttons, mockup tiles.
- **Surface 2** (`{colors.surface-2}`): `#222222` — Featured pricing cards, selected tab.
- **Hairline** (`{colors.hairline}`): `#2E2E2E` — 1px borders, input groups.
- **Hairline Soft** (`{colors.hairline-soft}`): `#242424` — FAQ dividers, footer rules.
- **Inverse Canvas** (`{colors.inverse-canvas}`): `#FFFFFF` — Light pill surface.
- **Success Green** (`{colors.semantic-success}`): `#00CC66` — Checkmarks.

### Brand Gradients (Card Spotlight Only)
- **Gradient Magenta** (`{colors.gradient-magenta}`)
- **Gradient Violet** (`{colors.gradient-violet}`)
- **Gradient Orange** (`{colors.gradient-orange}`)
- **Gradient Coral** (`{colors.gradient-coral}`)

---

## Typography (Pretendard)

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|
| `{typography.display-xxl}` | 110px | 500 | 0.85 | -5.5px |
| `{typography.display-xl}` | 85px | 500 | 0.95 | -4.25px |
| `{typography.display-lg}` | 62px | 500 | 1.00 | -3.1px |
| `{typography.display-md}` | 32px | 500 | 1.13 | -1.0px |
| `{typography.headline}` | 22px | 700 | 1.20 | -0.8px |
| `{typography.subhead}` | 24px | 400 | 1.30 | -0.01px |
| `{typography.body-lg}` | 18px | 400 | 1.30 | -0.18px |
| `{typography.body}` | 15px | 400 | 1.30 | -0.15px |
| `{typography.body-sm}` | 14px | 500 | 1.40 | -0.14px |
| `{typography.caption}` | 13px | 500 | 1.20 | -0.13px |
| `{typography.micro}` | 12px | 400 | 1.20 | -0.12px |
| `{typography.button}` | 14px | 500 | 1.0 | -0.14px |

---

## Spacing

- **Base unit**: 5px
- `{spacing.hair}`: 1px
- `{spacing.xxs}`: 4px
- `{spacing.xs}`: 8px
- `{spacing.sm}`: 12px
- `{spacing.md}`: 15px
- `{spacing.lg}`: 20px (Card interior padding)
- `{spacing.xl}`: 30px (Gradient spotlight padding)
- `{spacing.xxl}`: 40px
- `{spacing.section}`: 96px (Section padding)

---

## Elevation & Depth

- **Level 0 (flat)**: No shadow, no border (canvas-mounted text).
- **Level 1 (charcoal)**: `{colors.surface-1}` background.
- **Level 2 (light-edge)**: `rgba(255,255,255,0.10)` 0.5px top edge + `rgba(0,0,0,0.25)` 10px 30px drop (floating cards).
- **Level 3 (selected)**: `rgba(0,153,255,0.15)` 1px ring (focus inputs, active toggles).

---

## Shapes (Border Radius)

- `{rounded.xs}`: 4px (Chips/tags)
- `{rounded.sm}`: 6px (Badges)
- `{rounded.md}`: 10px (Inputs, list items)
- `{rounded.lg}`: 15px (Thumbnails)
- `{rounded.xl}`: 20px (Pricing cards, mockups)
- `{rounded.xxl}`: 30px (Spotlight cards)
- `{rounded.pill}`: 100px (Primary CTAs)
- `{rounded.full}`: 9999px (Circles, avatars)

---

## Component Specs

### Buttons
- **`button-primary`**: Background `{colors.primary}`, Text `{colors.on-primary}`, Type `{typography.button}`, Padding 10px 15px, Rounded `{rounded.pill}`.
- **`button-secondary`**: Background `{colors.surface-1}`, Text `{colors.ink}`, Type `{typography.button}`, Padding 10px 15px, Rounded `{rounded.pill}`.
- **`button-translucent`**: Background `{colors.surface-2}`, Text `{colors.ink}`, Type `{typography.button}`, Padding 8px 14px, Rounded `{rounded.xxl}`.
- **`button-icon-circular`**: Background `{colors.surface-1}`, Text `{colors.ink}`, Rounded `{rounded.full}`, Size 40px.

### Inputs & Forms
- **`text-input`**: Background `{colors.surface-1}`, Text `{colors.ink}`, Type `{typography.body}`, Rounded `{rounded.md}`, Padding 10px 14px.
- **`text-input-focused`**: Focus ring: Level 3 shadow (`rgba(0,153,255,0.15)` 1px ring).

### Cards & Layouts
- **`pricing-card`**: Background `{colors.surface-1}`, Rounded `{rounded.xl}`, Padding 24px.
- **`pricing-card-featured`**: Background `{colors.surface-2}`, Rounded `{rounded.xl}`, Padding 24px.
- **`gradient-spotlight-card`**: Background `{colors.gradient-violet}`/`{colors.gradient-magenta}`/`{colors.gradient-orange}`/`{colors.gradient-coral}`, Rounded `{rounded.xl}`/`{rounded.xxl}`, Padding 32px.
- **`top-nav`**: Background `{colors.canvas}`, Height: 56px, Font: `{typography.body-sm}`.
- **`footer`**: Background `{colors.canvas}`, Font: `{typography.caption}`, Padding: 64px 32px.

### Component Implementation Guidelines

#### 1) Common Button (`Button`)
- **Icon Alignment**: Avoid hardcoding icons as children inside the button. Instead, use `prefixIcon` and `suffixIcon` props to keep icons properly aligned outside the text container.
- **Icon-Only Button**: For standalone icon buttons (e.g., close buttons), leave `children` empty to eliminate asymmetric padding caused by gap settings and ensure precise vertical/horizontal centering.

#### 2) Global Stacking Context (z-index)
To prevent z-index collision and rendering overlaps, adhere strictly to the following layout layers:

| Layer Name | Token | Description |
| :--- | :--- | :--- |
| **Sticky Header** | `z-[10]` | Table/timeline column headers within pages |
| **Global Sidebar** | `z-[20]` | Main layout sidebar (fixed left) |
| **Global Header** | `z-[30]` | Main layout header (fixed top) |
| **Select Dropdown** | `z-[40]` | Custom select input options dropdown |
| **Popover** | `z-[45]` | Tooltips and inline popover containers |
| **Calendar Picker** | `z-[50]` | Popover calendar picker dropdowns |
| **Base Modal** | `z-[100]` | Modal overlays, backdrop shadows, and dialogs |

- **Caution**: To avoid popups/pickers slipping behind modal backdrops or form structures, do not hardcode inline z-indexes (e.g., `z-50`, `z-40`). Always rely on this global stacking context configuration.

#### 3) Calendar Range Picker (`CalendarPicker`)
- **Range Selection**: Pass `mode="range"` to calendar components when picking intervals to enable start-date and end-date range selections.
- **Highlighting**: Selected days within the range must use a semi-transparent active background (`bg-primary/15`), with the start and end dates rounded and fully highlighted.

---

## Design Rules (Do's & Don'ts)

### Do
- Reserve `{colors.primary}` and `{colors.canvas}` as anchor surfaces.
- Push display letter-spacing negative.
- Use `{colors.accent-blue}` ONLY for hyperlinks, focus, and selection.
- Compose every CTA as a pill (`{rounded.pill}`).
- Use Surface levels (`canvas` -> `surface-1` -> `surface-2`) to show hierarchy.

### Don't
- No light mode. Dark only.
- No mid-tone gray text outside `{colors.ink-muted}`.
- Never use `{colors.accent-blue}` as fill.
- Never apply gradients to section backgrounds (Gradients are for cards only).
- Don't combine more than one chromatic accent.

---

## Responsive Breakpoints

- **Desktop**: 1199px
- **Tablet**: 810px (Card grids 4-up -> 2-up, Nav collapses to hamburger)
- **Mobile-Lg**: 809px (Pricing table collapses to accordion)
- **Mobile-XS**: 98px
