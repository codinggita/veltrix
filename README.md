<p align="center">
  <h1 align="center">Veltrix</h1>
  <p align="center"><strong>Invoice Management for Small Businesses</strong></p>
  <p align="center"><em>"Your Business Finances. Finally Clear."</em></p>
</p>

---

## 🧭 Overview

Veltrix is a **dark-themed, premium SaaS financial management dashboard** built for small business owners and freelancers. It consolidates invoice creation, payment tracking, client management, and cash-flow analytics into one intuitive interface.

### The Problem

Small businesses and freelancers juggle finances across fragmented tools:

- 📱 **WhatsApp notes** — scattered payment reminders lost in chats
- 📊 **Excel sheets** — manual tracking prone to errors
- 💸 **UPI chaos** — no structured record of who paid what and when

### The Solution

**One clean Veltrix dashboard** that replaces all of the above — track invoices, manage clients, monitor payments, and understand your cash flow at a glance.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | JWT-based login / signup with bcrypt password hashing |
| 📊 **Dashboard** | Summary cards (Total, Pending, Paid Invoices) + recent invoices table |
| 🧾 **Invoice Management** | Full CRUD with line items, auto-calculated totals, and status lifecycle (Pending → Paid → Overdue) |
| 👥 **Client Management** | Card/grid view with per-client financials and full CRUD |
| ⚙️ **Settings** | Profile and business details management |
| 🌙 **Dark Theme** | Premium dark-mode UI as default, persisted in localStorage |
| 🔔 **Notifications** | Toast alerts for success/error actions |

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React (Vite) | Component framework + fast HMR |
| **Styling** | Tailwind CSS | Utility-first styling with custom design tokens |
| **State** | Redux Toolkit | Global state management with async thunks |
| **Routing** | React Router DOM | Client-side routing with protected routes |
| **Animations** | Framer Motion | Page transitions and micro-interactions |
| **Charts** | Recharts | Dashboard data visualization |
| **Forms** | React Hook Form + Yup | Form handling with schema validation |
| **HTTP** | Axios | Centralized API client with interceptors |
| **Backend** | Node.js + Express | REST API server |
| **Database** | MongoDB Atlas + Mongoose | Cloud NoSQL with ODM |
| **Auth** | JWT + bcrypt | Stateless authentication with hashed passwords |

---

## 📁 Project Structure

```
Veltrix/
├── client/                     # React frontend (Vite)
│   └── src/
│       ├── components/
│       │   ├── ui/             # Button, Input, Card, Modal, Table, Badge, Loader
│       │   └── layout/         # Sidebar, Navbar, PageWrapper
│       ├── pages/
│       │   ├── public/         # LandingPage, LoginPage, SignupPage
│       │   └── dashboard/      # DashboardPage, InvoicesPage, ClientsPage, SettingsPage
│       ├── features/           # Redux slices (auth, user, invoice, client, ui)
│       ├── services/           # Axios instance + API service modules
│       ├── hooks/              # Custom React hooks
│       ├── utils/              # Formatters, helpers, constants
│       ├── store.js            # Redux store configuration
│       ├── App.jsx             # Route definitions
│       └── main.jsx            # Entry point with Redux Provider
│
├── server/                     # Node.js + Express backend
│   └── src/
│       ├── config/             # Database connection (db.js)
│       ├── models/             # Mongoose schemas (User, Client, Invoice)
│       ├── controllers/        # Request handlers (auth, client, invoice)
│       ├── routes/             # API route definitions + aggregator
│       ├── middleware/         # JWT auth middleware
│       ├── app.js              # Express setup (CORS, JSON, routes, error handler)
│       └── server.js           # Server entry point
│
└── docs/                       # Project documentation
    ├── veltrix-prd.md          # Complete product requirements document
    ├── frontend.md             # Frontend specification
    ├── backend.md              # Backend specification
    ├── theme.md                # Design system & tokens
    └── github.md               # Git workflow & conventions
```

---

## 🛣️ Routes

### Public Routes

| Path | Page | Description |
|---|---|---|
| `/` | Landing Page | Conversion-focused page with hero, features, CTA |
| `/login` | Login Page | Split-screen login with email/password |
| `/signup` | Signup Page | Split-screen registration form |

### Protected Routes (requires JWT)

| Path | Page | Description |
|---|---|---|
| `/app/dashboard` | Dashboard | Summary cards + recent invoices table |
| `/app/invoices` | Invoices | Full invoice list with CRUD operations |
| `/app/clients` | Clients | Client card grid with CRUD operations |
| `/app/settings` | Settings | Profile and business details |

---

## 🔌 API Endpoints

**Base URL:** `/api/v1`

### Auth (`/api/v1/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | ❌ | Register new user |
| POST | `/auth/login` | ❌ | Login, returns JWT |
| GET | `/auth/me` | ✅ | Get current user profile |

### Clients (`/api/v1/clients`) — All Protected

| Method | Endpoint | Description |
|---|---|---|
| POST | `/clients` | Create client |
| GET | `/clients` | List all clients |
| GET | `/clients/:id` | Get single client |
| PUT | `/clients/:id` | Update client |
| DELETE | `/clients/:id` | Delete client |

### Invoices (`/api/v1/invoices`) — All Protected

| Method | Endpoint | Description |
|---|---|---|
| POST | `/invoices` | Create invoice |
| GET | `/invoices` | List all invoices |
| GET | `/invoices/:id` | Get single invoice |
| PUT | `/invoices/:id` | Update invoice |
| DELETE | `/invoices/:id` | Delete invoice |

---

## 🎨 Design System

| Token | Hex | Usage |
|---|---|---|
| `bg-primary` | `#0F0F0F` | Main page background |
| `bg-secondary` | `#1A1A1A` | Cards, panels, sidebars |
| `bg-tertiary` | `#202020` | Elevated surfaces, inputs |
| `border-dark` | `#2A2A2A` | Dividers, card outlines |
| `primary` | `#4F46E5` | Buttons, active states, links |
| `success` | `#22C55E` | Paid badges, positive states |
| `warning` | `#F59E0B` | Pending badges, caution states |
| `danger` | `#EF4444` | Overdue badges, errors |
| `text-primary` | `#E5E7EB` | Main body text |
| `text-secondary` | `#9CA3AF` | Labels, subtitles |
| `text-muted` | `#6B7280` | Metadata, placeholders |

**Font:** Inter (Google Fonts) · **Spacing:** 8px grid · **Border Radius:** Cards 16px, Buttons 12px, Inputs 10px

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/Veltrix.git
cd Veltrix

# Backend setup
cd server
npm install
cp .env.example .env   # Configure your MongoDB URI and JWT secret

# Frontend setup
cd ../client
npm install
cp .env.example .env   # Configure API URL
```

### Running Locally

```bash
# Start backend (from server/)
npm run dev

# Start frontend (from client/)
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

---

## 📖 Documentation & Design

For the complete product specification, see:

- [Figma Design](https://www.figma.com/design/cdVVUVDGkP5GooQPCZDcXV/Untitled?node-id=0-1&t=Jvs9vqxuuyQHoMBv-1) — UI mocks and components
- [Product Requirements Document](docs/veltrix-prd.md) — Full PRD with all specs
- [Frontend Specification](docs/frontend.md) — Component and page details
- [Backend Specification](docs/backend.md) — API and database schemas
- [Design System](docs/theme.md) — Colors, typography, spacing tokens
- [Git Workflow](docs/github.md) — Branch strategy and commit conventions

---

## 📝 License

This project is built as a college assignment / portfolio project.
