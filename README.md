# Lena B — Data Analyst Portfolio

A single-page, ATS-friendly portfolio built with plain HTML, CSS and JavaScript (no build tools required). Themed around an analyst's own workspace — ledger lines, spreadsheet grids, and a live "dashboard" hero panel — instead of a generic dev-portfolio template.

## File structure

```
portfolio/
├── index.html          # all page content + SEO meta + structured data
├── css/
│   └── style.css       # design tokens, layout, dark/light theme, animations
├── js/
│   └── script.js       # theme toggle, nav, scroll-reveal, count-up, form logic
├── assets/
│   ├── profile.jpg      # your photo
│   └── Lena-B-Resume.pdf # downloadable résumé (your uploaded PDF)
└── README.md
```

No dependencies to install. It's three static files plus assets — open `index.html` in a browser and it works.

## Running it locally

Just double-click `index.html`, or for a closer-to-production preview, serve it:

```bash
cd portfolio
python3 -m http.server 8000
# visit http://localhost:8000
```

## Making the contact form actually send email (2 minutes)

The form has full client-side validation and a spam honeypot already wired up. Right now, until you connect an endpoint, it **falls back to opening the visitor's email client** pre-filled with their message — so it's usable immediately, but the recommended setup is:

1. Go to **https://formspree.io** and sign up free (50 submissions/month on the free tier).
2. Create a new form, point it at `lenabasheer.in@gmail.com`.
3. Copy the form endpoint it gives you (looks like `https://formspree.io/f/abcd1234`).
4. Open `js/script.js` and replace:
   ```js
   var FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
   ```
   with your real endpoint.
5. Done — submissions will now email you directly, with success/error states shown inline and no page reload.

Alternative services that work the same way if you'd rather not use Formspree: **Getform.io**, **Web3Forms**, or a **Netlify Forms** attribute if you deploy on Netlify (`<form netlify>`).

## Deployment

### Vercel
```bash
npm i -g vercel
cd portfolio
vercel
```
Follow the prompts — no config needed, it's detected as a static site.

### Netlify
- Drag-and-drop the `portfolio` folder onto https://app.netlify.com/drop, **or**
```bash
npm i -g netlify-cli
cd portfolio
netlify deploy --prod
```

### GitHub Pages
```bash
cd portfolio
git init
git add .
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/lena-basheer/portfolio.git
git push -u origin main
```
Then in the repo: **Settings → Pages → Deploy from branch → main → / (root)**. Your site will be live at `https://lena-basheer.github.io/portfolio`.

## What's already handled

- **ATS-friendly / SEO**: semantic HTML5 (`<header>`, `<main>`, `<section>`, `<article>`), meta description/keywords, Open Graph + Twitter card tags, and a JSON-LD `Person` schema block for rich search results.
- **Accessibility**: skip-to-content link, visible focus states, `aria-label`/`aria-live` on interactive elements, honors `prefers-reduced-motion`, sufficient color contrast in both themes.
- **Performance**: no frameworks or build step, one external font request, lazy-loaded image, animations run on transform/opacity only (GPU-friendly).
- **Dark/light mode**: toggle in the navbar, persisted via `localStorage`, respects system preference on first visit.
- **No phone number** anywhere on the page, per your instructions.
- **No skill ratings/bars** — skills are shown as grouped badges only.

## Content notes — things I filled in or need your review

- Your resume didn't list formal work experience (job titles/companies), only projects, education and certifications — so instead of inventing a fake job history, I built a **"Journey" timeline** that sequences your real education, certifications and project builds chronologically. If you *do* have internship or job experience to add, tell me and I'll slot in a proper Experience section above it.
- Project **GitHub links** currently point to your general GitHub profile (`github.com/lena-basheer`) and portfolio repo, since your resume didn't include individual repo URLs. Swap in the real per-project repo links in `index.html` (search for `TODO` isn't marked there directly — look for the `.project-links` blocks) once each project has its own repo.
- Your location line in Contact uses your city/state from the resume header, with the phone number deliberately omitted as requested.
- Résumé download button serves your original uploaded PDF as-is (`assets/Lena-B-Resume.pdf`) — replace that file if you update your résumé later, filename can stay the same so the link keeps working.

## Enhancement suggestions (optional next steps)

1. **Custom domain** — you already reference `lenabasheer.in` in the JSON-LD; point that domain at Vercel/Netlify once deployed.
2. **Project screenshots** — swap the accent-colored card headers for real dashboard/notebook screenshots from each project for stronger visual proof.
3. **Blog / case-study pages** — turn each project card's "Case study" link into a real subpage walking through your process (great for demonstrating communication skills to recruiters).
4. **Analytics** — add a privacy-friendly analytics snippet (e.g. Plausible or Vercel Analytics) to see which sections recruiters spend time on.
5. **Testimonials** — once you have a manager/professor reference, a short quote block near Contact adds social proof.
6. **Favicon** — currently a generated inline SVG "L" mark; swap for a custom-designed one if you want stronger branding.
