import { useAuth } from '../context/AuthContext';

export const ROLES = {
  FINANCE_EXECUTIVE: 'Finance Executive',
  FINANCE_MANAGER: 'Finance Manager / CFO',
  EMPLOYEE: 'Employee',
  MANAGER: 'Manager',
  ADMIN: 'Admin',
};

export function useFinanceRole() {
  const { user, updateUser } = useAuth();
  const currentRole = user?.role || ROLES.EMPLOYEE;
  const roleLower = currentRole.toLowerCase();

  const isAdmin = roleLower === 'admin';
  const isFinanceExecutive =
    roleLower.includes('finance exec') ||
    roleLower === 'finance admin' ||
    roleLower === 'finance' ||
    isAdmin;
  const isFinanceManager =
    roleLower.includes('cfo') ||
    roleLower.includes('finance manager') ||
    roleLower.includes('head of finance') ||
    isAdmin;
  const isCFO = isFinanceManager;
  const isManager = roleLower.includes('manager') || isFinanceManager || isAdmin;
  const isEmployee = roleLower.includes('employee') && !isFinanceExecutive && !isFinanceManager && !isAdmin;

  // Permissions according to Person 3 specification
  const canDisburse = isFinanceExecutive || isFinanceManager || isAdmin;
  const canManageBudgets = isFinanceManager || isCFO || isAdmin;
  const canViewCompanyAnalytics = isFinanceManager || isFinanceExecutive || isCFO || isAdmin;
  const canManageReimbursements = isFinanceExecutive || isFinanceManager || isAdmin;
  const canGenerateAllReports = isFinanceManager || isFinanceExecutive || isAdmin;
  const canTakeFinanceActions = isFinanceExecutive || isFinanceManager || isAdmin;

  // Employee restricted to only their own records
  const isRestrictedToOwn = isEmployee;

  const setRole = (newRole) => {
    if (updateUser) {
      updateUser({ role: newRole });
    }
  };

  return {
    role: currentRole,
    isAdmin,
    isFinanceExecutive,
    isFinanceManager,
    isCFO,
    isManager,
    isEmployee,
    canDisburse,
    canManageBudgets,
    canViewCompanyAnalytics,
    canManageReimbursements,
    canGenerateAllReports,
    canTakeFinanceActions,
    isRestrictedToOwn,
    setRole,
  };
}

export default useFinanceRole;

