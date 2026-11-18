# System Architecture

## 1. Architectural Overview

Agro Bridge is engineered as a **zero-framework, single-file HTML5 client application** (`index.html`) served via Vite in development (`port 3000`) and compiled into a self-contained static bundle (`dist/index.html`). All styling, vector line-art, state management, and screen rendering live inside `index.html`, with Google Fonts (`Fraunces` and `Inter`) as the sole external network dependency.

```text
+-------------------------------------------------------------------+
|                        Browser Runtime                            |
|  index.html (Inline CSS + Inline SVG Art + Pure JS State Engine)  |
|                                                                   |
|  [Auth Gate] -> [Menu] -> [Sell / Track / Market / Shop / Acct]   |
|                    |                                              |
|           In-Memory State Store                                   |
|     (lots[], orders[], alerts[], cart{}, profile, settings)       |
+-------------------------------------------------------------------+
```

---

## 2. Core Modules Inside `index.html`

### A. Visual & Design Token Layer (`<style>`)
- **Tokens**: CSS custom properties define `--ink` (`#0a0a0a`), `--text` (`#1a1a1a`), `--muted` (`#767676`), `--accent` (`#905831`), `--tan` (`#f1e3d3`), and semantic status pills (`#ece5dc`, `#dcefdc`, `#fbe5cf`).
- **Compositor Isolation**: The static topographic background (`#bgLayer`) blurs to `7px` on login (`class="dim"`), while the continuously moving truck (`#bgTruckLayer`) animates on its own `will-change: transform` layer to keep frame compositing lightweight.
- **Responsive Breakpoints**: Adapts across desktop (`≥860px`), tablet (`≤860px`), and mobile (`≤760px`, switching top pill nav to a safe-area-aware bottom tab bar).

### B. Inline SVG Illustration & Icon Engine
- **Scene Illustrations**: `heroSceneSvg()` (field → collection hub → market isometric scene) and `logisticsSceneSvg()` (side-view truck, location pin, sun, and horizon).
- **Icon System (`iconSvg`)**: Standardized `64×64` `viewBox` line-art library (`1.8px` stroke, `#ffffff` and `#f1e3d3` fills, `#905831` accents) covering navigation, payments, farm inputs, and produce (`tomato`, `onion`, `potato`, `chilli`, `banana`).

### C. Pure Domain & Calculation Functions
All business math and validation rules are isolated into pure functions so both the browser UI and Node unit tests (`tests/agroBridge.test.ts`, 11 test cases) execute identical logic:
- `getGradeRate(crop, grade)` & `gradeLotFromChecklist(crop, checklist)`: Applies `GRADE_MULTIPLIERS` (`A: 1.00`, `B: 0.92`, `C: 0.85`) deterministically from verified checklist criteria and produces an auditable inspection evidence record (`checkedItems`, `missingItems`, `reason`).
- `calculateNetRealization(crop, qtyKg, checkedCount)`: Computes 4-way net farmer proceeds (Local Mandi, Self-Haul to Deficit City, Agro Bridge Farm Gate, Agro Bridge Hub Drop) incorporating corridor freight, mandi brokerage, transit spoilage risk, hub drop credit, and milk-run consolidation bonuses.
- `getClusterPoolStatus(crop, qtyKg)`: Evaluates whether a farmer's lot unlocks the `1,500 kg` full-truckload milk-run bonus (`+₹0.40–₹0.80/kg`).
- `calculateLotPayout(lot)`, `getPendingPayout(lots)`, `getPayoutAdjustedTotal(orders)`, & `getAvailablePendingPayout(lots, orders)`: Computes net payable credit after deducting prior `Adjust from payout` input orders, preventing double-spending.
- `getForecastAccuracyStats(lots)`: Compares pre-booking predicted realization (`predictedNet`) against settled payout on completed lots (`stage >= 6`).
- `validateOtpCode`, `isValidEmail`, `isValidPickupDate`, & `validateSettingsForm`: Strict input validation for 4-digit numeric OTPs, emails, future pickup dates, UPI IDs, 9–18 digit bank accounts, and 11-character IFSC codes.
- `t(key, fallback)` & `jsArg(val)`: Multilingual localization lookup (`English`, `ಕನ್ನಡ`, `हिन्दी`, `தமிழ்`) and safe JSON-encoded HTML attribute escaping.

### D. State & Render Loop
- **No Web Storage**: All state resides in a single in-memory `state` object (no `localStorage`, no `sessionStorage`, no `<form>` elements).
- **Deterministic Re-render**: Every user action mutates `state` and calls `renderApp()`, keeping DOM markup synchronized with current application state.

---

## 3. Target Production Evolution

When moving beyond the demonstration prototype to a multi-user production platform:
1. **API & Auth Gateway**: Replace demo login tabs with OTP/OAuth verification and signed JWT sessions.
2. **Real-Time Telemetry**: Stream lot stage transitions, digital weighbridge receipts, and GPS fleet coordinates over WebSockets/Server-Sent Events.
3. **Persistent Ledger**: Back lot grading, payouts, and input orders with an ACID relational database and idempotent UPI/IMPS disbursement webhooks.
