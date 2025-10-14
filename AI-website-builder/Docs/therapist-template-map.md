# Therapist Website — Component Map & Content Model (NL/EU)

A reusable component system your AI can fill to generate a starter site (HTML, then WordPress). Focused on Dutch/EU compliance and therapist UX.

---

## 1) Global Config (site-level)

**Keys**

* `site.locale` (e.g., `nl-NL`)
* `site.brand_name` (string)
* `site.therapist_name` (string)
* `site.practice_type` (solo | group)
* `site.primary_city` (string)
* `site.contact.phone` (string, E.164 preferred)
* `site.contact.email` (string)
* `site.contact.address` (string)
* `site.contact.map_embed_url` (string, optional)
* `site.kvk_number` (string, required in NL)
* `site.btw_number` (string, if applicable)
* `site.registers` (array of `{name, id, url}` e.g., BIG/NIP/LVVP/NVPA)
* `site.languages` (array, e.g., `["Nederlands","Engels"]`)
* `site.color_theme` (object: `primary`, `accent`, `muted`, `bg`)
* `site.typography` (object: `heading`, `body`)
* `site.assets.logo_url` (string)
* `site.assets.hero_image_url` (string)
* `site.social` (array of `{platform, url}`)
* `site.cta.primary_label` (e.g., "Afspraak maken")
* `site.cta.primary_url` (e.g., link to Contact/Booking)
* `site.legal.privacy_url` (string)
* `site.legal.disclaimer` (short text)
* `site.cookies.banner_enabled` (bool)

**Flags**

* `features.telehealth_enabled` (bool)
* `features.blog_enabled` (bool)
* `features.testimonials_enabled` (bool)
* `features.client_portal_enabled` (bool)
* `features.locations` (array of `{name,address,map_embed_url}`)

---

## 2) Navigation/Header

**Component:** `HeaderNav`

* Props: `brand_name`, `logo_url`, `menu` (array of `{label, href}`), `cta` (`{label, href}`)
* Variants: sticky vs static; transparent vs solid bg
* Accessibility: skip-to-content link; nav landmarks

Menu defaults (NL): Home, Over mij, Therapie, Werkwijze, Tarieven, FAQ, Blog (opt), Contact

---

## 3) Hero

**Component:** `Hero`

* Props: `title`, `subtitle`, `background_image_url`, `cta_primary` (`{label, href}`), `cta_secondary` (optional)
* Copy guidance: empathetic, non-clinical; avoid medical claims; use “begeleiding bij”

---

## 4) Intro / Problem Statement

**Component:** `IntroBlock`

* Props: `heading`, `paragraphs` (array), `bullets` (optional)
* Goal: validate feelings, set tone of safety and hope

---

## 5) Services Overview

**Component:** `ServiceCards`

* Props: `items` array of `{slug, title, short, icon_url?, image_url?, href}`
* Layout: 3–6 cards grid
* SEO: internal links to service detail pages

---

## 6) Service Detail Page

**Component:** `ServiceDetail`

* Route: `/therapie/[slug]`
* Props: `title`, `for_whom`, `what_it_is`, `approach`, `format` (individual/relatie/online), `duration`, `expected_outcomes` (non-medical claims), `cta`
* Compliance: phrase as "begeleiding bij [klachten]", add crisis disclaimer

---

## 7) Werkwijze (Process)

**Component:** `ProcessSteps`

* Props: `steps` array of `{title, text}`
* Optional: timeline visual; note intake → traject → evaluatie; online vs in-person

---

## 8) Tarieven & Vergoeding

**Component:** `Pricing`

* Props: `items` array of `{label, price_eur_incl_vat, duration_min, notes}`
* Props: `reimbursement_notes` (text), `cancellation_policy` (text), `payment_methods` (chips)
* Legal (NL): prices incl. BTW; display KVK/BTW (also in footer)

---

## 9) FAQ / Practical Info

**Component:** `FAQ`

* Props: `qna` array of `{q, a}`
* Typical topics: afspraken, duur, online, annuleren, bereikbaarheid, talen, geen-crisisdienst

---

## 10) Testimonials (optional)

**Component:** `Testimonials`

* Props: `quotes` array of `{text, attribution?}` (no identifying details)
* Compliance: anonymize; avoid health claims

---

## 11) Blog / Resources (optional)

**Component:** `BlogTeasers`

* Props: `posts` array of `{slug, title, excerpt, date_iso, href}`
* CTA at end: kennismakingsgesprek

**Article page:** `BlogArticle`

* Props: `title`, `date_iso`, `author`, `content_html`, `cta`

---

## 12) Contact / Booking

**Component:** `ContactForm`

* Fields: `name` (text), `email` (email), `phone` (tel optional), `topic` (select optional), `message` (textarea)
* GDPR: consent checkbox `consent_text` with link to privacy; required to submit
* Props: `alt_contacts` (email/phone), `map_embed_url`
* Submission: POST to your backend; avoid storing more data than needed

