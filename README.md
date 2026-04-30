<div align="center">
  
  <h1>
    <img src="client/public/favicon.svg" alt="Veltrix Icon" width="40" style="vertical-align: middle; margin-right: 8px;" />
    Veltrix
  </h1>
  
  <p><strong>The Definitive Financial Operating System & Sovereign Wealth Ledger</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Redux_Toolkit-593D88?style=for-the-badge&logo=redux&logoColor=white" alt="Redux" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  </p>
</div>

---

## 🔗 Quick Links

Access the live project, complete API documentation, and original design architecture below:

- **🟢 Live Application:** [veltrix-silk.vercel.app](https://veltrix-silk.vercel.app/)
- **📄 Complete API Documentation:** [Postman Public Workspace](https://documenter.getpostman.com/view/50839472/2sBXqKneiC)
- **🎨 UI/UX Design Architecture:** [Figma Design File](https://www.figma.com/design/cdVVUVDGkP5GooQPCZDcXV/Untitled?node-id=0-1&t=zMHKJOdjg7hg6RWl-0)

---

## 🧭 About Veltrix

**Veltrix** is an enterprise-grade, premium SaaS financial management dashboard engineered specifically for high-net-worth ecosystems, elite freelancers, agencies, and modern small businesses. 

It was built to solve a critical problem: the fragmentation of financial tracking. By eliminating the friction of scattered Excel spreadsheets, disjointed WhatsApp payment reminders, and chaotic expense logging, Veltrix consolidates your entire financial universe into one cohesive, highly secure, and visually stunning dark-themed sovereign ledger.

Veltrix provides actionable insights, automated workflows, and institutional-grade tools to give you absolute control over your cash flow, client relationships, and business growth.

---

## 🛑 The Problem vs. 🌟 The Veltrix Solution

| The Problem (Legacy Methods) | The Veltrix Solution |
| :--- | :--- |
| **Fragmented Tracking:** Juggling spreadsheets, notebook apps, and bank statements to figure out who owes what. | **Unified Ledger:** A single, centralized dashboard displaying pending, paid, and overdue invoices instantly. |
| **Manual Calculations:** Calculating taxes, subtotals, and tracking partial payments by hand. | **Automated Engine:** Live-updating invoice previews, automatic line-item math, and real-time payment deductions. |
| **Blind Spots:** No clear visibility into month-over-month growth, operating expenses, or profit margins. | **Spectral Analytics:** Interactive cash flow tracking, billing momentum indicators, and expense categorization charts. |
| **Lost Client History:** Digging through emails to find past billing amounts or client contact details. | **Client Mastery CRM:** Dedicated client dossiers detailing lifetime value, active invoices, and complete histories. |

---

## ✨ Comprehensive Feature Breakdown

### 1. 📊 Deep Spectral Analytics & Dashboard
The nerve center of Veltrix, designed to provide immediate macro-level clarity.
- **Cash Flow Trend Graph:** Smooth-curve `recharts` area graphs comparing Income vs. Expenses over a trailing 6-month period.
- **Pipeline Overview:** Granular breakdown of your invoice pipeline into "Pending Review", "Needs Attention" (Overdue), and "Recently Settled" (Paid).
- **Billing Momentum & Growth Velocity:** Algorithmically calculated percentage indicators showing your financial trajectory compared to previous periods.
- **Metric Cards:** Instantly view Total Revenue, Pending Amounts, Total Active Clients, and Total Invoices generated.

### 2. 🧾 Institutional-Grade Automated Invoicing
A complete billing engine that replaces manual PDF generation.
- **Full Lifecycle Management:** Seamlessly transition invoices through states: `Draft` → `Sent` → `Paid` → `Overdue`.
- **Live WYSIWYG Preview:** A split-screen interface where modifications to line items, taxes, and notes instantly render on a high-fidelity invoice preview.
- **Smart Data Binding:** Automatically populates client details from the CRM and calculates subtotals, tax percentages, and grand totals in real-time.
- **Auto-Overdue Logic:** Backend cron-style validation automatically flags unpaid invoices that pass their due date.

### 3. 👥 Client Mastery (CRM)
Maintain a single source of truth for all business partners.
- **Unified Dossiers:** Track Client Name, Email, Phone, and Address in secure profiles.
- **Financial Linking:** Every client is strictly linked to their respective invoices, allowing for accurate lifetime value (LTV) calculations and filtering.
- **Responsive Grids:** View clients in highly responsive, visually appealing card stacks.

### 4. 💸 Complete Ledger & Expense Tracking
Understand your true profitability, not just gross revenue.
- **Payment Recording:** Log partial or full payments against specific invoices. The system automatically updates the linked invoice status to `Paid` when fully settled.
- **Expense Categorization:** Log fixed and variable operating costs (e.g., Software Subscriptions, Rent, Contractor Fees) to feed the Analytics engine.

### 5. 🔔 Real-Time System Notifications
Never miss a critical financial event.
- **Smart Alerting:** Receive in-app notifications for system events, payment confirmations, and invoice status escalations.
- **Unread Tracking:** A dedicated notification bell in the navigation bar tracks unread counts with a pulse indicator.
- **Global Actions:** Quickly "Mark All as Read" or click individual alerts to route directly to the relevant invoice or payment.

### 6. ⚙️ Secure User Settings & Authentication
Bank-grade security meets premium UX.
- **Stateless JWT Auth:** Secure, token-based authentication protecting all API endpoints and frontend routes.
- **Profile Management:** Update Business Name, User Name, and contact details that instantly reflect across all generated invoices.
- **Security Controls:** Change Master Passwords securely with bcrypt validation.

---

## 🏗️ Technical Architecture & Stack Deep Dive

Veltrix is built on a modern, decoupled **MERN** stack, utilizing a strict separation of concerns between the presentation layer and the RESTful API engine.

### 💻 Frontend Architecture (Client)
- **Core:** React 19 built with Vite for lightning-fast Hot Module Replacement (HMR) and optimized production builds.
- **Styling:** Tailwind CSS v4, heavily customized with a fintech-specific design token system (`index.css`) defining exact hex codes for success, warning, danger, and surface elevations.
- **State Management:** Redux Toolkit. We utilize modular slices (`authSlice`, `invoiceSlice`, `uiSlice`, etc.) combined with `createAsyncThunk` to handle complex asynchronous API interactions and global loading/error states cleanly.
- **Routing:** React Router DOM (v7). Implements strict route guards (`ProtectedRoute`, `PublicRoute`) and utilizes `React.lazy()` with `Suspense` for chunk-based code-splitting, dramatically reducing initial load times.
- **Motion & Interaction:** `framer-motion` drives fluid page transitions, staggered list reveal animations, and micro-interactions (like the hover states on metric cards).
- **Data Visualization:** `recharts` is used to render responsive, SVG-based financial charts with custom gradients and customized tooltips.
- **SEO & Metadata:** `react-helmet-async` dynamically injects titles, descriptions, Open Graph metadata, and Twitter cards on a per-page basis.

### ⚙️ Backend Architecture (Server)
- **Core:** Node.js running Express.js (v5).
- **Architecture Pattern:** Strict MVC (Model-View-Controller) structure ensuring business logic is decoupled from route definitions.
- **Database:** MongoDB hosted on Atlas, interfaced via Mongoose ODM.
- **Advanced Mongoose Features:** Utilization of Mongoose pre-save hooks for password hashing and complex aggregation pipelines (`$match`, `$group`, `$project`) in the `analyticsController` to calculate trailing 6-month cash flows efficiently.
- **Authentication:** Custom JWT generation and verification middleware. Passwords are salted and hashed using `bcryptjs`.
- **API Response Standardization:** A custom `apiResponse` and `apiError` utility class ensures that every single endpoint returns a predictable, identically structured JSON object to the frontend.

### 🛡️ Security & Performance Guardrails
- **Rate Limiting:** `express-rate-limit` prevents brute-force credential stuffing on the `/auth/login` and `/auth/register` endpoints.
- **HTTP Headers:** `helmet` secures Express apps by setting various HTTP headers (XSS protection, no-sniff, etc.).
- **Data Sanitization:** Strict payload validation prevents NoSQL injection attacks.
- **CORS Configuration:** Explicitly restricted Cross-Origin Resource Sharing locked down to the production Vercel URL.

---

## 🎨 UI/UX & Design System

Veltrix rejects the generic "bootstrap" look in favor of a highly bespoke, premium aesthetic.
- **The "Sovereign" Dark Theme:** Uses a deep, rich black (`#09090B`) rather than standard grays, combined with subtle glassmorphism (`backdrop-blur`) and 1px borders of `white/5` to create depth without heavy drop shadows.
- **Typography:** A dual-font system utilizing **Manrope** for sharp, impactful headlines and **Inter** for highly legible, dense financial data and body text. Tabular numeric variants are enforced for all currency displays to prevent layout shifting.
- **Color Psychology:** A primary vibrant Indigo (`#6366F1`) directs action, while strict semantic colors (Emerald for Paid, Amber for Pending, Rose for Overdue) instantly communicate state.

---

## 🔍 SEO & Web Optimization

Even as a protected dashboard application, Veltrix implements best-in-class SEO practices for its public-facing marketing pages:
- **Dynamic Head Management:** Titles, meta descriptions, and keywords adapt dynamically per route.
- **Social Sharing Optimization:** Fully configured Open Graph (`og:`) and Twitter Card tags ensure links shared on Slack, Twitter, or LinkedIn display beautiful preview images and accurate descriptions.
- **Structured Data (JSON-LD):** Implements `SoftwareApplication` schema on the landing page so search engines understand the product category, pricing, and publisher.
- **Crawler Directives:** A strict `robots.txt` and `sitemap.xml` are deployed, ensuring crawlers index the marketing funnel while strictly ignoring protected `/app/*` and `/api/*` paths.

---

## 🚀 Getting Started (Local Development Guide)

Follow this step-by-step guide to run the Veltrix ecosystem locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher required)
- [MongoDB](https://www.mongodb.com/) (A local instance or a free MongoDB Atlas cluster URL)
- [pnpm](https://pnpm.io/) (Highly recommended for faster, deterministic dependency installation)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/veltrix.git
cd veltrix
```

### 2. Backend Initialization & Setup
Open your terminal and navigate to the server directory:
```bash
cd server
pnpm install
```

**Configure Backend Environment Variables:**
Create a `.env` file in the root of the `server/` directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Connection
# Replace this with your actual MongoDB connection string
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/veltrix?retryWrites=true&w=majority

# Security (Make this a long, random string)
JWT_SECRET=v3ltr1x_sup3r_s3cr3t_k3y_2026_!@#

# CORS Configuration (Point to your local frontend)
CLIENT_URL=http://localhost:5173
```

**Start the API Server:**
```bash
pnpm dev
```
*You should see a console message: `Server running in development mode on port 5000` and `MongoDB Connected`.*

### 3. Frontend Initialization & Setup
Open a **new** terminal window, keeping the backend running:
```bash
cd client
pnpm install
```

**Configure Frontend Environment Variables:**
Create a `.env` file in the root of the `client/` directory:
```env
# Points to the local backend API
VITE_API_URL=http://localhost:5000/api/v1
```

**Start the Vite Development Server:**
```bash
pnpm dev
```

**Access the Application:**
Open your browser and navigate to `http://localhost:5173`. You can now register a new account and begin exploring Veltrix!

---

## 📁 Complete Project Structure

```text
Veltrix/
├── client/                               # React Frontend (Vite)
│   ├── public/                           # Static assets, Favicon, robots.txt, sitemap.xml
│   └── src/
│       ├── assets/                       # Images, SVGs
│       ├── components/                   # Reusable UI Architecture
│       │   ├── analytics/                # Recharts graph components
│       │   ├── dashboard/                # Metric cards, pipeline views
│       │   ├── invoices/                 # Live preview renders, line-item logic
│       │   ├── layout/                   # Global Sidebar, Navbar, PageWrappers
│       │   └── ui/                       # Atomic components (Buttons, Inputs, Badges, Modals)
│       ├── pages/                        # Route Views
│       │   ├── dashboard/                # Protected views (Dashboard, Clients, Invoices, Settings)
│       │   └── public/                   # Marketing views (Landing, Login, Signup)
│       ├── routes/                       # React Router configuration & Auth Guards
│       ├── services/                     # Axios instance & dedicated API wrapper functions
│       ├── store/                        # Redux Store Configuration
│       │   └── slices/                   # Individual state slices (auth, invoices, ui, notifications)
│       ├── utils/                        # Currency and Date formatting helpers
│       ├── App.jsx                       # Root Component
│       ├── index.css                     # Tailwind v4 directives & custom CSS variables
│       └── main.jsx                      # React DOM Entry & Provider Wrappers
│
├── server/                               # Node.js + Express Backend
│   └── src/
│       ├── config/                       # MongoDB connection logic
│       ├── controllers/                  # Core Business Logic (MVC Controllers)
│       ├── middleware/                   # JWT Auth extraction, Error handlers
│       ├── models/                       # Mongoose Schemas (User, Client, Invoice, Payment, Expense, Notification)
│       ├── routes/                       # Express Router definitions
│       ├── utils/                        # Custom Error & Response classes, AsyncHandlers
│       ├── app.js                        # Express App instantiation, Security middleware, CORS
│       └── server.js                     # HTTP Server entry point
│
├── docs/                                 # Initial Planning Documentation
│   ├── veltrix-prd.md                    # Product Requirements Document
│   ├── frontend.md                       # Frontend Specifications
│   ├── backend.md                        # Backend Specifications
│   └── theme.md                          # Design System Tokens
│
├── render.yaml                           # Infrastructure as Code (Render Backend Deployment Blueprint)
└── README.md                             # You are here
```

---

## 📖 API Documentation & Integration

The entire backend API is documented and ready for integration. 

We have provided a comprehensive **Postman Collection** that includes pre-configured requests, automated token extraction scripts (for login), and variable environments.

**Web Access:** View the full documentation online at our [Postman Public Workspace](https://documenter.getpostman.com/view/50839472/2sBXqKneiC).

---

## 📝 License & Copyright

This project is built as a premium portfolio showcase and a demonstration of full-stack engineering capabilities. It is proprietary software. All rights reserved.

<div align="center">
  <br />
  <p><i>"Architect your financial future with absolute precision."</i></p>
  <p>Built with ❤️ and extreme attention to detail.</p>
</div>
