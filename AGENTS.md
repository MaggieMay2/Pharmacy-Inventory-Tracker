# Project: ShelfSafe

Problem: Community pharmacies in Nigeria lose money and risk patient safety when drugs expire on the shelf or run out, because expiry dates, stock levels and reorder points are tracked by hand (bin cards, notebooks) or not at all.

User: Owners, pharmacists and store keepers in small community pharmacies. Mostly on low-cost Windows laptops (often 4 GB RAM) and Android phones, with unreliable power and internet.

Hackathon: #BuildHybridAI 2026 (Devpost). Deadline Mon 30 Nov 2026, 2:00 PM PT (11:00 PM Lagos). Web/Chrome track. Judged equally on Technological Implementation, Design, Potential Impact, Quality of the Idea.

Done statement: A pharmacist can photograph a drug pack, have the app fill in its name, batch and expiry date (on-device when possible, cloud otherwise), and see which products expire within 6 and 3 months, which need reordering, and contact the supplier in one tap.

## Status
Built and tested (steps 1-4; the live AI call still has to be tested on the hosted site):
- Stock list: products sorted by soonest expiry, colour-coded expiry stamp, batches numbered by arrival (Batch 1 = oldest) with date received, stock-level badge, filters, search, reminder banner.
- Product page: batches in FEFO order ("Issue first" skips expired batches), stock-level panel with gauge (safety / reorder zone / healthy / overstock), AMC, months of stock, lead time, safety stock, reorder level, maximum stock, suggested order, ordering-period projection, expiry risk, orders waiting for delivery, supplier contact, recent movements.
- Receive stock (GRN), with short-dated warning; refuses expired batches; can add a new product; can close an open order.
- Issue stock using FEFO; never issues expired batches.
- Place order (optional WhatsApp to supplier), follow up, cancel, mark as delivered; overdue flag.
- Remove expired batch from stock (logged).
- Reminders: Reorder now, Waiting for delivery, Expired, Expiring within 3 / 6 months.
- Suppliers: company, contact person, phone, delivery time, products supplied; Call and WhatsApp.
- Plain-English definitions on headings (hover, tap or keyboard focus).
- Stock rules: safety stock months and order interval, editable.
- Scan the pack (Receive stock): Firebase AI Logic, PREFER_ON_DEVICE, JSON schema on both paths; fills product, brand/manufacturer, batch number, expiry; AI-filled fields highlighted; "Read on this device" / "Read in the cloud" label from response.inferenceSource. Firebase SDK 13.2.0 loaded from gstatic CDN with dynamic import, preloaded when online.
- Pack photos: shrunk to JPEG max 1024 px, stored on the device in IndexedDB (database "shelfsafe-photos", keyed by batch id); thumbnail on product page and stock list; tap to enlarge; "Add photo" for older batches. Brand / manufacturer field on each batch.

Next:
- App Check: Firebase enforces it for AI Logic since 2 Nov 2026. Create a reCAPTCHA v3 key for maggiemay2.github.io, register it in Firebase App Check, and paste the site key into RECAPTCHA_SITE_KEY in index.html.
- Test scanning on the live site (cloud on Ifeoma's laptop and phone; on-device on a borrowed 16 GB laptop).
- Step 5 (if time): AI-written supplier messages. Backup/export of records and photos.
- Step 6: App Check, restrict the API key to the GitHub Pages address, final README, demo video.

## Calculations (plain code, never AI)
- AMC = total issued in the last 3 months / 3
- Lead time = average days from date ordered to date received over past deliveries; otherwise the supplier's usual delivery time
- Safety stock = AMC x safety months (default 1)
- Reorder level = AMC x (lead time in months + safety months)
- Maximum stock = reorder level + AMC x order interval in months (default 1)
- Suggested order = maximum - usable stock on hand - stock on order
- Months of stock = usable stock on hand / AMC
- Ordering period: stock expected when the order arrives = usable on hand - AMC x days until delivery / 30.44; compare with safety stock and zero
- Expiry risk: in FEFO order, units of each batch that cannot be used before expiry at the current AMC

## Tools
- One self-contained file: index.html (HTML, CSS and JavaScript together). Nothing to install, no build step. Upload it to GitHub to update the live site.
- Firebase JS SDK from the official CDN. Firebase AI Logic with hybrid inference (InferenceMode.PREFER_ON_DEVICE): Gemini Nano in Chrome on desktop when available, Gemini Developer API in the cloud otherwise. Structured JSON output for scans.
- Firebase App Check (reCAPTCHA; debug token for judges).
- Records saved in the browser (localStorage); pack photos in IndexedDB. Sample data is generated relative to today's date.
- Hosting: GitHub Pages from github.com/MaggieMay2/Pharmacy-Inventory-Tracker. Licence: Apache 2.0.
- Firebase project: shelfsafe-6f849.

## Design
Calm, clean and clinical, like a well-run pharmacy. White, soft greys and pharmacy green. Red, orange, yellow and green are used only for expiry status, and blue only for overstock, always with words as well as colour. Ruled rows like a bin card, not floating cards. Big readable text and buttons; phone first, tabs at the bottom on phones; works on a small, slow laptop. Plain words a store keeper uses. Avoid: purple gradients, neon glows, emoji icons, vague headlines.

## Rules
- I'm not a developer. Explain things in plain language.
- Build one feature at a time and tell me how to test it.
- Never put secret keys or passwords in the code. The Firebase web config is allowed; protect it with App Check and an HTTP-referrer restriction.
- The AI only reads what is on the pack. It never invents or suggests doses, and every AI result is checked by the user before saving.
- Stock calculations are always done by code, never by the AI.
- No real patient data anywhere. Sample supplier phone numbers are fake (0800 000 000x).
- Every new heading gets a plain-English definition in the glossary.
- Explain errors before you fix them.
- Create a save point after each feature that works.
