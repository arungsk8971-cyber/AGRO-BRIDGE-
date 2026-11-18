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
All business math is isolated into pure functions so both the browser UI and Node unit tests (`tests/agroBridge.test.ts`) execute identical logic:
- `getGradeRate(crop, grade)`: Applies `GRADE_MULTIPLIERS` (`A: 1.00`, `B: 0.92`, `C: 0.85`) to `BASE_RATES` and rounds to integer INR.
- `calculateLotPayout(lot)` / `getPendingPayout(lots)` / `getReceivedPayout(lots)`: Computes settled vs pending payouts based on lot stage (`0–2` awaiting weighing, `3–5` due on delivery, `6` paid).
- `getPaymentRef(lot)`: Generates deterministic demonstration reference codes (`UPI-xxxxxx`, `IMPS-xxxxxx`, `CASH-xxxxxx`) only once stage `6` is reached.
- `calculateCartTotals(cart)` & `canAdjustFromPayout(total, pending)`: Applies the `₹80` delivery fee below `₹2,000` subtotal and guards payout-adjusted checkout against pending payout balance.

### D. State & Render Loop
- **No Web Storage**: All state resides in a single in-memory `state` object (no `localStorage`, no `sessionStorage`, no `<form>` elements).
- **Deterministic Re-render**: Every user action mutates `state` and calls `renderApp()`, keeping DOM markup synchronized with current application state.

---

## 3. Target Production Evolution

When moving beyond the demonstration prototype to a multi-user production platform:
1. **API & Auth Gateway**: Replace demo login tabs with OTP/OAuth verification and signed JWT sessions.
2. **Real-Time Telemetry**: Stream lot stage transitions, digital weighbridge receipts, and GPS fleet coordinates over WebSockets/Server-Sent Events.
3. **Persistent Ledger**: Back lot grading, payouts, and input orders with an ACID relational database and idempotent UPI/IMPS disbursement webhooks.
