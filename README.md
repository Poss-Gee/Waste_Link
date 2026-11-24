# WasteLink Ghana 🇬🇭
> **Connecting Homes. Empowering Collectors. Cleaner Communities.**
>
> *Smart Household Waste Collection & Negotiated Payment Management Platform for Ghana.*

---

## 🌿 Executive Overview

**WasteLink Ghana** is a responsive Progressive Web Application (PWA) that connects households directly with independent tricycle waste collectors (*Aboboyaa / Motor King*) across Ghanaian municipalities. 

It is an **independent platform** designed to bring digital transparency, dignity, and efficiency to informal waste collection. It does **not** depend on Zoomlion or any single conglomerate's internal infrastructure.

### The 3 Core Roles:
1. **Household / Resident:** On-demand rubbish collection booking, GPS map location pinning, live interactive price negotiation, real-time lifecycle tracking, and cash or Mobile Money settlement with instant digital receipts.
2. **Independent Tricycle Collector:** 1-handed mobile-optimized cockpit, online/offline availability switch, nearby job discovery, price proposal and counteroffer chat, GPS turn-by-turn navigation, collection evidence photo upload, and daily/weekly earnings dashboard.
3. **Platform Administrator:** Executive dashboard with dynamic KPIs calculated directly from live state, collector Ghana Card & DVLA permit verification queue, collection monitoring across Accra, dispute resolution workflow, and financial audit logs.

---

## 🛠️ Technology Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server Components & Client Interactive State)
- **Language:** TypeScript 5 (Strict type safety across all models)
- **Styling:** Tailwind CSS (Custom environmental palette conforming to WasteLink guidelines)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Visuals:** Custom Accra GPS visual map picker, live tricycle route animator, canvas confetti celebration
- **Persistence:** LocalStorage persistence engine with instant *"Reset Demo Data"* capabilities for academic evaluators
- **PWA Capabilities:** Standalone manifest (`manifest.json`), offline action queue, and sync simulation engine

---

## 🎨 Brand Identity & Design System

- **Forest Green (`#14532D`):** Primary brand anchor representing environmental stewardship
- **Eco Green (`#16A34A`):** Fresh action highlights, online status indicators, and success badges
- **Light Green (`#DCFCE7`):** Subtle accents, pill backgrounds, and receipt highlights
- **Warm Off-White (`#F7F9F5`):** Clean, accessible background reducing eye strain
- **Surface White (`#FFFFFF`):** Rounded cards with restrained shadows
- **Dark Charcoal (`#17231B`):** High-contrast, legible typography
- **Currency:** Ghana Cedis (**GH₵**)
- **Phone Standard:** Ghanaian international format (**+233**)

---

## 📱 Three-Role Integrated Experience

Evaluators can effortlessly switch between all 3 roles using the **Evaluator Quick Bar** at the top of the screen:

### 1. Household Portal
- **Dashboard:** Welcome banner, quick-action *"Request Rubbish Pickup"*, active job tracker card, nearby available tricycles, and recent collection history.
- **Request Rubbish Pickup:** On-demand booking form with interactive Accra Zone Map Picker (Madina, East Legon, Adenta, Dansoman, Kasoa, Spintex, Tema, Dome, Achimota, Osu), waste category selector (Household, Organic, Plastics/Recyclables, Bulky/E-Waste, Commercial Small-Shop), volume estimator, gate instructions, and rubbish photo upload preview.
- **Nearby Collectors:** Browse verified independent tricycles, distance estimations, customer star ratings, plate registration numbers, and direct request dispatch.
- **Interactive Price Negotiation:** Real-time conversation thread where riders propose prices and households can accept, decline, or counteroffer. The booking is binding only upon mutual agreement.
- **Live 8-Stage Progress Tracker:**
  1. *Request Submitted*
  2. *Collector Assigned*
  3. *Price Agreed*
  4. *Collector on the Way*
  5. *Collector Arrived*
  6. *Collection in Progress*
  7. *Collection Completed*
  8. *Payment Confirmed*