---

## 13) Location Map (optional)

**Component:** `MapEmbed`

* Props: `map_embed_url`, `address`, `transport_parking` (text)

---

## 14) Footer

**Component:** `Footer`

* Props: `quick_links` (array), `contact`, `kvk`, `btw`, `privacy_url`, `social`
* Always show KVK/BTW when applicable; copyright notice

---

## 15) Legal Pages

**Page:** `Privacyverklaring`

* Sections: data collected, purpose, legal basis, retention, processors, rights (inzage, rectificatie, verwijdering), DPO/contact, cookies, analytics, security, complaints authority (Autoriteit Persoonsgegevens)

**Page:** `Disclaimer` (optional)

* No crisisdienst; not a replacement for acute zorg; emergency numbers

**Page:** `Cookies` (if banner enabled)

* Categories, consent, preference management

---

## 16) Reusable Micro-components

* `SectionHeader` (eyebrow, title, subtext)
* `CTAButton` (`label`, `href`, `style=primary|secondary|ghost`)
* `RichText` (sanitized HTML)
* `MediaBlock` (`image_url|video_url`, `caption`)
* `BadgeList` (chips for payment methods, languages)
* `Accordion` (for FAQ)

---

## 17) Content JSON Schema (high level)

```json
{
  "site": {"locale":"nl-NL","brand_name":"","therapist_name":"","primary_city":"","contact":{"phone":"","email":"","address":"","map_embed_url":""},"kvk_number":"","btw_number":"","registers":[{"name":"LVVP","id":"","url":""}],"languages":["Nederlands"],"color_theme":{"primary":"#2A6F6F","accent":"#D6A75C","muted":"#6B7280","bg":"#FAFAFA"},"typography":{"heading":"Inter","body":"Inter"},"assets":{"logo_url":"","hero_image_url":""},"social":[{"platform":"LinkedIn","url":""}],"cta":{"primary_label":"Afspraak maken","primary_url":"/contact"},"legal":{"privacy_url":"/privacy","disclaimer":"Deze website biedt geen crisisdienst."},"cookies":{"banner_enabled":true}},
  "features":{"telehealth_enabled":true,"blog_enabled":true,"testimonials_enabled":true,"client_portal_enabled":false,"locations":[{"name":"Centrum","address":"","map_embed_url":""}]},
  "pages": {
    "home": {
      "hero": {"title":"Je hoeft het niet alleen te doen","subtitle":"Praktijk voor therapie in {{primary_city}}","background_image_url":"","cta_primary":{"label":"Afspraak maken","href":"/contact"}},
      "intro": {"heading":"Loop je vast?","paragraphs":["Soms is het veel."],"bullets":["Stress","Onzekerheid","Relatieproblemen"]},
      "services_overview": {"items":[{"slug":"individueel","title":"Individuele therapie","short":"Samen helderheid vinden","href":"/therapie/individueel"}]},
      "about_snippet": {"photo_url":"","text":"Ik ben {{therapist_name}}...","href":"/over"},
      "testimonials": {"quotes":[{"text":"Ik voelde me gezien."}]},
      "cta_band": {"title":"Klaar voor een eerste stap?","cta":{"label":"Plan kennismaking","href":"/contact"}}
    },
    "about": {"title":"Over mij","bio_html":"<p>...</p>","registers":[{"name":"BIG","id":"","url":""}]},
    "services": [
      {"slug":"individueel","title":"Individuele therapie","for_whom":"Volwassenen","what_it_is":"...","approach":"CGT, ACT","format":"individueel","duration":"60 min","expected_outcomes":["Meer grip"],"cta":{"label":"Afspraak maken","href":"/contact"}}
    ],
    "process": {"steps":[{"title":"Intake","text":"We verkennen je vraag."},{"title":"Traject","text":"Samen aan doelen."},{"title":"Evaluatie","text":"We kijken terug en vooruit."}]},
    "pricing": {"items":[{"label":"Sessie (60 min)","price_eur_incl_vat":90,"duration_min":60,"notes":"Particulier tarief"}],"reimbursement_notes":"(Aanvullende verzekering)","cancellation_policy":"24 uur vooraf" ,"payment_methods":["Pin","Factuur"]},
    "faq": {"qna":[{"q":"Hoe maak ik een afspraak?","a":"Via het formulier of telefonisch."},{"q":"Bied je online sessies?","a":"Ja."}]},
    "blog": {"posts":[{"slug":"stress-verminderen","title":"Stress verminderen","excerpt":"Praktische tips","date_iso":"2025-01-15","href":"/blog/stress-verminderen"}]},
    "contact": {"lead_text":"Alle gesprekken zijn vertrouwelijk.","form":{"consent_text":"Ik ga akkoord met de verwerking van mijn gegevens volgens de privacyverklaring.","privacy_url":"/privacy"},"alt_contacts":{"email":"","phone":""},"map_embed_url":""},
    "privacy": {"sections":[{"title":"Welke gegevens","html":"<p>Contactformulier: naam, e-mail, bericht.</p>"},{"title":"Bewaartermijn","html":"<p>Maximaal 12 maanden.</p>"},{"title":"Rechten","html":"<p>Inzage, correctie, verwijdering.</p>"},{"title":"Contact","html":"<p>privacy@voorbeeld.nl</p>"}]}
  }
}
```

