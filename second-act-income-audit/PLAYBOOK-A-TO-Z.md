# The Second Act Income Audit — A to Z Setup Playbook

**For:** Second Act Advisory Studio
**Website:** secondactadvisory.co.uk
**Live App:** https://income.secondactadvisory.co.uk (or earnest-medovik-5fdba3.netlify.app)
**Purpose:** Lead magnet web app — captures name, email, and audit results into a database

---

## SECTION 1 — WHAT YOU ARE BUILDING

A multi-step diagnostic web app that:
- Asks women aged 40+ a series of questions about their experience, skills, and goals
- Scores their answers across 5 dimensions
- Returns a personalised income archetype with specific income paths and next steps
- Captures their name, email, and results into a MySQL database you control
- Links to your Skool community and Calendly booking page

---

## SECTION 2 — WHAT YOU NEED BEFORE YOU START

| Requirement | Details |
|---|---|
| A Windows PC | The setup was done on Windows 11 |
| Hostinger hosting account | You already have this |
| A domain on Hostinger | secondactadvisory.co.uk |
| A Netlify account | Free tier — netlify.com |
| A Skool community URL | Already set |
| A Calendly booking link | Already set |
| About 2–3 hours | For a first-time setup |

---

## SECTION 3 — STEP 1: INSTALL NODE.JS

Node.js is the software that builds the app on your computer.

**How to install:**
1. Press Windows key, type **PowerShell**, right-click → **Run as administrator**
2. Run this command:
   ```
   winget install OpenJS.NodeJS.LTS
   ```
3. Wait for it to complete (3–5 minutes)
4. Close PowerShell and open a new one
5. Fix the script permissions by running:
   ```
   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
   ```
   Type Y and press Enter to confirm
6. Verify Node.js installed:
   ```
   node --version
   npm --version
   ```
   You should see version numbers for both

---

## SECTION 4 — STEP 2: CREATE THE PROJECT

1. Open PowerShell as administrator
2. Navigate to where you want to store the project:
   ```
   cd "C:\Users\YourName\Documents"
   ```
3. Create the Vite React project:
   ```
   npm create vite@latest your-project-name -- --template react
   cd your-project-name
   npm install
   ```
4. Install Tailwind CSS:
   ```
   npm install -D tailwindcss@3 postcss autoprefixer
   npx tailwindcss init -p
   ```

---

## SECTION 5 — STEP 3: ADD THE APP FILES

The app has the following structure. Each file has a specific role:

```
your-project/
├── src/
│   ├── components/
│   │   ├── WelcomeScreen.jsx    ← Landing page
│   │   ├── LeadCapture.jsx      ← Name, email, age, season
│   │   ├── AuditStep.jsx        ← Question screens
│   │   ├── ProgressBar.jsx      ← Progress indicator
│   │   ├── ResultPage.jsx       ← Results and archetype
│   │   └── CTASection.jsx       ← Call to action buttons
│   ├── data/
│   │   ├── questions.js         ← All questions (easy to edit)
│   │   └── archetypes.js        ← All result types (easy to edit)
│   ├── utils/
│   │   ├── scoring.js           ← Scoring logic
│   │   └── submitLead.js        ← Sends data to database
│   ├── App.jsx                  ← Main app
│   └── index.css                ← Styles and fonts
├── save-lead.php                ← Upload to Hostinger
├── test-db.php                  ← Upload to Hostinger (testing only)
└── tailwind.config.js           ← Design tokens and colours
```

**Key configuration points:**

**1. Update your CTA links — src/App.jsx:**
```js
const CONFIG = {
  skoolUrl: 'YOUR SKOOL COMMUNITY URL',
  bookingUrl: 'YOUR CALENDLY URL',
}
```

**2. Update your PHP endpoint — src/utils/submitLead.js:**
```js
const API_ENDPOINT = 'https://yourdomain.co.uk/save-lead.php'
```

**3. Update footer — src/components/ResultPage.jsx:**
Find the line with your website URL and update it.

---

## SECTION 6 — STEP 4: CONFIGURE TAILWIND

Open `tailwind.config.js` and make sure the content paths are set:
```js
content: ['./index.html', './src/**/*.{js,jsx}']
```

Add your brand colours in the extend section:
```js
colors: {
  cream:    '#FAF7F4',
  warm:     '#F3EDE6',
  burgundy: { DEFAULT: '#7D2040', light: '#9E3558', dark: '#5C1730' },
  charcoal: '#2C2C2C',
  muted:    '#6B6B6B',
  border:   '#E5DDD5',
}
```

---

