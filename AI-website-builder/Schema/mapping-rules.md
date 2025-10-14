# mapping-rules.md — Concept to Field Mapping (Therapist Template, NL/EU)

**Purpose:** Define how to map information from therapist call summaries (AI-transcribed) into structured template fields described in `/docs/therapist-template-map.md`. This file helps Copilot or any agent understand *where each type of information belongs* in the website schema.

---

## 🧠 Mapping Overview

When the AI transcriber summarizes a therapist interview, it produces text like:

> “I help adults with anxiety and stress through ACT and mindfulness. Sessions last 60 minutes and can be done online or in person. My practice is based in Utrecht.”

This file explains how each of those data points should map to fields in the JSON schema or HTML placeholders.

---

## 1️⃣ Identity & Branding

| Data concept   | Template Field               | Notes                                                 |
| -------------- | ---------------------------- | ----------------------------------------------------- |
| Therapist name | `site.therapist_name`        | Use full name, e.g., “Sara Jansen”                    |
| Practice name  | `site.brand_name`            | If missing, fallback to `Praktijk {{therapist_name}}` |
| City / region  | `site.primary_city`          | Main location, for subtitle and meta tags             |
| Phone          | `site.contact.phone`         | Normalize to E.164 if possible                        |
| Email          | `site.contact.email`         | Lowercase, safe string                                |
| Address        | `site.contact.address`       | Include street, postal code, city                     |
| Map link       | `site.contact.map_embed_url` | Optional Google Maps embed URL                        |
| KVK number     | `site.kvk_number`            | Mandatory in NL                                       |
| BTW number     | `site.btw_number`            | Required if therapist invoices with VAT               |
| Registrations  | `site.registers[]`           | List of `{name, id, url}` (e.g., BIG, LVVP, NIP)      |
| Languages      | `site.languages[]`           | Example: `["Nederlands","Engels"]`                    |

---

## 2️⃣ Home Page Mapping

| Concept          | Target Field                           | Example                                       |
| ---------------- | -------------------------------------- | --------------------------------------------- |
| Empathic message | `pages.home.hero.title`                | “Je hoeft het niet alleen te doen”            |
| Location + offer | `pages.home.hero.subtitle`             | “Therapie en coaching in Utrecht”             |
| CTA              | `pages.home.hero.cta_primary`          | `{label: "Afspraak maken", href: "/contact"}` |
| Services summary | `pages.home.services_overview.items[]` | Derived from therapy types in summary         |
| About snippet    | `pages.home.about_snippet.text`        | First 1–2 sentences of therapist bio          |
| Testimonials     | `pages.home.testimonials.quotes[]`     | If client feedback exists; anonymize          |

---

## 3️⃣ Services / Therapy Types

| Concept                                           | Template Field                         | Transformation                                         |
| ------------------------------------------------- | -------------------------------------- | ------------------------------------------------------ |
| Type of therapy (e.g. ACT, EMDR, relatietherapie) | `pages.services[].title`               | Keep Dutch naming; capitalize first word               |
| Client group (volwassenen, koppels, jongeren)     | `pages.services[].for_whom`            | Simple phrase                                          |
| Description of what it is                         | `pages.services[].what_it_is`          | 60–120 words; plain Dutch                              |
| Method / approach                                 | `pages.services[].approach`            | Comma-separated list (e.g., “ACT, CGT”)                |
| Session format                                    | `pages.services[].format`              | individueel / relatie / online                         |
| Duration                                          | `pages.services[].duration`            | Include minutes (“60 min”)                             |
| Expected benefits                                 | `pages.services[].expected_outcomes[]` | Non-medical phrasing (e.g., “meer rust”, “helderheid”) |
| CTA                                               | `pages.services[].cta`                 | Always link to `/contact`                              |

---

## 4️⃣ Werkwijze (Process)

| Concept                    | Template Field                | Notes                                 |
| -------------------------- | ----------------------------- | ------------------------------------- |
| Intake / start             | `pages.process.steps[0]`      | 1–2 sentences                         |
| Middle phase               | `pages.process.steps[1]`      | “We werken samen aan…”                |
| Evaluation                 | `pages.process.steps[last]`   | Reflective close (“We kijken terug…”) |
| Online / in-person mention | `features.telehealth_enabled` | true if mentioned                     |

---

## 5️⃣ Tarieven & Vergoeding

