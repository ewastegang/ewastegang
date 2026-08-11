# ewastegang.org

Static site — plain HTML, Tailwind CSS via CDN, and one small vanilla JS file.
No build step, no npm, no framework. Drop the files in a repo, turn on GitHub
Pages, done.

## Files

| File | What it is |
|---|---|
| `index.html` | Home |
| `about.html` | About us — story, vision, values, founder |
| `workshops.html` | Curriculum, session finder, "bring us to your school" |
| `get-involved.html` | Donate hardware, donate funds, volunteer, PGP key |
| `services.html` | Repair pricing, data destruction, consulting, e-stores |
| `site.css` | Brand tokens + the handful of things Tailwind can't do |
| `site.js` | Mobile nav, scroll reveals, counters, copy buttons, forms |
| `*.jpg` / `*.JPEG` / `*.png` | Workshop photos and crypto logos, referenced from the repo root |

## Deploying to GitHub Pages

1. Copy everything into the root of your repo (or a `/docs` folder).
2. Repo → **Settings → Pages** → Source: *Deploy from a branch* → pick your
   branch and `/ (root)`.
3. Wait a minute, then load the URL Pages gives you.

**Filenames are case-sensitive on GitHub Pages** even though they aren't on
macOS or Windows. `IMG_7223.JPEG` and `img_7223.jpeg` are different files there.
Don't rename anything unless you also update the `src` in the HTML.

## Things to edit before you publish

Search the HTML for `EDIT ME` — every spot is commented. The list:

- **Impact numbers** (`index.html`, "By the numbers"). These are placeholders.
  Replace the `data-count-to` values and the labels under them with your real
  figures. A true small number beats an invented big one.
- **Social links.** Every `<a href="#" aria-label="Facebook">` in the footers
  needs your real profile URL. Five files.
- **PO Box number** (`get-involved.html`, "Check or money order").
- **Founder portrait** (`about.html`). Currently uses a workshop photo. Add
  `me.jpg` to the repo and swap the `src`.
- **YouTube link** (`get-involved.html`, wipe-your-device section).
- **Store URLs** (`services.html`) — currently pointing at ebay.com / etsy.com /
  opensea.io homepages.
- **Polygon logo** (`get-involved.html`) — add `polygon.jpg` and swap the `POL`
  placeholder box for an `<img>` like the other coins.
- **Workshop dates** (`workshops.html`) — each card says "Dates announced by
  email". Copy a card and put a real date, time and venue in when you have one.

## How the forms work

GitHub Pages is static — there's no server to receive a form post. Both forms
assemble a pre-filled email and open the visitor's mail app. Nothing sends until
they press send.

To get real form submissions instead, sign up for a free static-form service
(Formspree, Basin, Netlify Forms) and on the `<form>` tag:

```html
<!-- replace this -->
data-mailto-form data-mailto-to="service@ewastegang.org" data-mailto-subject="…"

<!-- with this -->
action="https://formspree.io/f/YOUR_ID" method="POST"
```

Everything else on the form keeps working.

## Brand colours

Defined once in `site.css` under `:root`, and mirrored in the `tailwind.config`
block at the top of each HTML file. **Change both** if you change a colour.

| Token | Hex | Used for |
|---|---|---|
| `ink` | `#070C15` | Page background |
| `panel` | `#101B2C` | Cards and raised surfaces |
| `line` | `#23324B` | Hairline borders |
| `circuit` | `#35E08A` | Primary green — buttons, accents |
| `volt` | `#4CC9FF` | Electric blue — eyebrows, links |
| `platter` | `#C7D3E3` | Body text |
| `solder` | `#F4B740` | Warnings only ("we can't take these") |

## Accessibility

Skip link, visible keyboard focus rings, `aria-current` on the active nav item,
labelled form fields, alt text on every photo, and `prefers-reduced-motion`
honoured (the ticker stops and reveals turn off). Please keep these when editing.

## Unused photos

These are in the repo but not on any page — mostly near-duplicates of shots that
are used. Good spares if you want to swap something out:

`20240921_124801.jpg`, `20260718_115334.jpg`, `20260718_115359.jpg`,
`20260718_115438.jpg`, `20260718_1154380.jpg`, `20260718_124508.jpg`,
`20260718_124529.jpg`, `20260718_124653.jpg`, `IMG_6299.JPEG`,
`IMG_7296.jpeg`, `IMG_7299.jpeg`, `IMG_8946.JPEG`
