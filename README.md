# JAOLA Lead Operations

**Public demo / version 0.1.** A client-side prototype for tracking fictional real-estate leads, property references, assignment, and follow-ups. This repository is intended for demonstrations and product validation, **not production usage**.

## Current features

- Dashboard with total, active, overdue, and due-today lead counters
- Create/edit fictional leads, change stages, assign a property reference and agent
- Search and filter leads
- CSV export
- Demo reset
- Browser-local storage only (`localStorage`), no server, user accounts, or true multi-user sync

## How to run locally

Open `index.html` in a modern browser. No package manager or dependency installation is necessary.

If using VS Code, optionally run a local static server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## How to publish the demo on GitHub Pages

1. Create a **new public repository**, e.g. `jaola-lead-operations`, on your GitHub account. Do **not** overwrite the existing JAOLA business website repository.
2. Upload the *contents* of this folder to the new repository. `index.html`, `styles.css`, and `app.js` must all be in the repository root.
3. Open **Settings → Pages → Build and deployment**.
4. Under **Source**, select **Deploy from a branch**, with branch **main** and folder **/(root)**, then save.
5. After GitHub finishes publishing, click **Visit site** on the Pages settings screen. The expected URL format is `https://<USERNAME>.github.io/jaola-lead-operations/`.

Documentation: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Project structure

```
index.html      Static HTML document
styles.css      Styles and responsive layout
app.js          Demo state, data, event handlers and CSV export
README.md       This guide
ROADMAP.md      Suggested next improvements
SECURITY.md     Critical safety / privacy boundaries
```

## Business concept

JAOLA would initially sell **configuration, staff training, and maintenance** of lead-management workflows to real-estate agencies. This demo is a conversation starter and a requirements-discovery tool. It is not a paid SaaS product yet.

## Important limitations

- **Use fictional data only.** GitHub Pages and browser local storage do not make this a secure agency CRM.
- The menu items are visual placeholders; the current lead tracker is the working feature.
- There is no WhatsApp API integration, automated messaging, user login, shared database or backup.
- Public code and published Pages content are not private. Never commit customer data, credentials, private keys, or API secrets.

See `ROADMAP.md` before adding features.
