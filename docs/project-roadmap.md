# Project Roadmap

## Phase 1 — Farmer-Facing Editorial Prototype & Core Differentiation (Completed)
- [x] Self-contained single-file HTML/CSS/JS build with offline-friendly inline SVG illustrations and veggie/fruit crop icons.
- [x] Farmer onboarding flows (Google, Email, validated 4-digit Phone OTP demo).
- [x] Pickup slot booking with crop picker cards, milk-run cluster pooling (`1,500 kg` FTL bonus), quality checklist estimator, and Net Realization preview.
- [x] 7-stage produce tracker with matched verified buyer, deterministic checklist-backed grading evidence, dispute/grade review flag, and digital settlement receipt.
- [x] 4-way Net Realization Engine, city market price bars, Verified Destination Buyer reliability cards, and smart price alerts.
- [x] Farm inputs store with cart stepper, ₹2,000 free-delivery progress, and double-spend-guarded `Adjust from payout` credit ledger.
- [x] Estimate vs. settled Forecast Calibration tracking and interactive multilingual UI toggle (`English`, `ಕನ್ನಡ`, `हिन्दी`, `தமிழ்`).
- [x] Automated unit test suite (`tests/agroBridge.test.ts`, 11 tests) and headless browser verification.

---

## Phase 2 — Persistent Backend & Digital Weighbridge Integration
- [ ] REST/WebSocket API backend with persistent database storage for lots, hubs, verified buyer scorecards, and farmer profiles.
- [ ] Real SMS OTP verification and full deep-copy vernacular localization across all tables and receipts.
- [ ] Collection-hub operator tablet view for barcode crate scanning, digital scale integration, and photo-verified A/B/C grading.
- [ ] Automated UPI & IMPS payout disbursement via payment gateway webhooks with idempotent settlement reconciliation.

---

## Phase 3 — B2B Buyer Portal & Dynamic Dispatch Optimization
- [ ] Dedicated **Buyer Dashboard** for wholesale mandis, modern retail chains, and food processors to bid on or reserve incoming Grade A/B/C hub inventory.
- [ ] Demand-forecasting and dynamic route balancing engine matching district harvest surpluses to deficit-city buyer commitments.
- [ ] Cold-storage capacity utilization tracking and automated backhaul scheduling for farm input deliveries.

---

## Phase 4 — Financial Inclusion & Advisory
- [ ] Historical yield & grade analytics per farmer to unlock low-interest seasonal input credit.
- [ ] Hyperlocal weather and harvest-window advisories integrated into pickup slot recommendations.
