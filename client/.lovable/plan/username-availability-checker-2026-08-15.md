# Username availability checker

A single dark-themed page where you type a username and the availability status updates automatically as you type — checked against a local API at `http://localhost:8000/api/search`.

## What gets built

Rewrite `src/routes/index.tsx` (currently the blank placeholder) as one function component:

- Card centered on a dark navy background, matching the reference: title "Claim your username", small blue "RESERVED FOR YOU" label, an input with an `@` prefix and `johndoe` placeholder, and fine print underneath. No Continue button.
- Local state: `username`, `loading`, `result`.
- Typing triggers a debounced check (~400ms after the last keystroke): `POST http://localhost:8000/api/search` with `{ "username": "<value>" }` and JSON headers. Empty input clears the status and skips the call.
- Stale responses are ignored (in-flight request aborted / latest-value guard) so fast typing can't show an outdated result.
- Response handling: a truthy boolean (either the raw body `true`/`false` or `{ available: bool }`) shows "Username available"; falsy shows "Username not available". Network/API failure shows a short error message. A subtle "Checking…" state while in flight.


## Technical notes

- Function components + hooks only, no classes, no extra dependencies.
- Fetch runs in the browser (client-side handler), so it can reach your local `localhost:8000`. Your API must allow CORS from the app origin, otherwise the browser blocks the call.
- Dark palette added as tokens in `src/styles.css` (deep navy background, indigo primary) rather than hardcoded colors.
- Route `head()` gets a proper title/description for this page.
