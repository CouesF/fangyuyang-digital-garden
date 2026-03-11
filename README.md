# fangyuyang-digital-garden

Personal website and knowledge base for Fang Yuyang. Built on the [Digital Garden Obsidian Plugin](https://github.com/oleeskild/Obsidian-Digital-Garden) template with a custom landing page layer on top.

**Live site:** your domain here

---

## Site Structure

```
/               Personal landing page (CV-style, no sidebar)
/garden/        Digital Garden knowledge base (Obsidian notes, file tree)
/notes/[slug]/  Individual note pages
```

The landing page and the knowledge base are intentionally separate: the landing page has a clean academic layout without the Digital Garden sidebar/navigation, while `/garden/` and all note pages retain the full Digital Garden chrome (file tree, backlinks, ToC, graph).

### Key directories

```
src/
├── helpers/
│   ├── userSetup.js          # Eleventy config hooks (add collections here)
│   └── userUtils.js          # Custom Eleventy utilities
└── site/
    ├── _data/
    │   ├── profile.json      # Personal info — bio, links, education
    │   ├── projects.json     # Papers and projects list
    │   ├── updates.json      # Manual daily updates feed entries
    │   ├── meta.js           # Site-wide metadata (reads .env)
    │   └── dynamics.js       # Auto-discovers user components/styles
    ├── _includes/
    │   ├── layouts/
    │   │   ├── home-layout.njk   # Standalone layout for landing page
    │   │   ├── index.njk         # Digital Garden home layout
    │   │   └── note.njk          # Individual note layout
    │   └── components/
    │       └── user/             # Safe zone: plugin never touches this
    ├── notes/                # Obsidian-synced markdown notes
    ├── styles/
    │   ├── user/
    │   │   └── homepage.scss # Landing page styles (academic clean)
    │   ├── custom-style.scss # Global custom styles
    │   └── ...               # Plugin-managed base styles
    └── home.njk              # Landing page template (permalink: /)
```

---

## Updating Content

### Personal info, bio, links

Edit `src/site/_data/profile.json`:

```json
{
  "name": "Fang Yuyang",
  "title": "Your title / research area",
  "bio": "2–3 sentence introduction.",
  "avatar": "/img/avatar.jpg",
  "links": {
    "email": "you@example.com",
    "github": "https://github.com/yourusername",
    "scholar": "https://scholar.google.com/...",
    "cv": "/path/to/cv.pdf"
  },
  "education": [...],
  "researchInterests": ["Topic A", "Topic B"]
}
```

Place your photo at `src/site/img/avatar.jpg` (any size; the CSS constrains it to 120px). If the file is missing the avatar silently hides.

### Papers and projects

Edit `src/site/_data/projects.json`. Each entry:

```json
{
  "title": "Paper / project title",
  "description": "One or two sentences.",
  "tags": ["NLP", "IoT"],
  "date": "2024-06",
  "featured": true,
  "links": {
    "paper": "https://...",
    "code":  "https://github.com/...",
    "demo":  "",
    "note":  "/notes/your-obsidian-note/"
  }
}
```

- `"featured": true` → rendered as a full card with description.
- `"featured": false` → rendered as a compact list item.
- `"note"` links to an Obsidian note page; leave empty if there is no note.

### Daily updates feed

Two ways to add entries (both show on the landing page, sorted by date):

**Option A — Obsidian note (preferred):**
1. Write a note in Obsidian.
2. Add to frontmatter: `dg-publish: true` and tag `daily-update`.
3. Sync via the Digital Garden plugin. The `dailyUpdates` Eleventy collection picks it up automatically.

**Option B — Direct file edit:**
Add an entry to `src/site/_data/updates.json`:
```json
{
  "title": "Started reading ...",
  "date": "2024-06-15",
  "content": "Optional one-line note.",
  "note": ""
}
```
Commit and push; Vercel redeploys automatically.

### Knowledge base (Obsidian notes)

Use the [Digital Garden Obsidian Plugin](https://github.com/oleeskild/Obsidian-Digital-Garden) as normal:
1. Add `dg-publish: true` to a note's frontmatter in Obsidian.
2. Run **Publish Single Note** or **Publish Multiple Notes** from the plugin.
3. The plugin pushes the file to `src/site/notes/` on GitHub and Vercel redeploys.

Notes published this way appear under `/notes/[slug]/` and are listed in the file tree at `/garden/`.

---

## Local Development

```bash
npm install
npm start        # dev server at http://localhost:8080
npm run build    # production build → dist/
```

> `get-theme` fetches an Obsidian CSS theme from GitHub. It may fail in restricted network environments; the build still succeeds using a locally cached theme if one exists.

---

## Deployment

The site deploys automatically to **Vercel** on every push to the default branch.

- Build command: `npm run build`
- Output directory: `dist/`
- Config: `vercel.json`

Custom domain: set in the Vercel dashboard and configure DNS to point at Vercel.

---

## Plugin Compatibility Warning

The Digital Garden plugin manages certain files and may overwrite them on updates. **One file was intentionally modified** from the plugin default:

| File | Change | Why |
|------|--------|-----|
| `src/site/notes/notes.11tydata.js` | `gardenEntry` permalink changed from `"/"` to `"/garden/"` | Frees up `/` for the custom landing page |

**After every Digital Garden plugin update**, check this file and re-apply the change if needed:

```js
// notes.11tydata.js — keep this line as /garden/, not /
return "/garden/";
```

All other customisations live in the plugin's safe zones (`components/user/`, `styles/user/`, `userSetup.js`, `_data/`) and are never overwritten by the plugin.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Static site generator | Eleventy (11ty) v2 |
| Templates | Nunjucks |
| Styles | Sass/SCSS |
| Markdown | markdown-it + plugins (MathJax, Mermaid, PlantUML, footnotes) |
| Deployment | Vercel |
| Content authoring | Obsidian + Digital Garden Plugin |
