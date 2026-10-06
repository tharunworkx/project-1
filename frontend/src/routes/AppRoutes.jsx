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
import ApprovalQueue from "../pages/approvals/ApprovalQueue";
import Reimbursements from "../pages/reimbursements/Reimbursements";
import Budgets from "../pages/budgets/Budgets";
import Reports from "../pages/reports/Reports";
import Settings from "../pages/settings/Settings";
import Users from "../pages/administration/Users";
import Departments from "../pages/administration/Departments";
import Projects from "../pages/administration/Projects";
import Categories from "../pages/administration/Categories";
import Policies from "../pages/administration/Policies";
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

          {/* Workflow */}
          <Route path="/approvals" element={<ApprovalQueue />} />
          <Route path="/reimbursements" element={<Reimbursements />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/analytics" element={<Reports />} />

          {/* Administration */}
          <Route path="/admin/users" element={<Users />} />
          <Route path="/users" element={<Navigate to="/admin/users" replace />} />

          <Route path="/admin/departments" element={<Departments />} />
          <Route path="/departments" element={<Navigate to="/admin/departments" replace />} />

          <Route path="/admin/projects" element={<Projects />} />
          <Route path="/projects" element={<Navigate to="/admin/projects" replace />} />

          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/categories" element={<Navigate to="/admin/categories" replace />} />

          <Route path="/admin/policies" element={<Policies />} />
          <Route path="/policies" element={<Navigate to="/admin/policies" replace />} />

          {/* Settings */}
          <Route path="/settings" element={<Settings />} />

          {/* Fallback to Dashboard for any other route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}