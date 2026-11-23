# Project: ShelfSafe

Problem: Community pharmacies in Nigeria lose money and risk patient safety when drugs expire on the shelf or run out, because expiry dates, stock levels and reorder points are tracked by hand (bin cards, notebooks) or not at all.

User: Owners, pharmacists and store keepers in small community pharmacies. Mostly on low-cost Windows laptops (often 4 GB RAM) and Android phones, with unreliable power and internet.

Hackathon: #BuildHybridAI 2026 (Devpost). Deadline Mon 30 Nov 2026, 2:00 PM PT (11:00 PM Lagos). Target: submit by Sun 29 Nov. Web/Chrome track. Judged equally on Technological Implementation, Design, Potential Impact, Quality of the Idea. Everything was built during the contest (21-23 Nov 2026).

Done statement: A pharmacist can photograph a drug pack, have the app fill in its name, batch and expiry date (on-device when possible, cloud otherwise), and see which products expire within 6 and 3 months, which need reordering, and contact the supplier in one tap.

## Status (23 Nov 2026)
Built, deployed and tested on the live site (https://maggiemay2.github.io/shelfsafe/):
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
- Scan the pack (Receive stock): Firebase AI Logic, PREFER_ON_DEVICE, same JSON schema on both paths; fills product, brand/manufacturer, batch number, expiry; creates a new product if it isn't listed; AI-filled fields highlighted for checking; "Read on this device" / "Read in the cloud" label from response.inferenceSource. Automatic retries when the cloud is busy, plus a "Try again" button. Clear error messages (App Check blocked by an extension, cloud busy, offline).
- Photo sources: phone camera, laptop webcam ("Use laptop camera", getUserMedia, works offline) or file upload. Up to 2 photos per batch (front, then the flap with batch and expiry); a second photo fills only empty fields. Expiry text normalised to YYYY-MM (02/2027, FEB 2027, EXP 03 2028...).
- Pack photos: shrunk to JPEG max 1024 px, stored on the device in IndexedDB (database "shelfsafe-photos", keyed by batch id); thumbnail on product page and stock list; tap to enlarge; "Add photo" for older batches.
- Security: App Check with a Fraud Defense (reCAPTCHA Enterprise) key for maggiemay2.github.io. Browser API key restricted to https://maggiemay2.github.io/* (API list left at Firebase's default).
- Tested: cloud scanning works on an Android phone and in an incognito window on a laptop (Ciprofloxacin and Esomeprazole packs read correctly).

Known issues:
- In a normal Chrome window with an ad or privacy extension, scanning can fail with "App Check token is invalid". Incognito works; the app tells users this.
- "Model is experiencing high demand" is temporary on Google's side; handled by the retries.

## Next (in order)
1. Test on-device scanning on a borrowed capable laptop (Thu 26 / Fri 27 Nov) and record it: "Read on this device", then Wi-Fi off and a second scan still works.
2. Demo video: about 2 min 40 s, captions, public on YouTube, in English.
3. Devpost description, plus "what I built during the contest".
4. Optional: "What's next" section and a screenshot in the README.
5. Final check from another device in a private window, then submit by Sun 29 Nov.
- Ask in Discord #hackathon-help whether the public Firebase web config counts as a "production API key".
- After the hackathon: AI-written supplier messages; backup/export of records and photos.

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
- Firebase JS SDK 13.2.0 from the official gstatic CDN (dynamic import, preloaded when online).
- Firebase AI Logic with hybrid inference (InferenceMode.PREFER_ON_DEVICE): Gemini Nano in Chrome on desktop when available, Gemini Developer API in the cloud otherwise. Cloud model: gemini-3.5-flash-lite (must be named explicitly). Structured JSON output for scans.
- Firebase App Check: Fraud Defense (reCAPTCHA Enterprise), ReCaptchaEnterpriseProvider. Classic reCAPTCHA v3 is no longer accepted.
- Records saved in the browser (localStorage); pack photos in IndexedDB. Sample data is generated relative to today's date.
- Hosting: GitHub Pages from github.com/MaggieMay2/shelfsafe. Licence: Apache 2.0.
- Firebase project: shelfsafe-6f849, free Spark plan. Never upgrade to Blaze.

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
