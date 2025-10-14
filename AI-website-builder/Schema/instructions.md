You can do it either way, but to keep you moving fast without sharing the therapist’s doc here, I’ve written a **drop-in `instructions.md`** Copilot runbook. Put this file at `Schema/instructions.md`, then paste the therapist’s brief path (or the text) where indicated. Copilot will:

* **NOT** touch your `AI-website-builder/` source
* Create `/output/<praktijk-slug>/`
* Copy the whole template tree
* Fill placeholders using the therapist’s document
* Leave a validation checklist + diffs

---

# `Schema/instructions.md`

```md
# Copilot Runbook — Generate Therapist Website From Brief (NL/EU)

## Goal
Given a therapist’s document (the “brief”), create a **new site directory** named after the practice, **without modifying** the source project `AI-website-builder/`. Copy the entire template tree, then fill placeholders and content according to the brief and our schema/rules.

---

## Inputs (set these first)
- **BRIEF_PATH:** <REPLACE with path, e.g. `Input/therapist-briefs/van-der-meer/brief.pdf`>
- **PRAKTIJK_NAAM:** <REPLACE with the practice name as written by the therapist>
- **PRIMARY_CITY:** <e.g., Amsterdam, Rotterdam, …>  (if in brief; otherwise infer)
- **SLUG_RULE:** lowercase, ascii, spaces→`-`, strip diacritics, keep letters/numbers/dashes only

> Copilot: derive `PRAKTIJK_SLUG` from PRAKTIJK_NAAM using SLUG_RULE. Example: “Praktijk J. van der Meer” → `praktijk-j-van-der-meer`.

---

## Source & Output
- **SOURCE_DIR:** `AI-website-builder/`
- **OUTPUT_DIR:** `output/{{PRAKTIJK_SLUG}}/`

**Do not** modify anything under `AI-website-builder/`.

---

## What to copy
Copy the entire tree (preserve structure & casing):
```

AI-website-builder/
Docs/
Schema/
templates/
Assets/
Components/
Partials/        # if present
base.html
index.html         # if present



Paste into:

output/{{PRAKTIJK_SLUG}}/



---

## Link mode for preview
Use **file links** for local preview:
- Merge `Schema/links.file.json` into `{{links.*}}`
- Keep the runtime mapper script that loads `Schema/links.file.json`

(For production, we’ll swap to `Schema/links.pretty.json`, but not in this run.)

---

## Parsing the brief → schema fields
From **BRIEF_PATH**, extract structured fields that map to our schema. Keep tone B1 Dutch, warm, non-medical, and consistent with `Schema/tone-style.md`.

**Top-level site info**
- `site.brand_name`
- `site.therapist_name` (if different)
- `site.primary_city`
- `site.practice_type` (e.g., Psycholoog, Therapeut, Praktijk)
- `site.assets.logo_url` (leave as placeholder if not available)
- `features.blog_enabled` (true/false)
- `features.telehealth_enabled` (true/false)
- `site.contact.address`, `site.contact.phone`, `site.contact.email`
- `site.kvk_number`, `site.btw_number` (if provided)
- `meta.description` (≤ 150 chars; mention city)

**Home / Hero**
- `pages.home.hero.title`  (5–8 words, empathetic)
- `pages.home.hero.subtitle` (mention city)
- `pages.home.hero.cta_primary.label` (default: “Afspraak maken”)

**Intro & Services**
- `pages.home.intro.heading`, `pages.home.intro.paragraphs[0]`, (optional) `bullets[]`
- `pages.home.services_overview.items[]` → `title`, `short`, `href` (can be anchors or separate pages)

**About**
- `pages.about.title`
- `pages.about.bio_html` (120–180 words, first-person, no sensitive health info)
- `site.registers[]` as `{ name, id, url? }`

**Process**
- `pages.process.steps[]` → 3–5 items, each `{title, text≤40w}`

**Pricing**
- `pages.pricing.items[]` → `{label, price_eur_incl_vat, duration_min, notes?}`
- `pages.pricing.payment_methods[]`
- `pages.pricing.reimbursement_notes`
- `pages.pricing.cancellation_policy`

**FAQ**
- `pages.faq.qna[]` → `{q, a}` covering: afspraak, duur, online, annuleren, talen, privacy, vergoeding

**Testimonials (optional)**
- `pages.testimonials.quotes[]` → `{text, attribution?, detail?}` (no identifying health data)

**Privacy (optional)**
- `pages.privacy.*` (see `partials/privacy.html`)

If a field is missing, **use the component defaults** and keep placeholders.

---

## Filling process (safe)
1) **Create output dir**: `output/{{PRAKTIJK_SLUG}}/`
2) **Copy** all files/dirs from `AI-website-builder/` → `output/{{PRAKTIJK_SLUG}}/` (preserve structure)
3) **Do not edit SOURCE_DIR.**
4) In the **copied** files only, replace placeholders `{{...}}` using the schema values from the brief.
   - Keep `{{links.*}}` unresolved — runtime mapper + `Schema/links.file.json` will resolve in preview.
   - Keep images as provided URLs or leave placeholders.
5) Update `output/{{PRAKTIJK_SLUG}}/index.html` title/meta via extracted `site.brand_name`, `meta.description`.
6) Ensure **AVG consent** is present on contact form (already templated).
7) Ensure prices display **incl. BTW** (already templated).
8) Keep tone/style consistent with `Schema/tone-style.md`.

---

## Output checklist (write to `output/{{PRAKTIJK_SLUG}}/REPORT.md`)
- Practice slug & final paths
- Pages generated and any fields left as defaults/placeholders
- Link mode used: `links.file.json`
- Any content you inferred (and why)
- TODOs for assets (logo, photos, hero image, map embed)

---

## Acceptance criteria
- `output/{{PRAKTIJK_SLUG}}/` opens cleanly in Live Server
- All nav/cta links work (resolved by runtime mapper)
- No edits in `AI-website-builder/`
- Contact page has consent checkbox linking to `{{links.privacy}}`
- Pricing shows `incl. BTW`
- No sensitive health data or diagnoses appear in testimonials or bios

---

## Commands & prompts for Copilot (example)
> **Step 1 — Set variables**  
> PRAKTIJK_NAAM = “Praktijk J. van der Meer”, PRIMARY_CITY = “Utrecht”; BRIEF_PATH = `Input/therapist-briefs/van-der-meer/brief.pdf`. Create PRAKTIJK_SLUG per SLUG_RULE.

> **Step 2 — Create output & copy**  
> Create `output/praktijk-j-van-der-meer/` and copy the entire `AI-website-builder/` tree into it. Do not modify the source.

> **Step 3 — Parse the brief**  
> Read `brief.pdf`. Extract schema fields as described in this runbook. Keep tone/style per `Schema/tone-style.md`.

> **Step 4 — Fill placeholders**  
> In `output/praktijk-j-van-der-meer/`, replace `{{...}}` placeholders with extracted values. Leave `{{links.*}}` unresolved. Ensure Dutch B1 tone. Keep GDPR consent.

> **Step 5 — Report**  
> Write `output/praktijk-j-van-der-meer/REPORT.md` with decisions, missing data, and TODOs.

---

## Notes
- Local preview: `links.file.json` + runtime mapper = working `.html` links.
- Production later: swap to `links.pretty.json` (build step or agent merge).
- If the brief is a DOCX/PDF, summarize and then convert to fields. Prefer exact quotes only where appropriate (e.g., tagline), not for long bios.


