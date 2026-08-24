# QRIAN website — refactored structure

This folder is a refactor of the HTML / p5.js files you uploaded.

The main goal is:
**do not rebuild the same sidebar, cursor, sound system, world code, and project CSS inside every HTML page.**

## 1. Folder structure

```text
qrian-website-refactor/
│
├── index.html
├── qrian.html
├── hello.html
├── world.html
│
├── proof-of-tears.html
├── gaslighting.html
├── ...
├── project-template.html
│
├── css/
│   ├── base.css
│   ├── hello.css
│   ├── world.css
│   └── project.css
│
├── js/
│   ├── sound.js
│   ├── site-shell.js
│   ├── cursor.js
│   ├── home.js
│   ├── works-data.js
│   └── world.js
│
└── assets/
    └── images/
```

## 2. Where to edit what

### Site-wide sidebar / footer / `print("Hello, world!")`
Edit:

```text
js/site-shell.js
```

One edit changes it everywhere.

### Site-wide colours, typography, navigation sizing
Edit:

```text
css/base.css
```

### Cursor tear
Edit:

```text
js/cursor.js
```

The cursor is now one shared p5 instance instead of being copied into every page.

### Sound
Edit:

```text
js/sound.js
```

This is your existing `sound.js`, moved into `/js`.

### Home floating tears
Edit:

```text
js/home.js
```

### WORLD: add/remove/edit a project
Edit ONLY:

```text
js/works-data.js
```

For example:

```js
{
  title: "Proof of Tears",
  tags: ["emosmiths", "installation", "MR", "sound"],
  series: "Emosmiths",
  zone: "interactive",
  link: "proof-of-tears.html",
  desc: "Interactive Installation (...)",
  img: "assets/images/proof-of-tears/thumb.webp"
}
```

### WORLD: network physics / connections / interaction
Edit:

```text
js/world.js
```

You should not need to touch this when simply adding a project.

### WORLD: hover title / description / photo sizes
Open:

```text
css/world.css
```

At the VERY TOP there are variables:

```css
--world-photo-size
--world-title-size
--world-desc-size
--world-series-size
--world-tooltip-size
--world-node-scale
```

So later when you say "the hover title is too big",
you change ONE number instead of digging through `world.html`.

### Project/detail page visual system
Edit:

```text
css/project.css
```

All project pages use it.

Important:
this does NOT mean every project has to have the same layout.

You can reorder, remove, or add sections in each HTML file while keeping
the same typography / spacing / responsive system.

Useful building blocks:

```html
<section class="project-hero">...</section>

<section class="project-intro">...</section>

<section class="project-section">...</section>

<section class="project-gallery">...</section>

<section class="project-gallery two">...</section>

<section class="project-gallery one">...</section>

<section class="project-media-full">...</section>

<section class="project-meta">...</section>
```

## 3. Creating a new project page

Do NOT write a page from zero.

Copy:

```text
project-template.html
```

Rename it, e.g.:

```text
new-project.html
```

Then edit only the content and whichever sections that project actually needs.

## 4. Scaffold pages

I created project-page scaffolds for all works currently listed in your
`QRIAN.world` data, including pages that were not among the HTML files you uploaded.

For projects whose detailed source material was not supplied, I only used the
title / medium / tags already present in `world.html` and left the concept blank
with a TODO. I did not invent project descriptions.

The five uploaded detailed pages retain the concept text already present in them.

## 5. Existing filename issue fixed

The previous `Neither 0 Nor 1` project pages linked to:

```text
the-freelancer.html
ai-imposter-or-improver.html
```

but the uploaded files are actually:

```text
the-freelancer-never-feeling-free.html
ai-an-imposter-or-an-improver.html
```

The shared series navigation in this refactor uses the actual filenames.

## 6. Images

The Picsum images are still placeholders because those were the images in the
current working HTML.

Later, make folders like:

```text
assets/images/proof-of-tears/
assets/images/gaslighting/
assets/images/qrian-ep/
```

and replace URLs with relative paths such as:

```html
<img src="assets/images/proof-of-tears/hero.webp">
```

Likewise update the thumbnail in `js/works-data.js`.

## 7. GitHub

You can replace the current website files with this structure in your repo.

Because everything uses relative paths, it works whether the site is currently:

```text
qrian-dot-cloud.github.io/qrian-website/
```

or later:

```text
www.qrian.cloud/
```

`index.html` currently redirects to `qrian.html`, so the root URL has an entry point.
Later, if you want, `qrian.html` itself can become `index.html`.

## 8. Suggested next steps

1. Upload/test this refactor without changing the content.
2. Tune `css/world.css` hover sizes.
3. Redesign ONE detail page first — probably `proof-of-tears.html`.
4. Once that feels right, use the same building blocks for the rest.
5. Replace placeholder images with your archived/optimized images.
