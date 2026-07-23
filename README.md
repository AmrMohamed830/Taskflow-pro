# TaskFlow Pro 🚀
### Premium Task & Workspace Management Application

TaskFlow Pro is a state-of-the-art, high-performance task management application designed for modern teams. Built with a focus on premium user experience, vibrant aesthetics, and instantaneous UI response times.

## 👥 Live Demo Credentials

You can test the application instantly using these demo accounts:

| Role | Email Address | Password |
| :--- | :--- | :--- |
| **Admin** | `amr25953473@gmail.com` | `123456` |
| **User** | `ahmed2553473@gmail.com` | `123456` |

### 📊 Feature Access Comparison

Here is a quick overview of what each role can access and manage:

| Feature | Admin | User |
| :--- | :---: | :---: |
| **Dashboard** | ✅ | ✅ |
| **Kanban Board** | ✅ | ✅ |
| **Create Task** | ✅ | ❌ |
| **Assign Users** | ✅ | ❌ |
| **Manage Users** | ✅ | ❌ |
| **Change Roles** | ✅ | ❌ |
| **Edit Own Tasks** | ✅ | ✅ |
| **Comments** | ✅ | ✅ |

---

## ✨ Key Features

### 📋 Interactive Kanban Board
- **Dynamic Columns:** Drag-and-drop tasks between "To Do", "In Progress", and "Done" states with fluid transitions.
- **Role-based Task Assignment:** Admins can quickly assign/reassign members to tasks with custom confirmation flows.
- **Subtasks & Progress:** Manage checklist items for each task with real-time progress indicators.
- **Interactive Comments:** Keep the team aligned with direct comment threads on tasks.

### 👥 User & Permission Management (Admin Only)
- **User Dashboard:** Comprehensive control panel to create new users, update user info, or remove workspace members.
- **Role Control:** Easily toggle permissions and roles (Admin/User) to manage workspace authorities.
- **Secure Redirection:** Built-in client-side and server-side route guarding to prevent unauthorized access.

### ⚡ Instantaneous Performance (Optimistic Updates)
- High-efficiency caching using **React Query** ensures checklist updates, task reassignments, user modifications, and notification deletions update **instantly** without waiting for network responses.

### 📄 Advanced Pagination Controls
- Reusable custom `<Pagination>` component supporting:
  - Custom page size dropdown options (5, 10, 20, 30, etc.)
  - Numerical pages with ellipses (`...`) for large sets.
  - Interactive "Showing X–Y of Z items" description.

### 🌗 Premium Aesthetics & Theme Control
- Curated dark and light mode themes with smooth transitions.
- Glassmorphism UI details, vibrant HSL tailored color schemes, and subtle micro-animations.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js (App Router, Turbopack)
- **State Management:** Zustand
- **Server Cache & Sync:** React Query (TanStack Query)
- **Authentication:** NextAuth.js (Google, GitHub, Credentials)
- **Styling:** TailwindCSS & CSS Variables
- **Icons & Alerts:** Lucide React & Sonner (Toasts)
- **Forms:** React Hook Form & Zod Resolvers

### Backend
- **Framework:** Node.js & Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JWT Authentication & bcrypt
- **Middleware:** CORS, Express Validator, Morgan Logger

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18.x or higher recommended).

### 1. Clone & Set Up Backend
1. Open the backend directory:
   ```bash
   cd ../back-end
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Set up your MongoDB URI, JWT Secret, and port settings inside `.env`.
5. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Set Up Frontend (Taskflow-pro)
1. Navigate to the frontend directory:
   ```bash
   cd ../Taskflow-pro
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Add your API URL, NextAuth secrets, Google/GitHub OAuth IDs, and Secrets.
5. Start the Next.js development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📂 Project Structure

```
Taskflow-pro/
├── app/                  # Next.js App Router (pages & layouts)
├── components/           # Reusable UI & Layout Components
│   ├── dashboard/        # Kanban board, User table, Settings view
│   ├── home/             # Homepage navigation & landing views
│   └── ui/               # Custom buttons, inputs, select-menus, pagination
├── lib/                  # Application utilities & state store
│   ├── api/              # Axios API endpoint declarations
│   ├── hooks/            # Structured React Query hooks (optimistic updates)
│   ├── store/            # Zustand global stores (auth, filters, UI)
│   └── types/            # Strict TypeScript interfaces
└── public/               # Static assets & public images
```
