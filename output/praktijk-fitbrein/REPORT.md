# Generation report — Praktijk FitBrein

Summary
-------

- Output directory: output/praktijk-fitbrein/
- Source template: AI-website-builder/ (copied, source not modified)

Populated templates
-------------------

Files copied and populated (scalar placeholders filled from provided JSON where available):

- index.html (filled title, meta description, hero copy, about snippet, footer contact placeholders)
- templates/base.html (copied)
- templates/components/header.html (copied, left {{links.*}} tokens intact)
- templates/components/hero.html (filled hero title/subtitle/cta, left image URL as TODO_HERO_IMAGE_URL)
- templates/components/about.html (filled bio and photo URL placeholder TODO_HEADSHOT_URL)
- templates/components/services.html (copied service items from schema)
- templates/components/contact.html (copied, form uses defaults; privacy link left as {{links.privacy}})
- templates/components/footer.html (copied, KVK/BTW left as TODO)
- templates/components/testimonial.html (copied; no testimonials in schema — default sample kept)
- templates/components/faq.html (copied)
- templates/components/pricing.html (copied; used fallback session price)
- templates/components/process.html (copied steps from schema)
- templates/Partials/privacy.html (copied, last_updated left as TODO_DATE_YYYY-MM-DD)
- templates/Assets/* (style and variables copied)
- Schema/links.file.json (copied for runtime link mapping)

Unresolved TODO fields
----------------------

These are placeholders that remain because the provided JSON contained TODO_* values or fields were missing:

- TODO_LOGO_URL (site.assets.logo_url)
- TODO_HERO_IMAGE_URL (site.assets.hero_image_url)
- TODO_HEADSHOT_URL (pages.about.photo_url / pages.home.about_snippet.photo_url)
- TODO_ADDRESS (site.contact.address)
- TODO_PHONE (site.contact.phone)
- TODO_EMAIL (site.contact.email)
- TODO_KVK (site.kvk_number)
- TODO_BTW (site.btw_number)
- TODO_CANCELLATION_POLICY (pages.pricing.cancellation_policy)
- TODO_DATE_YYYY-MM-DD (pages.privacy.last_updated_iso)

Notes / Assumptions
-------------------

- The practice slug was derived from `site.brand_name` = "Praktijk FitBrein" → `praktijk-fitbrein` and used as output folder name.
- Kept all {{links.*}} tokens unchanged — the runtime link mapper and `Schema/links.file.json` will resolve them in preview.
- For assets and contact fields that were "TODO_*" in the JSON, I left clear TODO placeholders in the copied files so they can be replaced later.
- Pricing items were empty in the JSON; I left a default session (60 min, €90 incl. BTW) in `pricing.html` as a sensible placeholder.
- Testimonials were empty; left the template default sample which contains no identifying health information.
- Privacy partial kept minimal defaults; `pages.privacy.last_updated_iso` left as TODO.
- All original comments and instructions from templates were preserved.

How to finish
-------------

1. Replace TODO_* placeholders in files under output/praktijk-fitbrein/ with real assets and contact details.
2. Optionally update pricing items in the JSON and re-run the generator to refresh pricing cards.
3. Serve the folder (e.g., Live Server) and ensure runtime link mapper can fetch `Schema/links.file.json` to resolve `{{links.*}}` tokens.

If you want, I can now replace the remaining TODO_* placeholders with values you provide (logo URL, headshot URL, address, phone, email, KVK, BTW, cancellation policy, privacy last-updated date) and re-run the fill.

Done by: automated generator (runbook: Schema/instructions.md)
