# ShelfSafe

**Know what's expiring, what to reorder, and who to call, even when the network is down.**

ShelfSafe is an expiry and stock tracker for community pharmacies. It is built for the #BuildHybridAI 2026 hackathon (Web/Chrome) with Firebase AI Logic.

**Live app:** https://maggiemay2.github.io/shelfsafe/

> **For judges:** open the live app and click **Try with sample data**. No account is needed. You'll see a pharmacy with 12 products, fictional suppliers and fake phone numbers. To try the AI, go to **Receive stock**, then **Scan the pack**, and photograph or upload any medicine pack. To see accounts, click **Create an account** (any email works).

## The problem
Small pharmacies in Nigeria track stock on bin cards and in notebooks. Drugs expire on the shelf unnoticed, which wastes money and risks a patient receiving expired medicine. Other drugs run out because nobody worked out when to reorder. Many of these pharmacies run on low-cost laptops and phones, with unreliable power and internet.

## What it does
- **Scan the pack with AI:** a photo fills in the product, brand, batch number and expiry date, and the photo is saved with the batch.
- **Expiry at a glance:** every product is sorted by its soonest expiry. Each one has a colour-coded expiry stamp: expired, under 3 months, under 6 months, or OK.
- **Batches by arrival:** each delivery becomes a numbered batch with its date received, batch number and expiry date.
- **FEFO issuing:** stock is issued from the batch that expires first, and expired batches are never issued.
- **Reorder maths, done for you:** average monthly consumption (AMC), months of stock, lead time, safety stock, reorder level, maximum stock and a suggested order quantity, with a gauge showing where stock sits.
- **Ordering-period warning:** warns when stock will fall into the safety stock, or run out, before an order arrives.
- **Expiry risk:** flags how many units will expire before they can be used at the current rate of use.
- **Orders tracked until delivered:** see what's on order, when it's due and whether it's overdue, then mark it delivered.
- **Reminders:** reorder now, waiting for delivery, expired, and expiring within 3 or 6 months, with one-tap Call or WhatsApp to the supplier.
- **Suppliers:** each supplier's company, contact person, delivery time and the products they supply.
- **An account for each pharmacy:** sign up with an email and password. Each pharmacy sees only its own records, backed up to the cloud and available on any device it signs in on.
- **Installable and offline:** install ShelfSafe from Chrome like a normal app. Once opened, it works without internet.
- **Plain-English help:** point at or tap any heading to see what it means.

## How it uses Firebase AI Logic (hybrid inference)
**Scan the pack.** On the Receive stock form, the pharmacist photographs a drug pack: with the phone camera, or on a laptop with the built-in webcam (**Use laptop camera**) or an uploaded photo. Up to two photos per batch, for example the front and then the flap with the batch number and expiry. Firebase AI Logic reads the product name, strength, brand, manufacturer, batch number and expiry date and fills in the form. Every AI-filled field is highlighted so it can be checked against the pack before saving. If the product isn't in the list yet, ShelfSafe creates it.

- **On-device first (Gemini Nano in Chrome):** the model runs with `InferenceMode.PREFER_ON_DEVICE`. On a capable laptop the photo never leaves the computer, so it's private, free and works offline once the page is loaded.
- **Cloud fallback (Gemini Developer API, `gemini-3.5-flash-lite`):** on phones and low-cost laptops, which is what most Nigerian pharmacies use, the same request goes to the cloud automatically.
- **Each scan shows where it ran:** a label reads *Read on this device* or *Read in the cloud*, taken from the response's `inferenceSource`.
- **Structured output:** the same JSON schema is used on both paths (`responseConstraint` on-device, `responseSchema` in the cloud), so the form fills in the same way either way.
- **Reliable on busy days:** if the cloud model is busy, ShelfSafe retries automatically, and offers a **Try again** button.
- **App Check** (Fraud Defense / reCAPTCHA Enterprise) protects the Gemini API from misuse.

**Why hybrid matters here:** a pharmacy's stock list is sensitive business information, and power and network cuts are common. On-device inference keeps scanning private and working offline, and the cloud fallback means the app still works on the cheap laptops and phones most pharmacies actually have.

