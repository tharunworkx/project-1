import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useFinanceRole, ROLES } from '@/hooks/useFinanceRole';
import { Shield, ChevronDown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/context/ToastContext';

export const RoleSwitcher = () => {
  const { user } = useAuth();
  const { role, setRole } = useFinanceRole();
  const { toastInfo } = useToast();

  const roleList = [
    {
      name: ROLES.FINANCE_EXECUTIVE,
      label: 'Finance Executive',
      badge: 'Disbursements & Audit',
      userOverride: {
        name: 'Karthik Mohan',
        email: 'karthik.m@company.com',
        department: 'Finance & Accounts',
      },
    },
    {
      name: ROLES.FINANCE_MANAGER,
      label: 'Finance Manager / CFO',
      badge: 'Budgets & Company Analytics',
      userOverride: {
        name: 'Anita Desai',
        email: 'anita.d@company.com',
        department: 'Executive Finance',
      },
    },
    {
      name: ROLES.EMPLOYEE,
      label: 'Employee',
      badge: 'Self Claims & Reports',
      userOverride: {
        name: 'Arun Kumar',
        email: 'arun.kumar@company.com',
        department: 'Engineering',
      },
    },
    {
      name: ROLES.MANAGER,
      label: 'Manager',
      badge: 'Department Approvals',
      userOverride: {
        name: 'Priya Sharma',
        email: 'priya.s@company.com',
        department: 'Marketing',
      },
    },
    {
      name: ROLES.ADMIN,
      label: 'Admin',
      badge: 'Full Enterprise Access',
      userOverride: {
        name: 'Alex Morgan',
        email: 'alex.morgan@company.com',
        department: 'Finance & Operations',
      },
    },
  ];

  const handleSelect = (r) => {
    setRole(r.name);
    toastInfo(`Switched active view to ${r.label} (${r.userOverride.name})`, 'Role Changed');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs rounded-full border-border/80 bg-background/50 hover:bg-muted shadow-2xs font-medium px-2.5"
          title="Switch role perspective to test role-based UI"
        >
          <Shield className="size-3.5 text-primary" />
          <span className="hidden sm:inline text-muted-foreground text-[11px]">Role:</span>
          <span className="font-semibold truncate max-w-28">{role}</span>
          <ChevronDown className="size-3 text-muted-foreground ml-0.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-1.5 shadow-xl">
        <DropdownMenuLabel className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1">
          Simulate Persona (Person 3)
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {roleList.map((r) => {
          const isSelected = role === r.name;
          return (
            <DropdownMenuItem
              key={r.name}
              onClick={() => handleSelect(r)}
              className={`cursor-pointer rounded-lg p-2 flex items-start justify-between ${
                isSelected ? 'bg-primary/10 text-primary font-semibold' : ''
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span>{r.label}</span>
                  {isSelected && <Check className="size-3.5 text-primary" />}
                </div>
                <span className="text-[10px] text-muted-foreground block mt-0.5">
                  {r.badge}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleSwitcher;