## SECTION 7 — STEP 5: BUILD THE APP

In PowerShell, navigate to your project folder and run:
```
npm run build
```

This creates a `dist` folder. That is the folder you deploy to Netlify.

You should see:
```
✓ built in Xs
```

If you see errors, check the error message and fix the relevant file before trying again.

---

## SECTION 8 — STEP 6: DEPLOY TO NETLIFY

1. Go to **netlify.com** and create a free account
2. On your dashboard, find the drag and drop zone
3. Drag your `dist` folder from your computer into that zone
4. Netlify will give you a URL like `sparkly-name-123.netlify.app`
5. Your app is live immediately

**To update the app after making changes:**
- Run `npm run build` again
- Drag the new `dist` folder to Netlify → Deploys tab

---

## SECTION 9 — STEP 7: SET UP THE HOSTINGER DATABASE

This is where all lead data gets stored.

**Create the database:**
1. Log into Hostinger hPanel
2. Go to **Websites → your website → Dashboard**
3. Click **Databases → Management**
4. Fill in:
   - Database name: `auditleads` (becomes `u[account]_auditleads`)
   - Username: `audituser` (becomes `u[account]_audituser`)
   - Password: choose a strong password and save it safely
5. Click **Create**
6. Note down the full database name and username shown

**Important:** Do NOT use the same database user as your WordPress site.
Create a brand new one specifically for the audit app.

---

## SECTION 10 — STEP 8: SET UP THE PHP FILE

The `save-lead.php` file is the bridge between your app and your database.

**Update the credentials in save-lead.php:**
```php
$host     = 'localhost';
$dbname   = 'u[account]_auditleads';
$username = 'u[account]_audituser';
$password = 'your-password';
```

**Upload to Hostinger:**
1. Go to **Hostinger → Files → File Manager**
2. Make sure you are in the correct website
3. Open the **public_html** folder
4. Upload `save-lead.php`

**Test the connection:**
1. Also upload `test-db.php` with the same credentials
2. Visit `https://yourdomain.co.uk/test-db.php` in a browser
3. You should see: `{"status":"Connected successfully!"}`
4. If you see an error, double check the credentials in the file

**Once confirmed working:**
- Delete `test-db.php` from the server (it is only for testing)

---

## SECTION 11 — STEP 9: TEST THE FULL FLOW

1. Go to your live Netlify URL
2. Complete the full audit — name, email, all 10 questions
3. Reach the results page
4. Go to **Hostinger → Databases → phpMyAdmin**
5. Click on your `auditleads` database
6. The `audit_leads` table should appear with your submission

**The table is created automatically on the first submission.**
If it does not appear, check that:
- `save-lead.php` is uploaded to public_html
- The database credentials in the PHP file are correct
- The endpoint URL in `submitLead.js` matches the PHP file location
- You rebuilt and redeployed to Netlify after updating `submitLead.js`

---

## SECTION 12 — STEP 10: CONNECT A CUSTOM DOMAIN

This gives your app a clean URL instead of the Netlify default.

**Important rule:** Do not use a subdomain that already has a website on Hostinger.
Choose a subdomain with no existing site — for example `income`, `quiz`, `start`, or `audit`.

**Step A — Add the domain in Netlify:**
1. Go to **Netlify → Domain management**
2. Click **Add domain alias**
3. Type your chosen subdomain e.g. `income.secondactadvisory.co.uk`
4. Click Verify

**Step B — Add a CNAME record in Hostinger:**
1. Go to **Hostinger → Domains → your domain → DNS / Nameservers**
2. Add a new record:
   - Type: CNAME
   - Name: `income` (or your chosen subdomain)
   - Content: your Netlify URL e.g. `earnest-medovik-5fdba3.netlify.app`
   - TTL: 3600
3. Save

**Step C — Wait for DNS propagation:**
- Check progress at **dnschecker.org**
- Search for `income.yourdomain.co.uk` with CNAME selected
- Wait until you see green ticks appearing
- This takes between 15 minutes and 2 hours

**Step D — Verify in Netlify:**
- Go back to Netlify → Domain management
- Click **Verify DNS configuration**
- Once verified, Netlify issues a free SSL certificate automatically

**Step E — Set as primary domain:**
- Click **Options** next to your custom domain
- Select **Set as primary domain**

---

## SECTION 13 — HOW TO VIEW YOUR LEADS

1. Log into **Hostinger hPanel**
2. Go to **Websites → your website → Dashboard**
3. Click **Databases → phpMyAdmin**
4. Click on `u[account]_auditleads` in the left sidebar
5. Click on **audit_leads** table
6. Click **Browse**

