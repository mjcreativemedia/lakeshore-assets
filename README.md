# Lakeshore Assets

This repository stores shared image assets that power multiple Lakeshore projects. Each site has its own curated library of hero imagery, service visuals, location references, and equipment photos that can be imported across front-end experiences.

## Folder structure

- `sites/` – Contains individual site libraries (`site01` … `site50`). Every site includes:
  - `hero/` – Landing and hero imagery that appears at the top of pages.
  - `services/` – Visuals that correspond to individual services.
  - `locations/` – Photos mapped to specific service areas or routes.
  - `equipment/` – Shots of tools, trucks, and team members in action.
- `manifests/` – JSON manifests (`site01.json` … `site50.json`) that map image metadata for each site.
- `components/RemotePicture.astro` – Helper component that renders manifest-backed images.
- `validate-images.js` – Script that confirms manifest data is complete and that files exist on disk.

## Naming conventions

- Keep folder names and structure consistent for all sites (`hero`, `services`, `locations`, `equipment`).
- Image files must use **kebab-case** (e.g. `snow-removal-team.webp`).
- File names should be descriptive and reference the subject of the image.

## Image specifications

- All assets should be exported as **WebP** files.
- Required dimensions: **2400 × 1600** pixels to maintain a 3:2 aspect ratio.

## Manifests (`manifests/siteXX.json`)

Every image entry in a site manifest must include the following fields:

| Field | Description |
| --- | --- |
| `id` | Unique identifier used in code. |
| `path` | Relative path inside the repository (e.g. `sites/site01/hero/snow-removal.webp`). |
| `alt` | Accessible description of the image. |
| `width` | Pixel width of the file (should be 2400). |
| `height` | Pixel height of the file (should be 1600). |

Additional validation rules enforced by `validate-images.js`:

- Paths must begin with the corresponding site folder (e.g. entries in `site12.json` point to `sites/site12/...`).
- Files must use the `.webp` extension.
- Width and height must be positive numbers.
- Referenced files must exist on disk.

## RemotePicture.astro component

The `components/RemotePicture.astro` helper reads from the appropriate site manifest and renders an image within Astro's `<picture>` element.

### Usage

```astro
---
import RemotePicture from "../components/RemotePicture.astro";
---
<RemotePicture site="site01" id="snow-removal-hero" priority class="hero-image" />
```

1. Place your image inside the correct site and category folder (e.g. `sites/site12/services/new-offer.webp`).
2. Add an entry with all required fields to `manifests/site12.json`.
3. Import the component where needed and reference the `site` and `id` props. When omitted, `site` defaults to `site01`.
4. Use the optional `priority` prop for images that should load eagerly; omit it for default lazy loading.
5. Pass any additional attributes (e.g. `class`, `data-*`) directly to the rendered `<img>` element.

## Validation

Run the manifest validation script after updating assets:

```bash
node validate-images.js
```

The script iterates over every manifest to confirm each entry includes the required fields, that the referenced files exist on disk, and that file paths align with their site manifest.