| Concept             | Template Field                             | Transformation                               |
| ------------------- | ------------------------------------------ | -------------------------------------------- |
| Price per session   | `pages.pricing.items[].price_eur_incl_vat` | Must include VAT                             |
| Duration            | `pages.pricing.items[].duration_min`       | Integer minutes                              |
| Label               | `pages.pricing.items[].label`              | “Sessies (60 min)”                           |
| Payment methods     | `pages.pricing.payment_methods[]`          | E.g. `["Pin","Factuur"]`                     |
| Cancellation        | `pages.pricing.cancellation_policy`        | Plain Dutch (“Annuleren tot 24 uur vooraf.”) |
| Reimbursement notes | `pages.pricing.reimbursement_notes`        | Add if therapist mentions insurers           |

---

## 6️⃣ FAQ / Practical Info

| Concept        | Template Field    | Example                                                                  |
| -------------- | ----------------- | ------------------------------------------------------------------------ |
| Online therapy | `pages.faq.qna[]` | {q: "Bied je online sessies?", a: "Ja, via beeldbellen."}                |
| Duration       | `pages.faq.qna[]` | {q: "Hoe lang duurt een sessie?", a: "60 minuten."}                      |
| Appointment    | `pages.faq.qna[]` | {q: "Hoe maak ik een afspraak?", a: "Via het formulier of telefonisch."} |
| Cancellation   | `pages.faq.qna[]` | {q: "Kan ik annuleren?", a: "Tot 24 uur van tevoren."}                   |
| Languages      | `pages.faq.qna[]` | {q: "In welke talen geef je therapie?", a: "Nederlands en Engels."}      |

---

## 7️⃣ Contact Page

| Concept           | Template Field                     | Notes                                                                             |
| ----------------- | ---------------------------------- | --------------------------------------------------------------------------------- |
| Short reassurance | `pages.contact.lead_text`          | “Alle gesprekken zijn vertrouwelijk.”                                             |
| Email             | `pages.contact.alt_contacts.email` | Lowercase                                                                         |
| Phone             | `pages.contact.alt_contacts.phone` | Include +31 prefix                                                                |
| Consent text      | `pages.contact.form.consent_text`  | “Ik ga akkoord met de verwerking van mijn gegevens volgens de privacyverklaring.” |
| Map               | `pages.contact.map_embed_url`      | Google Maps embed if available                                                    |

---

## 8️⃣ Privacy & Legal

| Concept           | Template Field                  | Notes                                   |
| ----------------- | ------------------------------- | --------------------------------------- |
| Data processing   | `pages.privacy.sections[].html` | List what data is collected             |
| Retention         | `pages.privacy.sections[].html` | “Bewaartermijn maximaal 12 maanden.”    |
| Rights            | `pages.privacy.sections[].html` | Include inzage, correctie, verwijdering |
| Crisis disclaimer | `site.legal.disclaimer`         | “Geen crisisdienst. Bel 112 bij nood.”  |
| Cookie banner     | `site.cookies.banner_enabled`   | true if analytics mentioned             |

---

## 9️⃣ Blog / Artikelen (Optional)

| Concept       | Template Field                | Notes                             |
| ------------- | ----------------------------- | --------------------------------- |
| Article topic | `pages.blog.posts[].title`    | Title case, short                 |
| Summary       | `pages.blog.posts[].excerpt`  | 1–2 sentences                     |
| Date          | `pages.blog.posts[].date_iso` | ISO-8601                          |
| CTA           | `pages.blog.posts[].cta`      | Always link to contact or booking |

---

## 🔍 Mapping Rules Summary

* Always phrase **therapy types** as *“Begeleiding bij [probleem]”* unless the therapist is medically licensed.
* **Approach/modality** field lists methods (ACT, CGT, EMDR) — separate with commas.
* **Expected outcomes** are supportive, not curative.
* **All fields** should be in Dutch and lowercase where appropriate (except proper nouns).
* **Ensure** every service card links to `/therapie/[slug]`.

---

## 🧩 Example Quick Mapping

**From summary:** “Ik geef ACT en relatietherapie aan volwassenen in Utrecht. Sessies duren 60 minuten en kosten €90.”

**Mapped fields:**

```json
{
  "site": {"therapist_name": "Onbekend", "primary_city": "Utrecht"},
  "pages": {
    "services": [
      {"slug": "act-therapie", "title": "ACT therapie", "for_whom": "Volwassenen", "what_it_is": "Begeleiding bij stress en onzekerheid", "approach": "ACT", "format": "individueel", "duration": "60 min", "expected_outcomes": ["Meer rust"], "cta": {"label": "Afspraak maken", "href": "/contact"}}
    ],
    "pricing": {"items": [{"label": "Sessie (60 min)", "price_eur_incl_vat": 90, "duration_min": 60}], "cancellation_policy": "Annuleren tot 24 uur vooraf."}
  }
}
```

---

**End of mapping-rules.md**
