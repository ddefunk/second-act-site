# The Second Act Income Audit — Full Setup & Configuration Guide

**Project:** The Second Act Income Audit
**Owner:** Second Act Advisory Studio
**Website:** secondactadvisory.co.uk
**Live App URL:** https://audit.secondactadvisory.co.uk
**Date Built:** May 2026

---

## 1. Project Overview

A lead magnet web app that guides women aged 40+ through a 10-question diagnostic audit. It scores their answers across five dimensions and returns a personalised income archetype with specific income paths and next steps. Lead data is captured and stored in a MySQL database.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Fonts | Playfair Display (headings), Inter (body) via Google Fonts |
| Build tool | Vite 8 |
| Hosting (app) | Netlify (free tier) |
| Hosting (PHP/DB) | Hostinger shared hosting |
| Database | MySQL (Hostinger) |
| Backend endpoint | PHP 8 |
| Package manager | npm 11 |
| Node version | Node.js 24 LTS |

---

## 3. Project File Structure

```
second-act-income-audit/
├── dist/                        ← Built app (deploy this to Netlify)
├── public/
├── src/
│   ├── components/
│   │   ├── WelcomeScreen.jsx    ← Landing screen
│   │   ├── LeadCapture.jsx      ← Name, email, age, season form
│   │   ├── AuditStep.jsx        ← Question renderer (multi/single/scale)
│   │   ├── ProgressBar.jsx      ← Step progress indicator
│   │   ├── ResultPage.jsx       ← Personalised results page
│   │   └── CTASection.jsx       ← Join/Book/Download buttons
│   ├── data/
│   │   ├── questions.js         ← All 10 questions and scoring weights
│   │   └── archetypes.js        ← 6 result archetypes with copy
│   ├── utils/
│   │   ├── scoring.js           ← Score calculation and archetype matching
│   │   └── submitLead.js        ← Sends data to PHP endpoint
│   ├── App.jsx                  ← Main app state machine
│   ├── main.jsx
│   └── index.css
├── save-lead.php                ← Upload to Hostinger public_html
├── test-db.php                  ← Upload to Hostinger public_html (testing only)
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 4. App Configuration (Quick Reference)

### CTA URLs — src/App.jsx lines 11–14
```js
const CONFIG = {
  skoolUrl: 'https://www.skool.com/second-act-income-lab-6876',
  bookingUrl: 'https://calendly.com/olufunketadeyinka/30min',
}
```

### PHP Endpoint — src/utils/submitLead.js line 2
```js
const API_ENDPOINT = 'https://audit.secondactadvisory.co.uk/save-lead.php'
```

### Design Colours — tailwind.config.js
```js
cream:    '#FAF7F4'   // page background
warm:     '#F3EDE6'   // card background
burgundy: '#7D2040'   // accent colour
charcoal: '#2C2C2C'   // body text
muted:    '#6B6B6B'   // secondary text
border:   '#E5DDD5'   // borders
```

---

## 5. Database Configuration

| Setting | Value |
|---|---|
| Host (internal PHP) | localhost |
| Host (external/remote) | srv656.hstgr.io |
| Database name | u142852309_auditleads |
| Database user | u142852309_audituser |
| Table name | audit_leads (auto-created on first submission) |

### audit_leads Table Structure
| Column | Type | Description |
|---|---|---|
| id | INT AUTO_INCREMENT | Primary key |
| first_name | VARCHAR(100) | Lead first name |
| email | VARCHAR(255) | Lead email address |
| age_range | VARCHAR(50) | 40-49 / 50-59 / 60+ |
| season | VARCHAR(100) | Current life season |
| primary_archetype | VARCHAR(50) | Main result type |
| secondary_archetype | VARCHAR(50) | Secondary result type |
| score_expertise | INT | 0–100 |
| score_readiness | INT | 0–100 |
| score_digital | INT | 0–100 |
| score_time | INT | 0–100 |
| score_visibility | INT | 0–100 |
| completed_at | DATETIME | When audit was completed |
| created_at | TIMESTAMP | When record was inserted |

### View leads in phpMyAdmin
Hostinger → Databases → Management → Enter phpMyAdmin → u142852309_auditleads → audit_leads → Browse

---

## 6. Hosting Configuration

### Netlify (App Hosting)
- **Account:** Free tier
- **Site name:** earnest-medovik-5fdba3.netlify.app
- **Custom domain:** audit.secondactadvisory.co.uk
- **Deploy method:** Drag and drop the `dist` folder
- **Auto SSL:** Enabled via Let's Encrypt

### Hostinger (PHP + Database)
- **Website:** audit.secondactadvisory.co.uk
- **PHP files location:** public_html/
- **Files uploaded:** save-lead.php, test-db.php

### DNS Record (secondactadvisory.co.uk)
| Type | Name | Content | TTL |
|---|---|---|---|
| CNAME | audit | earnest-medovik-5fdba3.netlify.app | 3600 |

---

## 7. Step-by-Step Build Process (for replication)

### A. Install Node.js
```
winget install OpenJS.NodeJS.LTS
```
Then open a new PowerShell window and run:
```
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### B. Scaffold the project
```
cd "your-chosen-folder"
npm create vite@latest project-name -- --template react
cd project-name
npm install
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

### C. Configure Tailwind
Update `tailwind.config.js` content array:
```js
content: ['./index.html', './src/**/*.{js,jsx}']
```
Add custom colours and fonts in the extend section.

### D. Build and deploy
```
npm run build
```
Drag the `dist` folder to Netlify.

### E. Set up database
1. Create MySQL database in Hostinger
2. Note database name, username, password
3. Upload `save-lead.php` to public_html
4. Test connection via browser: yourdomain.com/test-db.php

### F. Connect custom domain
1. Add domain in Netlify → Domain management
2. Add CNAME record in Hostinger DNS pointing subdomain to Netlify URL
3. Wait for DNS propagation (15 min – 24 hours)

---

## 8. How to Update the App

### To change questions
Edit: `src/data/questions.js`

### To change result archetypes or copy
Edit: `src/data/archetypes.js`

### To adjust scoring thresholds
Edit: `src/utils/scoring.js` — the CONDITIONS array

### To update CTA links
Edit: `src/App.jsx` — the CONFIG object at the top

### After any code changes — rebuild and redeploy
```
npm run build
```
Then drag the updated `dist` folder to Netlify.

---

## 9. The 6 Result Archetypes

| ID | Title | Best For |
|---|---|---|
| consultant | The Expertise-to-Income Consultant | Strong professional expertise, ready to package knowledge |
| digitalProduct | The Digital Product Builder | Knowledge-rich, prefers creating over delivering |
| mentor | The Mentor or Guide | Strong lived experience and people skills |
| aiService | The AI-Assisted Service Provider | Tech comfortable, practical service delivery |
| operator | The Behind-the-Scenes Operator | Low visibility preference, operational skills |
| starter | The Confidence & Clarity Starter | Needs direction, confidence building first |

---

## 10. Future Integration Options

The `src/utils/submitLead.js` file contains commented stubs for:

- **Airtable** — POST to Airtable API
- **ConvertKit / Kit** — Subscribe to email list
- **Supabase** — Insert into Supabase table

To activate any of these, uncomment the relevant block and add your API key.

---

## 11. If Building This for a Client — Checklist

- [ ] Update brand colours in `tailwind.config.js`
- [ ] Update fonts in `src/index.css` Google Fonts import
- [ ] Rewrite question copy in `src/data/questions.js`
- [ ] Rewrite archetype copy in `src/data/archetypes.js`
- [ ] Update CTA URLs in `src/App.jsx` CONFIG object
- [ ] Update PHP endpoint URL in `src/utils/submitLead.js`
- [ ] Create new MySQL database on client hosting
- [ ] Update database credentials in `save-lead.php`
- [ ] Upload `save-lead.php` to client hosting
- [ ] Deploy to Netlify under client account
- [ ] Connect client custom domain via DNS CNAME record
- [ ] Test full flow end to end
- [ ] Confirm lead appears in database after test submission
- [ ] Delete `test-db.php` from server after setup is confirmed

---

*Document created: May 2026*
*Second Act Advisory Studio — secondactadvisory.co.uk*
