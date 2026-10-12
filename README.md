# 💳 Enterprise Expense Management System (EMS)

A comprehensive, full-stack enterprise platform for corporate expense reporting, automated multi-tier approval workflows, budget tracking, financial analytics, fraud detection, and reimbursement processing.

---

## 🌟 Key Features

### 1. 📊 Executive Dashboard & Real-Time Analytics
- **Live Financial KPIs**: Real-time total expenses, pending approvals, approved disbursements, and budget burn rate.
- **Visual Analytics**: Interactive spend trends, category distributions, and department breakdowns powered by Recharts.
- **Instant Synchronization**: Cross-tab and live database updates via `BroadcastChannel` and event subscriptions.

### 2. 🧾 Expense Claims & Mandatory Proof Upload
- **Intuitive Modal Submission**: Fast claim entry with merchant, purpose, category, department, and project cost code.
- **Mandatory Receipt Upload**: Drag-and-drop receipt/proof document uploader with strict validation supporting PNG, JPG, WEBP, and PDF up to 10MB.
- **Draft & Resumption**: Save partially completed expense forms as drafts for later submission.

### 3. 🛡️ Multi-Level Approval Queue
- **Role-Based Workflows**: Dedicated approval queue for Managers, Finance Executives, and Admins.
- **Policy Flag Detection**: Instant warning flags for out-of-policy claims (e.g., flight class exceptions, meal threshold breaches).
- **Batch Processing**: Quick one-click single approvals or batch sign-offs with audit notes.

### 4. 💸 Reimbursements & Treasury Rails
- **Payment Processing**: Track claims across `Pending`, `Approved`, `Processing`, and `Reimbursed` states.
- **Payment Modes**: Seamless disbursement tracking across Corporate Cards, Bank Wire Transfer, and UPI.
- **Batch Settlement**: Filter by date range, department, or disbursement method.

### 5. 📑 Financial Analytics & Statement Reports
- **Finance Analytics**: Executive drill-down charts, department burn-rate graphs, and monthly run-rates.
- **Financial Reports**: Custom date-range statement generator with exportable CSV and printable PDF summaries.

### 6. 📁 Organization & Policy Configuration
- **Organization Hierarchy**: Manage Users & Teams, Departments, and Projects within the unified inline sidebar.
- **Policy & Category Rules**: Define per-category limits, approval thresholds, and strict compliance triggers.

### 7. 🔍 Audit Trail & Fraud Detection
- **Fraud Detection Engine**: Flags duplicate invoices, excessive weekend transactions, and rapid frequency submissions.
- **Immutable Audit Trail**: Chronological event logs tracking every creation, review, rejection, and role modification.

### 8. 🔔 Real-Time Notification Center
- **Live Notification Bell**: Immediate indicator badge and audio-free visual updates for approvals, new claims, and account requests.
- **Cross-Component Reactivity**: Sub-millisecond UI state synchronization without requiring page refreshes.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), [shadcn/ui](https://ui.shadcn.com/), Lucide Icons
- **Visualizations**: [Recharts](https://recharts.org/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Real-Time Layer**: HTML5 `BroadcastChannel` API, Custom Event Bus, and Supabase Realtime Channels
- **Deployment**: [Vercel](https://vercel.com/) with SPA rewrite configuration

### **Backend**
- **Framework**: [Spring Boot 4](https://spring.io/projects/spring-boot) (Java 17)
- **Security**: Spring Security + JWT (JSON Web Tokens)
- **Persistence**: Spring Data JPA / Hibernate
- **Database**: PostgreSQL / Supabase
- **API Documentation**: OpenAPI / Swagger UI
- **Build Tool**: Maven (`mvnw`)

---

## 📁 Repository Structure

```
project-1/
├── backend/                              # Spring Boot REST API
│   ├── src/main/java/com/expensemanagement/
│   │   ├── config/                       # Security & Web configuration
│   │   ├── controller/                   # REST API Controllers
│   │   ├── model/                        # JPA Entities (User, Expense, etc.)
│   │   ├── repository/                   # Spring Data JPA Repositories
│   │   └── service/                      # Business Logic Services
│   ├── src/main/resources/
│   │   ├── application.properties        # Main Spring Boot properties
│   │   └── application-local.properties  # Local profile properties
│   └── pom.xml                           # Maven dependencies
├── frontend/                             # React + Vite Frontend
│   ├── public/                           # Static assets, vector favicons
│   ├── src/
│   │   ├── components/                   # UI components, layout, navigation
│   │   ├── context/                      # Auth, Theme, and Toast Contexts
│   │   ├── pages/                        # Views (Dashboard, Expenses, Approvals, etc.)
│   │   ├── routes/                       # AppRoutes & protected role routes
│   │   ├── services/                     # API client, reactive expense store, mocks
│   │   └── utils/                        # Image compressors, formatters
│   ├── vercel.json                       # Vercel SPA client rewrite rules
│   └── vite.config.js                    # Vite bundler configuration
├── vercel.json                           # Root Vercel monorepo deployment config
└── README.md                             # Project Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Java JDK**: 17 or higher
- **PostgreSQL**: (or a cloud PostgreSQL instance such as Supabase)

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Configure database credentials in `backend/src/main/resources/application.properties` or `application-local.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/expense_db
   spring.datasource.username=postgres
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   ```

3. Run the Spring Boot server:
   - **Windows**:
     ```powershell
     .\mvnw.cmd spring-boot:run
     ```
   - **Linux / macOS**:
     ```bash
     ./mvnw spring-boot:run
     ```
   The backend API will start on `http://localhost:8080`. Swagger documentation is accessible at `http://localhost:8080/swagger-ui.html`.

---

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional, fallback defaults are already set):
   Create a `.env` file in `frontend/`:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. Validate the production build:
   ```bash
   npm run build
   ```

---

## ☁️ Deployment on Vercel

The application is pre-configured for seamless single-click deployment to [Vercel](https://vercel.com/):

### Option A: Standard Deployment (Root Directory = `frontend`)
1. Import this repository in Vercel.
2. In Project Settings, set **Root Directory** to `frontend`.
3. Vercel automatically detects Vite and utilizes `frontend/vercel.json` for SPA routing.

### Option B: Monorepo Deployment (Repository Root)
1. Import this repository with **Root Directory** set to `./`.
2. The root [`vercel.json`](./vercel.json) automatically directs the build:
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
   - SPA Rewrites: All routes redirect to `/index.html` preventing 404 on page refresh.

---

## 👥 Role-Based Access Control (RBAC)

| Role | Submit Claims | Approvals Queue | Budgets & Analytics | Organization Admin | Audit Trail |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Employee** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Manager** | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Finance Executive** | ✅ | ✅ | ✅ | ❌ | ✅ |
| **CFO / Head of Finance** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Administrator** | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 📄 License

This project is licensed under the MIT License.