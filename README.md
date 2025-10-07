# Lakeshore Assets

This repository stores shared image assets that power multiple Lakeshore projects. The files in this repo provide a single source of truth for hero imagery, service visuals, location references, and equipment photos that can be imported across front-end experiences.

## Folder structure

- `hero/` – Landing and hero images that appear at the top of pages.
- `services/` – Visuals that correspond to individual services.
- `locations/` – Photos mapped to specific service areas or routes.
- `equipment/` – Shots of tools, trucks, and team members in action.

## Naming conventions

- Folders are organized by content type as listed above.
- Image files must use **kebab-case** (e.g. `snow-removal-team.webp`).
- File names should be descriptive and reference the subject of the image.

## Image specifications

- All assets should be exported as **WebP** files.
- Required dimensions: **2400 × 1600** pixels to maintain a 3:2 aspect ratio.

## Manifest (`images.json`)

Every image entry in `images.json` must include the following fields:

| Field | Description |
| --- | --- |
| `id` | Unique identifier used in code. |
| `path` | Relative path inside the repository (e.g. `hero/snow-removal.webp`). |
| `alt` | Accessible description of the image. |
| `width` | Pixel width of the file (should be 2400). |
| `height` | Pixel height of the file (should be 1600). |

## RemotePicture.astro component

The `components/RemotePicture.astro` helper reads from the manifest and renders an image with Astro's `<picture>` element.

### Usage

```astro
---
import RemotePicture from "../components/RemotePicture.astro";
---
<RemotePicture id="snow-removal-hero" priority />
```

1. Add your image to the correct folder and export it as WebP.
2. Create a new entry in `images.json` with all required fields.
3. Import the component where you need it and reference the image `id`.
4. Set the optional `priority` prop to `true` for images that should load eagerly (like above-the-fold hero images). Leave it out for default lazy loading.

## Validation

Run the manifest validation script after updating assets:

```bash
node validate-images.js
```

The script ensures every manifest entry includes alt text, width, height, and that the referenced file exists on disk.
