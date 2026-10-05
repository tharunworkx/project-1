import React, { useState } from 'react';
import { Plus, Search, UserCheck, Shield, Mail, Edit2, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

const mockUsers = [
  {
    id: 'usr_001',
    name: 'Alex Morgan',
    email: 'alex.morgan@company.com',
    role: 'Admin',
    department: 'Finance & Operations',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
  },
  {
    id: 'usr_002',
    name: 'David Kim',
    email: 'david.kim@company.com',
    role: 'Employee',
    department: 'Engineering',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
  },
  {
    id: 'usr_003',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@company.com',
    role: 'Manager',
    department: 'Engineering',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
  },
  {
    id: 'usr_004',
    name: 'Michael Brown',
    email: 'michael.brown@company.com',
    role: 'Employee',
    department: 'Sales',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
  },
  {
    id: 'usr_005',
    name: 'Emily Stone',
    email: 'emily.stone@company.com',
    role: 'Finance Admin',
    department: 'Finance',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120',
  },
];

export const Users = () => {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Employee',
    department: 'Engineering',
  });

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddUser = (e) => {
    e.preventDefault();
    const newUser = {
      id: `usr_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      status: 'Active',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.name)}`,
    };
    setUsers([...users, newUser]);
    setModalOpen(false);
    setFormData({ name: '', email: '', role: 'Employee', department: 'Engineering' });
  };

  const getRoleVariant = (role) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'purple';
      case 'manager': return 'info';
      case 'finance admin': return 'success';
      default: return 'neutral';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            User Management
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Manage staff credentials, assigned roles, and departmental permissions.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={() => setModalOpen(true)}>
          Invite New User
        </Button>
      </div>

      <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', maxWidth: '320px', backgroundColor: '#f8fafc', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search users by name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.8125rem' }}
          />
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>User / Name</th>
                <th>Work Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={u.avatar} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#475569' }}>{u.email}</td>
                  <td>
                    <Badge variant={getRoleVariant(u.role)}>
                      {u.role}
                    </Badge>
                  </td>
                  <td style={{ color: '#334155' }}>{u.department}</td>
                  <td>
                    <Badge variant="success" dot>
                      {u.status}
                    </Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
                      <Button variant="ghost" size="sm" icon={Edit2} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Invite Team Member">
        <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              placeholder="e.g. Rachel Adams"
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Work Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
              placeholder="rachel@company.com"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="form-select"
              >
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
                <option value="Finance Admin">Finance Admin</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="form-select"
              >
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Product">Product</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="secondary" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