---

## 18) Placeholder & Naming Conventions

* Double curly braces for simple replacements: `{{therapist_name}}`, `{{primary_city}}`.
* Snake_case for JSON keys; kebab-case for CSS utility classes.
* Slugs: lowercase, `a-z0-9-` only.

---

## 19) Validation & Compliance Checklist (AI fill rules)

* **Language & tone:** empathetic; avoid medical claims; use “begeleiding bij …”.
* **Legal identifiers:** ensure `kvk_number` (required NL) and `btw_number` (if applicable) present; render in footer.
* **Prices:** include VAT if applicable and label clearly.
* **GDPR/AVG:** contact form must include consent checkbox referencing `/privacy`.
* **Crisis disclaimer:** show globally (footer or relevant pages). Provide emergency numbers on Disclaimer page if present.
* **Testimonials:** anonymize; no specific health outcomes.
* **Maps & tracking:** if using analytics or non-essential cookies, enable cookie banner and outline in Privacy page.

---

## 20) SEO & i18n

* Each page: `meta.title`, `meta.description`, canonical URL.
* Localized strings for CTAs (Dutch default). Keep slugs localized or decide strategy upfront.
* Structured data (optional): `Organization`/`LocalBusiness` (practice), `Person` (therapist) with address & phone.

---

## 21) Component-to-WordPress Mapping

* `HeaderNav` → WP Menu + Site Identity.
* `Hero`, `IntroBlock`, `ServiceCards`, `ProcessSteps`, `Pricing`, `FAQ`, `Testimonials`, `ContactForm` → Custom Blocks (ACF/Block JSON) or Gutenberg patterns.
* `ServiceDetail` → CPT `service` with fields (for_whom, approach, format, duration, outcomes).
* `Blog` → default Posts.
* `Privacy`/`Disclaimer` → Pages.

---

## 22) Example Minimal Payload (ready for AI fill)

```json
{
  "site": {
    "locale": "nl-NL",
    "brand_name": "Praktijk Licht",
    "therapist_name": "Sara Jansen",
    "primary_city": "Rotterdam",
    "contact": {"phone": "+31101234567", "email": "info@praktijklicht.nl", "address": "Van Oldenbarneveltstraat 12, 3012 GS Rotterdam"},
    "kvk_number": "81234567",
    "btw_number": "NL001234567B01",
    "cta": {"primary_label": "Afspraak maken", "primary_url": "/contact"},
    "legal": {"privacy_url": "/privacy", "disclaimer": "Geen crisisdienst. Bel 112 bij nood."}
  },
  "features": {"telehealth_enabled": true, "blog_enabled": false, "testimonials_enabled": true},
  "pages": {
    "home": {"hero": {"title": "Je hoeft het niet alleen te doen", "subtitle": "Therapie en coaching in Rotterdam", "background_image_url": "/img/hero.jpg", "cta_primary": {"label": "Plan kennismaking", "href": "/contact"}}, "services_overview": {"items": [{"slug": "individueel", "title": "Individuele therapie", "short": "Rust en richting", "href": "/therapie/individueel"}, {"slug": "relatie", "title": "Relatietherapie", "short": "Beter begrijpen", "href": "/therapie/relatie"}]}, "about_snippet": {"photo_url": "/img/sara.jpg", "text": "Ik ben Sara, psycholoog in Rotterdam.", "href": "/over"}},
    "services": [{"slug": "individueel", "title": "Individuele therapie", "for_whom": "Volwassenen", "what_it_is": "Begeleiding bij stress en onzekerheid", "approach": "ACT, CGT", "format": "individueel", "duration": "60 min", "expected_outcomes": ["Meer grip"], "cta": {"label": "Afspraak maken", "href": "/contact"}}],
    "pricing": {"items": [{"label": "Sessie (60 min)", "price_eur_incl_vat": 90, "duration_min": 60}], "cancellation_policy": "Annuleren tot 24 uur van tevoren.", "payment_methods": ["Pin", "Factuur"]},
    "faq": {"qna": [{"q": "Bied je online sessies?", "a": "Ja, via beeldbellen."}]},
    "contact": {"lead_text": "Alle gesprekken zijn vertrouwelijk.", "form": {"consent_text": "Ik ga akkoord met de verwerking van mijn gegevens volgens de privacyverklaring.", "privacy_url": "/privacy"}}
  }
}
```

---

## 23) Next Step

If this structure looks good, I’ll produce the **HTML template skeleton** with semantic sections and placeholder hooks that map 1:1 to this model.