**Pack photos stay with each batch.** The same medicine often arrives from a different manufacturer or brand, or in new packaging. The photo is saved with its batch, on the device, so staff can match the shelf to the record and trace a batch in a recall.

The AI only reads what's printed on the pack. It never suggests doses, and all stock calculations are done by plain code, never by the AI.

## Accounts and where records are kept
- **Try with sample data:** no account. Records stay in this browser only.
- **Pharmacy account:** Firebase Authentication (email and password, with password reset). Records are saved in the browser first, so the app is fast and works offline, then backed up to Cloud Firestore under that pharmacy's account. Changes made offline are sent when the internet comes back.
- **Privacy between pharmacies:** Firestore security rules allow a signed-in user to read and write only their own pharmacy's records.
- **Pack photos** stay on the device where they were taken (IndexedDB).

## How to use it
1. Open the live app in Chrome. Choose **Try with sample data**, or **Create an account** for your own pharmacy.
2. Tap a product to see its batches, stock level and supplier.
3. Try **Receive stock**, then **Scan the pack** with a photo of any medicine pack. Then try **Issue stock** and **Place order**.
4. To install it: click **Install app** on the Stock page, or use Chrome's menu.
5. In sample mode, **Reset to sample data** at the bottom of the Stock page starts again.

## Run it yourself
ShelfSafe is plain HTML, CSS and JavaScript, so there's nothing to install or build. The main file is `index.html`. `manifest.webmanifest`, `sw.js` and the icons make it installable and offline-ready.
- **Online:** fork this repository and turn on GitHub Pages (Settings → Pages → Deploy from a branch → `main` → `/ (root)`).
- **With your own Firebase project:**
  1. Create a Firebase project and register a web app.
  2. Enable Firebase AI Logic with the Gemini Developer API.
  3. Set up App Check with a Fraud Defense (reCAPTCHA Enterprise) website key for your site's address.
  4. In Authentication, enable **Email/Password**.
  5. Create a Cloud Firestore database in production mode, and publish these rules:
     ```
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /pharmacies/{uid} {
           allow read, write: if request.auth != null && request.auth.uid == uid;
         }
         match /pharmacies/{uid}/{rest=**} {
           allow read, write: if request.auth != null && request.auth.uid == uid;
         }
       }
     }
     ```
  6. Replace `FIREBASE_CONFIG` and `RECAPTCHA_SITE_KEY` near the top of `index.html`.
- **On-device inference:** use Chrome on a desktop or laptop (version 139 or later) that meets Chrome's built-in AI hardware requirements. Enable `chrome://flags/#prompt-api-for-gemini-nano` and `chrome://flags/#prompt-api-for-gemini-nano-multimodal-input`, then restart Chrome. Other devices use the cloud automatically.

## Built with
- HTML, CSS and JavaScript, with no framework or build step
- Firebase AI Logic (hybrid inference: Gemini Nano on-device, Gemini Developer API in the cloud)
- Firebase App Check (Fraud Defense / reCAPTCHA Enterprise)
- Firebase Authentication and Cloud Firestore (free Spark plan)
- Browser storage: localStorage for records, IndexedDB for pack photos
- A service worker and web app manifest (installable, works offline)
- GitHub Pages

## Built during the contest
All of ShelfSafe was built for this hackathon, between 21 and 25 November 2026.

## Known limits
- One login per pharmacy for now; separate staff logins are planned.
- Two devices open at the same time don't update each other live; the newest copy is used when the app opens.
- Pack photos aren't backed up to the cloud yet.
- On-device AI needs a capable laptop (a graphics card with more than 4 GB of memory, or 16 GB of RAM). Other devices use the cloud.

## What's next
- **Staff logins** within one pharmacy, live sync between devices, and photo backup.
- **Near-expiry swap marketplace:** stock one pharmacy can't sell in time reaches a nearby pharmacy that can.
- **Supplier partnerships:** send orders and swap requests straight to distributors.
- **Inspection-ready reports** for regulators: expired stock removed, batch records and disposal logs.
- **Hospital and pharmacy-chain version**, with several stores under one account.

## Team
Ifeoma (MaggieMay2): pharmacist at an eye hospital in Nigeria, and a solo builder working with an AI coding assistant.

## Licence
Apache 2.0
