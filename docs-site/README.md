# Docs Site

Next.js documentation site for Balloo platform.

## Setup

```bash
npm install
npm run dev
```

## Structure

```
docs-site/
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── docs/       # Documentation pages
│   │   ├── api/        # API routes
│   │   └── layout.tsx  # Root layout
│   ├── components/     # React components
│   ├── content/        # MDX content (symlink to docs-content/)
│   └── lib/            # Utilities
├── public/             # Static assets
└── mdx-components.tsx  # MDX component overrides
```

## Features

- MDX support
- Syntax highlighting
- Search
- Versioned docs
- Mobile responsive

## Content Source

Content is symlinked from `../docs-content/`:
```bash
ln -s ../../docs-content content
```

## Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Lint code

## Tech Stack

- Next.js 14 (App Router)
- MDX v2
- Tailwind CSS
- shadcn/ui
- Algolia Search (optional)