You will see each submission as a row with:
- Name and email
- Age range and life season
- Primary and secondary archetype
- Scores for all 5 categories
- Date and time of submission

---

## SECTION 14 — HOW TO UPDATE THE APP

### Change questions
Edit: `src/data/questions.js`
Each question has an `id`, `type`, `question`, `options`, and scoring weights.

### Change result copy
Edit: `src/data/archetypes.js`
Each archetype has a title, tagline, summary, income paths, strengths, blockers, first step, and CTA text.

### Change scoring logic
Edit: `src/utils/scoring.js`
The CONDITIONS array controls which archetype is matched based on score thresholds.

### Change CTA links
Edit: `src/App.jsx` — the CONFIG object at the top of the file.

### Change brand colours
Edit: `tailwind.config.js` — the colors section.

### After any changes:
```
npm run build
```
Then drag the new `dist` folder to Netlify.

---

## SECTION 15 — TROUBLESHOOTING

| Problem | Likely Cause | Fix |
|---|---|---|
| `npm` not found | Node.js not installed or PATH not refreshed | Reinstall Node.js, open new PowerShell |
| Scripts disabled error | PowerShell execution policy | Run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` |
| Build fails | Syntax error in a .jsx or .js file | Check the error message, fix the file |
| White screen on Netlify | Old build deployed | Run `npm run build` again, redeploy |
| test-db.php shows error | Wrong credentials or wrong host | Check db name, username, password. Use `localhost` as host |
| No data in database | submitLead.js not updated or app not rebuilt | Check endpoint URL, rebuild, redeploy |
| DNS all red on DNSChecker | Subdomain already has a Hostinger website | Use a different subdomain with no existing site |
| DNS pending in Netlify | Propagation still in progress | Wait 1–2 hours and retry verification |
| WordPress showing error | DB password was changed | Update DB_PASSWORD in wp-config.php |

---

## SECTION 16 — CURRENT CONFIGURATION (YOUR SETUP)

| Item | Value |
|---|---|
| Netlify project | earnest-medovik-5fdba3.netlify.app |
| Custom domain | income.secondactadvisory.co.uk |
| PHP endpoint | https://audit.secondactadvisory.co.uk/save-lead.php |
| Database host | localhost |
| Database name | u142852309_auditleads |
| Database user | u142852309_audituser |
| Skool URL | https://www.skool.com/second-act-income-lab-6876 |
| Booking URL | https://calendly.com/olufunketadeyinka/30min |
| Project folder | C:\Users\olufu\.claude\Initial Startup\second-act-income-audit |

---

## SECTION 17 — FUTURE UPGRADES (WHEN READY)

| Upgrade | What it does | Where to add it |
|---|---|---|
| ConvertKit / Kit integration | Adds each lead to your email list automatically | src/utils/submitLead.js — uncomment the stub |
| Airtable integration | View leads in a spreadsheet format | src/utils/submitLead.js — uncomment the stub |
| PDF download | Generates a branded PDF result | Add a PDF library like jsPDF |
| AI personalised report | Uses Claude or GPT to write a custom result | Add API call in ResultPage.jsx after results display |
| Admin dashboard | View and filter all leads in the app | New protected route + Supabase or Airtable |
| Paid upgrade pathway | Adds a payment step after results | Stripe integration on ResultPage |

---

## SECTION 18 — IF BUILDING THIS FOR A CLIENT

Work through this checklist before going live:

- [ ] Replace all brand colours in `tailwind.config.js`
- [ ] Replace Google Fonts with client's fonts in `src/index.css`
- [ ] Rewrite all questions in `src/data/questions.js`
- [ ] Rewrite all archetype copy in `src/data/archetypes.js`
- [ ] Update CTA URLs in `src/App.jsx`
- [ ] Update PHP endpoint URL in `src/utils/submitLead.js`
- [ ] Create new MySQL database on client hosting
- [ ] Update database credentials in `save-lead.php`
- [ ] Upload `save-lead.php` to client hosting public_html
- [ ] Test database connection with `test-db.php`
- [ ] Deploy to Netlify under client account
- [ ] Connect client custom domain via CNAME
- [ ] Wait for DNS propagation and verify in Netlify
- [ ] Complete a full test submission end to end
- [ ] Confirm lead appears in database
- [ ] Delete `test-db.php` from server
- [ ] Update SETUP-GUIDE.md with client-specific details
- [ ] Hand over login details and this playbook

---

*Playbook created: May 2026*
*Second Act Advisory Studio — secondactadvisory.co.uk*