- **Payment & Receipt:** Cash or Mobile Money simulation (MTN MoMo, Telecel Cash, AT Money). Generates a printable, verifiable digital receipt with transaction reference (`WL-MOMO-...`) and QR authentication.
- **Complaints & Support:** File service dispute (spilled waste, overcharging, no-show) with direct administrator mediation.

### 2. Collector Hub (Mobile-First Cockpit)
- **Header Toggle:** Prominent One-Handed *"Online & Ready"* toggle controlling real-time discovery.
- **Incoming Requests:** Card feed of household bookings with waste photos, distance, and landmarks. One-click *"Propose Price"* dialog.
- **Active Job Execution:**
  - Turn-by-turn navigation simulation to household gate
  - *"I Have Arrived"* status beacon (notifies household)
  - *"Start Loading Waste"*
  - Evidence photo capture (loaded cart & clean site)
  - *"Mark Collection Completed"*
  - Cash confirmation or MoMo verification
- **Earnings Ledger:** Today's, weekly, monthly, and all-time revenue with Cash vs Mobile Money breakdown.
- **Verification Badge:** Ghana Card NIA authentication and DVLA tricycle permit status.

### 3. Platform Administrator Console
- **Executive Overview:** All statistics calculated dynamically from state:
  - Total Households, Registered Collectors, Verified Operators, Pending Applications
  - Total Pickups, Completed Collections, Cancelled Collections
  - Total Gross Transaction Value (GMV in GH₵)
  - Active Online Collectors
  - Payment Ratio Charts (MoMo vs Direct Cash)
- **Verification Queue:** Review pending tricycle riders (e.g., Emmanuel Osei, Mohammed Gariba), inspect Ghana Cards and vehicle tags, with one-click *"Approve & Verify"* or *"Reject"*.
- **Collection Monitoring:** Filterable table across all Greater Accra municipal zones.
- **Payment & MoMo Ledger:** Audit transaction references and digital receipts.
- **Dispute Mediation:** Review customer complaints, input administrative findings, and mark resolved.
- **Audit Logs:** Real-time chronological platform activity feed.

---

## 📴 Offline-First PWA Functionality

Independent tricycle operators frequently navigate network dead zones. WasteLink Ghana includes a built-in offline simulation:
1. Click **"Offline Active"** in the top Evaluator Bar.
2. In the Collector Hub, perform lifecycle actions (e.g., *"I Have Arrived"*, *"Start Loading"*, *"Mark Completed"*).
3. Notice that updates are safely queued in local storage (`offlineQueue`) and a pending sync count is displayed.
4. Toggle back to Online and click **"Sync (N)"** to synchronize queued tasks to the cloud database with animated feedback.

---

## 🇬🇭 Realistic Ghanaian Demonstration Dataset

- **10 Households:** Akosua Mensah (East Legon), Kwame Osei-Bonsu (Madina), Nana Ama Boateng (Adenta), Joseph Addo (Dansoman), Abena Serwaa Prempeh (Kasoa), Eunice Tetteh (Tema), Daniel Bruce (Osu), Grace Naa Ashiokor (Spintex), Kofi Owusu-Ansah (Dome), Mercy Agbettor (Achimota).
- **8 Collectors:** Kofi Mensah (Speedy Kofi - Motor King 200cc), Kwesi Appiah (Royal Aboboyaa 150cc), Ibrahim Tanko (Dayun Trike 200cc), Samuel Boateng, Emmanuel Osei (Pending Verification), Kwabena Frimpong, Yaw Antwi, Mohammed Gariba.
- **15 Lifecycle Collection Requests:** Across all 8 stages including active negotiations, live en-route jobs, awaiting payments, and completed receipted jobs.
- **Full Complaints, Activity Logs, and Notifications.**
- **Reset Demo Data:** Evaluators can click *"Reset Data"* in the top bar anytime to restore the pristine sample dataset.

---

## 🚀 Running the Application Locally

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Start the development server
npm run dev

# 3. Open in your browser
# Navigate to http://localhost:3000
```

To run a production build:
```bash
npm run build
npm start
```

---

*Designed and engineered for university demonstration excellence.*

