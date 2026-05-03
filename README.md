# VisualSkill

A modern, responsive coding learning platform website built with vanilla HTML, CSS, and JavaScript — inspired by platforms like Codecademy, Udemy, and Dicoding.

## Project Description

VisualSkill is a front-end website for a fictional coding education platform. It features five fully responsive pages with a clean, modern design using a card-based layout, interactive JavaScript features, and a comprehensive CSS design system.

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Hero, stats, top courses, career CTA |
| Courses | `course.html` | Full course catalog with category filter |
| Career | `career.html` | Open positions, job cards, FAQ accordion |
| About | `about.html` | Story, vision/mission, values, team, stats |
| Register | `register.html` | Registration form with full validation |

## File Structure

```
SkillSkill/
├── index.html          # Home page
├── course.html         # Courses catalog page
├── career.html         # Career & jobs page
├── about.html          # About us page
├── register.html       # Registration page
├── css/
│   └── style.css       # All styles (external CSS only)
├── js/
│   └── script.js       # All JavaScript (external JS only)
├── assets/
│   └── images/         # Image assets directory
└── README.md
```

## Features

### Design
- Color scheme: Primary `#4F46E5` (indigo), Secondary `#10B981` (emerald), Accent `#F59E0B` (amber)
- Font: Inter (Google Fonts)
- CSS-only course thumbnails using gradient backgrounds
- CSS-only team avatars and icon elements
- Responsive across desktop, tablet, and mobile

### CSS Techniques Used
1. **Flexbox** — header/nav, hero layout, stats, footer, form layout
2. **CSS Grid** — course cards (3-col desktop → 2-col tablet → 1-col mobile)
3. **Media Queries** — `@media screen and (max-width: 700px)` and `(max-width: 1024px)`
4. **rem/em units** — font sizes via CSS custom properties
5. **max-width + auto margins** — container centering throughout

### JavaScript Features
1. **Active nav link** — highlights current page based on URL
2. **Mobile hamburger menu** — toggle show/hide on small screens
3. **Form validation** — 5 validation types without regex:
   - Email: checks for `@` and `.` character-by-character
   - Username: loops each char against allowed character set
   - Date of birth: compares Date objects for 18+ age check
   - Password strength: checks for uppercase and digit chars
   - Password match: strict equality comparison
4. **Course category filter** — filter courses by category buttons
5. **FAQ accordion** — expand/collapse with smooth max-height transition
6. **Scroll animations** — IntersectionObserver adds `.visible` class

## References

### Design Inspiration
- [Codecademy](https://www.codecademy.com) — interactive coding platform UI patterns
- [Udemy](https://www.udemy.com) — course card layout and catalog design
- [Dicoding](https://www.dicoding.com) — Indonesian coding platform structure
- [freeCodeCamp](https://www.freecodecamp.org) — clean educational layout
- [Scrimba](https://scrimba.com) — modern hero and course page design

### Fonts
- [Google Fonts — Inter](https://fonts.google.com/specimen/Inter) — primary typeface

### Color Palette
- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors) — inspiration for the indigo, emerald, and amber palette

### Icons
- Unicode/emoji characters only — no external icon libraries used

## No Inline Styles or Scripts

This project strictly uses:
- External CSS only (`css/style.css`) — no `style=""` attributes or `<style>` tags in HTML
- External JavaScript only (`js/script.js`) — no `onclick=""` attributes or `<script>` blocks in HTML
