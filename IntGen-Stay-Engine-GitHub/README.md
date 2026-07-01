# IntGen Stay Intelligence Engine

Static demo reference for a hospitality AI platform experience.

## Modules

1. AI Training Platform
2. AI Security Command Center
3. Intelligent Demand Forecasting

## Demo Entry

Open `index.html` from the project root, or deploy the folder as a static site.

Key demo paths:

- `index.html` - landing page
- `apps/ai-training/index.html` - AI Training Platform
- `apps/security-command-center/index.html` - AI Security Command Center
- `operations/index.html#/operations` - Demand Forecasting operations overview
- `lobby/index.html#/lobby` - Demand Forecasting lobby heatmap

## Deploy

This is a static site. No build step is required.

For Cloudflare Pages or GitHub Pages, use the project root as the publish directory.

## Notes

- Keep all files and folders in place because pages use relative asset paths.
- Video assets are stored in `assets/video/`.
- The Demand Forecasting pages use hash routes so they work on static hosting.
