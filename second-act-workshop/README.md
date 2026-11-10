# Second Act Advisory: Workshop Landing Pages

A reusable landing page for free live workshops, served from its own subdomain
(`workshop.secondactadvisory.co.uk`) so the main website and the Income Audit stay untouched.

Each workshop has its own address:

| Workshop | URL |
|---|---|
| From Experience to Income | workshop.secondactadvisory.co.uk/from-experience-to-income |
| Shape Your First Offer | workshop.secondactadvisory.co.uk/shape-your-first-offer |
| Your Second Act Income Plan | workshop.secondactadvisory.co.uk/your-second-act-income-plan |

The bare subdomain shows whichever workshop is set as `FEATURED_WORKSHOP` (currently Shape Your First Offer).

## Where to edit things

| What | File |
|---|---|
| Dates, titles, copy, gifts, FAQs for each event | `src/data/workshops.js` |
| Bio, photo, testimonials, links, shared FAQs | `src/data/site.js` |
| Registration endpoint and emails | `server/save-registration.php` |

### Running a workshop

1. Open `src/data/workshops.js` and find the workshop.
2. Set `startsAt` to the UK date and time, for example `'2027-01-24T19:00'`.
   While `startsAt` is `null` the page says "Date to be announced" and collects a waitlist.
   After the session ends, the page switches back to waitlist mode on its own.
3. Put the Zoom link for that workshop in `workshop-config.php` on Hostinger (`join_links`).
   It is only sent in the confirmation email, never shown on the page.
4. Rebuild and redeploy (below).

### Adding a new workshop

Copy one of the entries in `workshops.js`, give it a new `slug`, and change the content.
`methodStages` controls which stages of the Second Act Method are highlighted.

To send people to Zoom, Stan or Eventbrite instead of the built-in form, set
`registration: { type: 'link', url: 'https://...' }`.

## Build and deploy

```bash
npm install
npm run dev      # local preview at http://localhost:5173
npm run build    # creates dist/
```

1. **Netlify:** create a new site and drag in the `dist` folder. In Domain settings add
   `workshop.secondactadvisory.co.uk`. The `_redirects` file makes each workshop URL work.
2. **DNS (Hostinger):** add a CNAME record `workshop` pointing to the Netlify site address.
3. **Registration endpoint (Hostinger):** upload `server/save-registration.php` to the same
   folder as `save-lead.php` (audit.secondactadvisory.co.uk). Copy
   `server/workshop-config.example.php` to `workshop-config.php`, fill in the database
   password and join links, and upload it alongside. The `workshop_registrations`
   table is created on the first sign-up. Never commit `workshop-config.php`.

Registrations appear in phpMyAdmin under `workshop_registrations`.
