# All Things Blog

A modern, modular blog application built with Next.js, React, and TypeScript. The blog automatically generates navigation from markdown files organized in a directory structure.

## Features

- ⚡️ Next.js 14 with App Router
- ⚛️ React 18
- 📘 TypeScript
- 🎨 Modern, minimal UI styled like allthingsdistributed.com
- 🚀 Static export ready for GitHub Pages
- 📝 Markdown content rendering with ReactMarkdown
- 🗂️ **Automatic menu generation** from directory structure
- 🔗 **Dynamic URL routing** that reflects page paths
- 📋 **Nested dropdown menus** for organized navigation

## Project Structure

```
all-things-blog/
├── app/
│   ├── [...slug]/          # Dynamic route handler for all pages
│   │   └── page.tsx
│   ├── components/
│   │   └── Menu.tsx        # Menu component with dropdown support
│   ├── globals.css         # Minimal styling
│   ├── layout.tsx
│   └── page.tsx            # Root page (shows first home page)
├── lib/
│   └── pageUtils.ts        # Utilities for reading pages directory
├── pages/                  # Content directory - add your .md files here
│   ├── home/
│   │   └── sample-article.md
│   └── random/
│       ├── article1.md
│       ├── article2.md
│       └── random_video.md
└── ...
```

## How It Works

### Directory Structure → Navigation Menu

The blog automatically builds the navigation menu from the `pages/` directory structure:

- **Directories** become top-level menu items (e.g., `pages/home/` → "Home" menu)
- **Folders with multiple items** automatically get dropdown menus
- **Markdown files** (.md) become menu links
- **Nested folders** are supported with nested dropdown menus

### URL Routing

The URL structure directly maps to your file structure:
- `pages/random/random_video.md` → `/random/random_video`
- `pages/home/sample-article.md` → `/home/sample-article`

### Adding New Content

Simply add new markdown files to the `pages/` directory structure:

1. Create a new `.md` file in any directory under `pages/`
2. The file will automatically appear in the navigation menu
3. No code changes required - the system discovers new files at build time

**Example:**
```
pages/
  └── articles/
      ├── tech/
      │   └── ai-trends.md       # Will appear in Articles → Tech dropdown
      └── design/
          └── ui-patterns.md     # Will appear in Articles → Design dropdown
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Markdown File Format

Markdown files should follow this format:

```markdown
### Article Title

November 25, 2025 • 3915 words

[picture]

Your article content here...

You can use standard markdown syntax, including:
- Headers
- Lists
- Links
- Images
- Code blocks
- And more!
```

## Navigation Behavior

- **Top-level folders** (e.g., `home`, `random`) appear as menu buttons
- **Folders with children** show a dropdown arrow (▼) and expand on hover/click
- **Markdown files** are clickable links that navigate to that page
- **Active page** is highlighted in the navigation
- **Nested dropdowns** are supported for deeply nested folder structures

## Deployment

The project is configured for static export and can be deployed to GitHub Pages. The deployment workflow is set up in `.github/workflows/deploy.yml`.

After deployment, your site will be available at:
- `https://kbibireddy.github.io/all-things-blog/`

Individual pages will be accessible at:
- `https://kbibireddy.github.io/all-things-blog/random/random_video`
- `https://kbibireddy.github.io/all-things-blog/home/sample-article`
- etc.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI:** React 18
- **Styling:** CSS (minimal, inspired by allthingsdistributed.com)
- **Markdown:** react-markdown with remark-gfm
- **Routing:** Dynamic catch-all routes (`[...slug]`)

## Recent Changes

### Modular Architecture (Latest Update)

- ✅ Implemented dynamic routing system that maps `pages/` directory to URLs
- ✅ Created automatic menu generation from directory structure
- ✅ Added nested dropdown menu support for folders
- ✅ URLs now reflect the selected page path (e.g., `/random/random_video`)
- ✅ Simplified UI to match allthingsdistributed.com style
- ✅ Added utilities for reading and processing directory structure
- ✅ All new `.md` files automatically appear in navigation

### Previous Updates

- Initial setup with Next.js 14 and TypeScript
- Markdown rendering support
- GitHub Pages deployment configuration

## License

Private
