# HRSM website

Static consulting website for HRSM (pure HTML/CSS/JS, no build step).

## Structure

```
index.html        single-page site (About, Services, Team, Publications, Contact)
css/styles.css    styles
js/main.js        protected email reveal, contact form, mobile nav
assets/           favicon
.nojekyll         tells GitHub Pages to serve files as-is
```

## Email-only contact, protected from spam harvesters

No phone number is published. The email address is the only contact and is protected:

- It never appears in `index.html` — not even encoded.
- In `js/main.js` it is split into user and domain, each reversed + base64-encoded (`EMAIL_PARTS`), with no `@` in the source. Harvesters scanning for `name@domain` find nothing.
- It is assembled only after a **real** click by a person (`event.isTrusted`); bots that script clicks get nothing.

To change the address, encode each part in the browser console and paste them into `EMAIL_PARTS`:

```js
btoa('user'.split('').reverse().join(''))     // part before @
btoa('domain.com'.split('').reverse().join('')) // part after @
```

## Contact form

GitHub Pages has no backend, so the form opens the visitor's email app with the message pre-filled. Bot submissions are silently dropped by a hidden honeypot field and a minimum 3-second fill time.

## Preview locally

Open `index.html` in a browser, or run `npx serve .` in this folder.

## Publish (GitHub Pages)

Copy these files into the root of `may-py/may-py.github.io`, replacing the old `index.html`. **Keep the existing `CNAME` file** so the custom domain keeps working.
