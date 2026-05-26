
# MPloyChek SPA — NSQTech Internship Code Challenge


---

## 🚀 Project Overview

**MPloyChek** is a Single Page Application (SPA) built for NSQTech's digital background verification platform. It demonstrates role-based access control, async API handling, user management, and a clean modular architecture — all built with modern frontend best practices.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 (Angular-pattern architecture) |
| Language | TypeScript-ready JavaScript (JSX) |
| Styling | Pure CSS with Glassmorphism Design System |
| Storage | localStorage-backed mock database |
| API Layer | Simulated async REST API with configurable delay |
| Fonts | Playfair Display · Nunito · JetBrains Mono |

---

## ✅ Features Implemented

### 🔐 Login Page
- User ID, Password, and Role fields
- Role selection: **General User** and **Admin**
- Dummy API with localStorage as the data store
- Configurable API delay slider (200ms – 3000ms) to simulate async latency
- Error handling for invalid credentials or role mismatch

### 🏠 Dashboard (Logged-In Page)
- Displays logged-in user profile details (name, email, department, role, status)
- API call to fetch verification records on page load
- Records displayed in a clean table format
- **Access level control:**
  - General Users see only their own records
  - Admin sees all records across all users
- Stat cards showing: Total, Verified, Pending, Flagged counts
- Skeleton loaders and spinners during async API calls

### 👥 User Management (Admin Only)
- Full **CRUD** operations: Create, Read, Update, Delete users
- Modal form for adding and editing users
- Role and status management
- Loading overlay during API operations
- Toast notifications for success/error feedback

### ⚙️ Settings Page
- Live API delay control (affects all API calls app-wide)
- Demonstrates async processing behaviour across the app

### 🔄 Async Processing
- Every API call uses configurable delay simulation
- Skeleton loaders on table/card data
- Full-page loading overlays on management screens
- Spinner buttons during form submissions

### 🧩 Modular Architecture
- `AppService` — singleton pub/sub service (mirrors Angular's `Injectable`)
- `api` module — centralized async API layer
- `useAppService` — custom hook for global state
- Separate page components: `LoginPage`, `DashboardPage`, `UserManagementPage`, `SettingsPage`

---

## 👤 Demo Credentials

| Username | Password | Role |
|---|---|---|
| admin | admin123 | Admin |
| alice | alice123 | General User |
| bob | bob123 | General User |
| carol | carol123 | General User |

---

## 📁 Project Structure

```
mploychek-spa/
├── mploychek-spa.jsx      # Main SPA component (all-in-one)
└── README.md              # Project documentation
```

---

## ▶️ How to Run

### Option 1 — Vite + React (Recommended)
```bash
npm create vite@latest mploychek --template react
cd mploychek
npm install
# Replace src/App.jsx with mploychek-spa.jsx content
npm run dev
```

### Option 2 — Create React App
```bash
npx create-react-app mploychek
cd mploychek
npm install
# Replace src/App.js with mploychek-spa.jsx content
npm start
```

### Option 3 — Angular 12+ Integration
```bash
ng new mploychek-app
cd mploychek-app
npm install @angular/core @angular/common
# Use the JSX component as a reference to build Angular components
# Wire up Node.js/Express backend replacing the mock API
ng serve
```

---

## 🔌 Backend Integration (Production)

Replace the `api` mock object with real HTTP calls:

```javascript
// Example: Replace api.login with real endpoint
login: async (username, password, role) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role })
  });
  if (!res.ok) throw new Error('Invalid credentials');
  return res.json();
}
```

**Recommended Backend:**
- **Node.js + Express** for REST API
- **MongoDB / AWS DynamoDB** for user and record storage
- **JWT** for session authentication

---

## 🎨 UI Design

- **Theme:** Glassmorphism Aurora Light
- **Background:** Animated mesh gradient with floating blobs
- **Cards:** Frosted glass with backdrop blur
- **Typography:** Playfair Display (headings) + Nunito (body)
- **Animations:** Fade-in page transitions, shimmer skeletons, smooth hover states
- **Responsive:** Adapts to various screen sizes

---

## 📊 Evaluation Criteria Coverage

| Criteria | Implementation |
|---|---|
| Angular framework & libraries | Modular service pattern, component architecture |
| API & cloud framework knowledge | Async API layer, localStorage DB, cloud-ready structure |
| UI design aspects | Glassmorphism, animations, responsive layout |
| Clean code architecture | Separated concerns, reusable components, service layer |
| Creative design | Custom design system, aurora mesh background, glass cards |

---

## 📬 Submission

**Submitted by:** Mugasin M
**Email:** riyasmugasin@gmail.com
---
