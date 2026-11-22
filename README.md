# ShelfSafe

**Know what's expiring, what to reorder, and who to call, even when the network is down.**

ShelfSafe is an expiry and stock tracker for community pharmacies. It is built for the #BuildHybridAI 2026 hackathon (Web/Chrome) with Firebase AI Logic.

**Live app:** https://maggiemay2.github.io/Pharmacy-Inventory-Tracker/

## The problem
Small pharmacies in Nigeria track stock on bin cards and in notebooks. Drugs expire on the shelf unnoticed, which wastes money and risks a patient receiving expired medicine. Other drugs run out because nobody worked out when to reorder. Many of these pharmacies run on low-cost laptops with unreliable power and internet.

## What it does
- **Expiry at a glance:** every product is sorted by its soonest expiry. Each one has a colour-coded expiry stamp: expired, under 3 months, under 6 months, or OK.
- **Batches by arrival:** each delivery becomes a numbered batch with its date received, batch number and expiry date.
- **FEFO issuing:** stock is issued from the batch that expires first, and expired batches are never issued.
- **Reorder maths, done for you:** average monthly consumption (AMC), months of stock, lead time, safety stock, reorder level, maximum stock and a suggested order quantity, with a gauge showing where stock sits.
- **Ordering-period warning:** warns when stock will fall into the safety stock, or run out, before an order arrives.
- **Expiry risk:** flags how many units will expire before they can be used at the current rate of use.
- **Orders tracked until delivered:** see what's on order, when it's due and whether it's overdue, then mark it delivered.
- **Reminders:** reorder now, waiting for delivery, expired, and expiring within 3 or 6 months, with one-tap Call or WhatsApp to the supplier.
- **Suppliers:** each supplier's company, contact person, delivery time and the products they supply.
- **Scan the pack with AI:** a photo fills in the batch number, expiry date and brand, and the photo is saved with the batch.
- **Plain-English help:** point at or tap any heading to see what it means.

## How it uses Firebase AI Logic (hybrid inference)
**Scan the pack.** On the Receive stock form, the pharmacist photographs a drug pack. Firebase AI Logic reads the product name, strength, brand, manufacturer, batch number and expiry date and fills in the form. Every AI-filled field is highlighted so it can be checked against the pack before saving.

- **On-device first (Gemini Nano in Chrome):** the model runs with `InferenceMode.PREFER_ON_DEVICE`. On a capable laptop the photo never leaves the computer, so it's private, free and works offline once the page is loaded.
- **Cloud fallback (Gemini Developer API):** on phones and low-cost laptops, which is what most Nigerian pharmacies use, the same request goes to the cloud automatically.
- **Each scan shows where it ran:** a label reads *Read on this device* or *Read in the cloud*, taken from the response's `inferenceSource`.
- **Structured output:** the same JSON schema is used on both paths (`responseConstraint` on-device, `responseSchema` in the cloud), so the form fills in the same way either way.
- **App Check** protects the Gemini API from misuse.

**Why hybrid matters here:** a pharmacy's stock list is sensitive business information, and power and network cuts are common. On-device inference keeps scanning private and working offline, and the cloud fallback means the app still works on the cheap laptops and phones most pharmacies actually have.

**Pack photos stay with each batch.** The same medicine often arrives from a different manufacturer or brand, or in new packaging. The photo is saved with its batch, on the device, so staff can match the shelf to the record and trace a batch in a recall.

The AI only reads what's printed on the pack. It never suggests doses, and all stock calculations are done by plain code, never by the AI.

## How to use it
1. Open the live app in Chrome. It starts with sample data (fictional suppliers and fake phone numbers) so you can explore straight away.
2. Tap a product to see its batches, stock level and supplier.
3. Try **Receive stock**, then **Scan the pack** with a photo of any medicine pack. Then try **Issue stock** and **Place order**.
4. **Reset to sample data**, at the bottom of the Stock page, starts again.

Your records are saved in your browser on your device. No account is needed.

## Run it yourself
ShelfSafe is a single file, `index.html`, so there's nothing to install or build.
- **Quickest:** download `index.html` and open it in Chrome.
- **Online:** fork this repository and turn on GitHub Pages (Settings → Pages → Deploy from a branch → `main` → `/ (root)`).
- **AI scanning with your own Firebase project:** create a Firebase project, enable Firebase AI Logic with the Gemini Developer API, register a web app, set up App Check with reCAPTCHA v3, and replace `FIREBASE_CONFIG` and `RECAPTCHA_SITE_KEY` near the top of `index.html`.
- **On-device inference:** use Chrome on a desktop or laptop (version 139 or later) that meets Chrome's built-in AI hardware requirements. Enable `chrome://flags/#prompt-api-for-gemini-nano` and `chrome://flags/#prompt-api-for-gemini-nano-multimodal-input`, then restart Chrome. Other devices use the cloud automatically.

## Built with
- HTML, CSS and JavaScript in one file
- Firebase AI Logic (hybrid inference: Gemini Nano on-device, Gemini Developer API in the cloud)
- Firebase App Check (reCAPTCHA v3)
- Browser storage: localStorage for records, IndexedDB for pack photos
- GitHub Pages

## Team
Ifeoma (MaggieMay2): pharmacist at an eye hospital in Nigeria, and a solo builder working with an AI coding assistant.

## Licence
Apache 2.0
