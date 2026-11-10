# Lashes By Micha

## Contact form and Lash Assistant

The contact form opens a prefilled Gmail draft addressed to `micahnurse60@gmail.com`. The visitor must review and press Send. Automatic background email delivery requires a server-side email service.

The Lash Assistant runs in the visitor's browser. Its default answers come from the editable `KNOWLEDGE` object in `script.js`; it does not use an AI API. The assistant does not provide photo try-on or request access to the visitor's camera or photos.

## Setup

1. **Edit site settings:** At the top of `script.js`, update `CONFIG.whatsappNumber`, `CONFIG.instagram`, and `CONFIG.bookingUrls`. Use the WhatsApp number in international format, with country code. Leave `aiEndpoint` empty to keep all chat replies rule-based. If you later configure an endpoint, it must accept a JSON `POST` with `messages` and `selectedStyle`, and return JSON such as `{"reply":"Your answer"}`. Do not put an API key in browser code.
2. **Update answers and prices:** Edit the `KNOWLEDGE` object in `script.js`. Keep its answers in sync with the service descriptions and prices in `index.html`. Unknown details such as studio address, Mega Volume price, fill/removal prices, and appointment durations are intentionally not invented.
3. **Set up Calendly:** Create separate Classic, Hybrid, Volume, Cateye, and Anime event types if your Calendly plan supports them, and paste each event URL into the matching `bookingUrls` field. Otherwise, add one event URL to `bookingUrls.default` and add a required custom question such as “Which service?”; the assistant pre-fills its answer in Calendly's first custom answer (`a1`). With no link configured, the assistant collects a preferred date, time and name, then opens a WhatsApp request. That request is not a confirmed appointment.
4. **Turn on real reminders:** In Calendly's event/notification settings, enable email confirmations and reminders for both Micha and clients. Connect Calendly to Google Calendar or Outlook and enable that calendar's phone notifications. Website opening hours use South Africa time (UTC+2).
5. **Deploy:** Push the updated files to the connected GitHub branch; Vercel will build and deploy the static site.

## Privacy and limits

The site does not access or store visitor photos. If `CONFIG.aiEndpoint` is configured, chat text is sent to that URL.

A static site cannot securely hold an AI API key, send automatic email/SMS or WhatsApp messages, store shared appointments, or send its own reminders. Calendly handles shared live availability, appointment confirmation and email reminders without a custom backend. The smallest optional upgrade for a private AI API key is a free-tier serverless function that keeps the key on the server and calls the AI provider; the browser can then call that function instead of the provider directly.