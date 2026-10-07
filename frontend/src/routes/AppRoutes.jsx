import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import Expenses from "../pages/expenses/Expenses";
import CreateExpense from "../pages/expenses/CreateExpense";
import ExpenseDetails from "../pages/expenses/ExpenseDetails";
import Receipts from "../pages/receipts/Receipts";
import ApprovalQueue from "../pages/approvals/ApprovalQueue";
import Reimbursements from "../pages/reimbursements/Reimbursements";
import Budgets from "../pages/budgets/Budgets";
import Reports from "../pages/reports/Reports";
import FinanceDashboard from "../pages/finance/FinanceDashboard";
import Notifications from "../pages/notifications/Notifications";
import Settings from "../pages/settings/Settings";
import Users from "../pages/administration/Users";
import Departments from "../pages/administration/Departments";
import Projects from "../pages/administration/Projects";
import Categories from "../pages/administration/Categories";
import Policies from "../pages/administration/Policies";
import AuditTrail from "../pages/audit/AuditTrail";
import FraudDetection from "../pages/fraud/FraudDetection";
import Integrations from "../pages/integrations/Integrations";
import Monitoring from "../pages/monitoring/Monitoring";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function RoleRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const roleName = user?.role || "Employee";
  const roleLower = roleName.toLowerCase();
  const isAdmin = roleLower === "admin";
  if (isAdmin) return children;

  const isCFO =
    roleLower.includes("cfo") ||
    roleLower.includes("finance manager") ||
    roleLower.includes("head of finance");
  const isFinanceExec =
    roleLower.includes("finance exec") ||
    roleLower === "finance admin" ||
    roleLower === "finance";
  const isFinanceTeam = isFinanceExec || isCFO;
  const isManager = roleLower.includes("manager") || isCFO;

  const hasAccess = allowedRoles.some((roleKey) => {
    if (roleKey === "admin") return isAdmin;
    if (roleKey === "cfo") return isCFO;
    if (roleKey === "finance_team") return isFinanceTeam;
    if (roleKey === "manager") return isManager;
    return roleLower.includes(roleKey.toLowerCase());
  });

  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes (standalone, outside MainLayout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Application routes wrapped with MainLayout and ProtectedRoute */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Expenses */}
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/expenses/new" element={<CreateExpense />} />
          <Route path="/expenses/:id" element={<ExpenseDetails />} />
          <Route path="/receipts" element={<Receipts />} />

          {/* Approvals (Manager, Finance, Admin) */}
          <Route
            path="/approvals"
            element={
              <RoleRoute allowedRoles={["manager", "finance_team"]}>
                <ApprovalQueue />
              </RoleRoute>
            }
          />

          {/* Reimbursements (Available to all roles; claims filtered by persona) */}
          <Route path="/reimbursements" element={<Reimbursements />} />
          <Route path="/finance/reimbursements" element={<Reimbursements />} />

          {/* Budgets (Manager, Finance, Admin) */}
          <Route
            path="/budgets"
            element={
              <RoleRoute allowedRoles={["manager", "finance_team"]}>
                <Budgets />
              </RoleRoute>
            }
          />
          <Route
            path="/finance/budgets"
            element={
              <RoleRoute allowedRoles={["manager", "finance_team"]}>
                <Budgets />
              </RoleRoute>
            }
          />

          {/* Reports (Manager, Finance, Admin) */}
          <Route
            path="/reports"
            element={
              <RoleRoute allowedRoles={["manager", "finance_team"]}>
                <Reports />
              </RoleRoute>
            }
          />
          <Route
            path="/finance/reports"
            element={
              <RoleRoute allowedRoles={["manager", "finance_team"]}>
                <Reports />
              </RoleRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <RoleRoute allowedRoles={["manager", "finance_team"]}>
                <Reports />
              </RoleRoute>
            }
          />

          {/* Finance Hub & Financial Analytics (Finance Executive, CFO, Admin) */}
          <Route
            path="/finance"
            element={
              <RoleRoute allowedRoles={["finance_team"]}>
                <FinanceDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/finance/analytics"
            element={
              <RoleRoute allowedRoles={["finance_team"]}>
                <FinanceDashboard />
              </RoleRoute>
            }
          />

          {/* Notification Center */}
          <Route path="/notifications" element={<Notifications />} />

          {/* Administration: Users & Departments (Admin only) */}
          <Route
            path="/admin/users"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <Users />
              </RoleRoute>
            }
          />
          <Route path="/users" element={<Navigate to="/admin/users" replace />} />

          <Route
            path="/admin/departments"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <Departments />
              </RoleRoute>
            }
          />
          <Route path="/departments" element={<Navigate to="/admin/departments" replace />} />

          {/* Projects (Manager, Admin) */}
          <Route
            path="/admin/projects"
            element={
              <RoleRoute allowedRoles={["manager", "admin"]}>
                <Projects />
              </RoleRoute>
            }
          />
          <Route path="/projects" element={<Navigate to="/admin/projects" replace />} />

          {/* Policies & Categories (CFO, Admin) */}
          <Route
            path="/admin/categories"
            element={
              <RoleRoute allowedRoles={["cfo", "admin"]}>
                <Categories />
              </RoleRoute>
            }
          />
          <Route path="/categories" element={<Navigate to="/admin/categories" replace />} />

          <Route
            path="/admin/policies"
            element={
              <RoleRoute allowedRoles={["cfo", "admin"]}>
                <Policies />
              </RoleRoute>
            }
          />
          <Route path="/policies" element={<Navigate to="/admin/policies" replace />} />

          {/* Risk, Security & Compliance */}
          <Route
            path="/fraud-detection"
            element={
              <RoleRoute allowedRoles={["cfo", "admin"]}>
                <FraudDetection />
              </RoleRoute>
            }
          />
          <Route path="/admin/fraud" element={<Navigate to="/fraud-detection" replace />} />

          <Route
            path="/audit"
            element={
              <RoleRoute allowedRoles={["finance_team"]}>
                <AuditTrail />
              </RoleRoute>
            }
          />
          <Route path="/admin/audit" element={<Navigate to="/audit" replace />} />
          <Route path="/admin/audit-trail" element={<Navigate to="/audit" replace />} />

          {/* Integrations (Admin only) */}
          <Route
            path="/integrations"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <Integrations />
              </RoleRoute>
            }
          />
          <Route path="/admin/integrations" element={<Navigate to="/integrations" replace />} />

          {/* Application Monitoring (CFO, Admin) */}
          <Route
            path="/monitoring"
            element={
              <RoleRoute allowedRoles={["cfo", "admin"]}>
                <Monitoring />
              </RoleRoute>
            }
          />
          <Route path="/admin/monitoring" element={<Navigate to="/monitoring" replace />} />

          {/* Settings */}
          <Route path="/settings" element={<Settings />} />

          {/* Fallback to Dashboard for any other route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}