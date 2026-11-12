# JAOLA Lead Operations — Development Roadmap

This is a *proposed* backlog. Prioritize based on interviews with real estate teams, not simply feature requests.

## Phase 0 — Product validation (before paid hosting)

- [ ] Talk to 5–10 agencies using the public **fictional-data** demo.
- [ ] Identify one costly, frequent lead-tracking problem and what the agency currently uses.
- [ ] Test whether anyone will agree to pay for implementation/training.
- [ ] Choose a minimal pilot scope, installation process, price, and support boundary.

## Phase 1 — Improve the demo (can remain static and free)

- [ ] Functional `Inmuebles`/property catalog with fictional data
- [ ] Lead detail view with activity notes and next-action history
- [ ] Sort/filter by assigned agent and due date
- [ ] Useful status transitions and input validation
- [ ] Add automated browser tests for add/edit/filter/export/reset
- [ ] Improve accessibility, mobile layout, and error messages
- [ ] Add EN/ES interface language switch

## Phase 2 — Secure pilot application (backend required)

- [ ] Pick backend, secure hosting, and clear operating costs
- [ ] Implement user authentication, authorization and role-based access
- [ ] Separate agencies' records securely (tenant isolation and security tests)
- [ ] Set up secure server-side storage, encryption in transit, and backups
- [ ] Configure privacy notice, retention, deletion, and access controls
- [ ] Implement audit logs and secure monitoring
- [ ] Pilot with an agency only after privacy and security requirements are reviewed

## Phase 3 — Demand-backed commercial features

- [ ] Shared leads for authorized agency staff
- [ ] Reminder notifications with appropriate consent and delivery provider
- [ ] Property import and deduplication
- [ ] Optional official WhatsApp integration, subject to platform rules and fees
- [ ] Subscription/billing only after a paid service is validated

## Non-goals for now

- Real estate brokerage, negotiating sales, or collecting commissions
- Scraping customer data or bulk WhatsApp messaging
- Building a sophisticated AI agent without evidence of demand

**Decision rule:** Do not build a feature solely because it is impressive. Identify a user problem and preferably a paying pilot first.
