import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  CheckSquare,
  CreditCard,
  PieChart,
  BarChart3,
  Users,
  Building2,
  Briefcase,
  FolderTree,
  ShieldCheck,
  Settings,
  LogOut,
  Wallet
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const mainNavigation = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Expenses', to: '/expenses', icon: Receipt },
  ];

  const workflowNavigation = [
    { name: 'Approvals', to: '/approvals', icon: CheckSquare, badge: '4' },
    { name: 'Reimbursements', to: '/reimbursements', icon: CreditCard },
    { name: 'Budgets', to: '/budgets', icon: PieChart },
    { name: 'Reports', to: '/reports', icon: BarChart3 },
  ];

  const adminNavigation = [
    { name: 'Users', to: '/admin/users', icon: Users },
    { name: 'Departments', to: '/admin/departments', icon: Building2 },
    { name: 'Projects', to: '/admin/projects', icon: Briefcase },
    { name: 'Categories', to: '/admin/categories', icon: FolderTree },
    { name: 'Policies', to: '/admin/policies', icon: ShieldCheck },
  ];

  const linkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.625rem 0.875rem',
    borderRadius: '10px',
    fontSize: '0.875rem',
    fontWeight: isActive ? '600' : '500',
    color: isActive ? '#102522' : '#556569',
    backgroundColor: isActive ? '#e8efe9' : 'transparent',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
  });

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            zIndex: 40,
            display: 'block',
          }}
          className="mobile-backdrop"
        />
      )}

      <aside
        style={{
          width: '255px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e5e2da',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 50,
          flexShrink: 0,
        }}
      >
        {/* Brand header */}
        <NavLink
          to="/dashboard"
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #e5e2da',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #102522 0%, #1e4d44 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(16, 37, 34, 0.25)',
            }}
          >
            <Wallet size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#0f172a' }}>
              ExpenseHub
            </h2>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Enterprise
            </span>
          </div>
        </NavLink>

        {/* Navigation list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.875rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', padding: '0 0.75rem', display: 'block', marginBottom: '0.5rem' }}>
              Overview
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {mainNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.to} to={item.to} style={linkStyle} onClick={() => onClose && onClose()}>
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', padding: '0 0.75rem', display: 'block', marginBottom: '0.5rem' }}>
              Financial Workflow
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {workflowNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.to} to={item.to} style={linkStyle} onClick={() => onClose && onClose()}>
                    <Icon size={18} />
                    <span style={{ flex: 1 }}>{item.name}</span>
                    {item.badge && (
                      <span
                        style={{
                          backgroundColor: '#fef3c7',
                          color: '#d97706',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.1rem 0.45rem',
                          borderRadius: '999px',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', padding: '0 0.75rem', display: 'block', marginBottom: '0.5rem' }}>
              Administration
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {adminNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.to} to={item.to} style={linkStyle} onClick={() => onClose && onClose()}>
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
            <NavLink to="/settings" style={linkStyle} onClick={() => onClose && onClose()}>
              <Settings size={18} />
              <span>Settings</span>
            </NavLink>
          </div>
        </div>

        {/* User profile footer */}
        <div
          style={{
            padding: '1rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
              alt={user?.name || 'User'}
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.name || 'Alex Morgan'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                {user?.role || 'Admin'}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#94a3b8',
              padding: '0.35rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
