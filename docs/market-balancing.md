# Market Balancing Engine

## 1. The Price Asymmetry Problem

Across Indian agricultural districts, perishable produce frequently experiences sharp same-day regional price dispersion:
- **Surplus production clusters** (e.g., Kolar for tomatoes, Nashik for onions, Guntur for chillies, Theni for bananas) face localized gluts, pushing farm-gate prices near or below cost of cultivation.
- **Deficit urban consumption centres** (e.g., Chennai, Bengaluru, Mumbai, Delhi NCR) simultaneously trade the same produce at 2×–3.5× higher wholesale rates due to fragmented logistics, multiple intermediary margins, and post-harvest transit spoilage.

---

## 2. How Agro Bridge Balances Supply & Demand

1. **Transparent Reference Pricing (`BASE_RATES`)**:
   Agro Bridge publishes a daily Grade A procurement rate valid until 6:00 PM that sits consistently **above** the local surplus farm-gate price and **below** destination market wholesale prices:

   | Crop | Surplus Market (Demo) | Agro Bridge Grade A | Highest Destination Market (Demo) | Market Spread |
   | --- | --- | --- | --- | --- |
   | Tomato | Kolar · ₹8/kg | ₹9/kg (+₹1/kg) | Chennai · ₹24/kg | ₹16/kg |
   | Onion | Nashik · ₹14/kg | ₹15/kg (+₹1/kg) | Chennai · ₹29/kg | ₹15/kg |
   | Potato | Agra · ₹11/kg | ₹12/kg (+₹1/kg) | Hyderabad · ₹21/kg | ₹10/kg |
   | Chilli | Guntur · ₹62/kg | ₹68/kg (+₹6/kg) | Chennai · ₹88/kg | ₹26/kg |
   | Banana | Theni · ₹9/kg | ₹10/kg (+₹1/kg) | Delhi · ₹30/kg | ₹21/kg |

2. **Standardized Quality Grading (`GRADE_MULTIPLIERS`)**:
   At weighing (Stage 3), produce is graded transparently rather than rejected arbitrarily:
   - **Grade A (`1.00×`)**: Clean, sorted, unbruised, crate-packed produce.
   - **Grade B (`0.92×`)**: Minor size or cosmetic variance.
   - **Grade C (`0.85×`)**: Processing/secondary channel grade.

3. **Hub Consolidation & Line-Haul Dispatch**:
   Collection hubs aggregate farm-gate pickups into full-truckload (FTL) refrigerated or ventilated dispatches routed toward the highest-deficit destination cities (`Best markets for your crops`).

---

## 3. Farmer Decision Tools in the App

- **City Price Comparison Bars**: Displays every tracked city sorted ascending, highlighting the surplus floor in green (`#2b6b32`) and peak deficit market in terracotta (`#905831`).
- **Extra Earnings Calculator**: Computes `(Agro Bridge Base Rate − Lowest Surplus City Price) × Quantity (kg)` in real time so farmers can quantify gains before booking a pickup.
- **Target Price Alerts**: Farmers set a `₹/kg` threshold per crop and receive immediate feed alerts when destination rates move.
