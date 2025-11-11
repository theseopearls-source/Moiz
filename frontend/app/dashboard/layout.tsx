'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await api.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await api.logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
    { path: '/dashboard/patients', label: 'Patients', icon: '👥', roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
    { path: '/dashboard/appointments', label: 'Appointments', icon: '📅', roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
    { path: '/dashboard/billing', label: 'Billing', icon: '💰', roles: ['admin', 'receptionist'] },
    { path: '/dashboard/pharmacy', label: 'Pharmacy', icon: '💊', roles: ['admin', 'doctor', 'nurse'] },
    { path: '/dashboard/prescriptions', label: 'Prescriptions', icon: '📋', roles: ['admin', 'doctor', 'nurse'] },
    { path: '/dashboard/reports', label: 'Reports', icon: '📈', roles: ['admin', 'doctor'] },
    { path: '/dashboard/users', label: 'Users', icon: '👤', roles: ['admin'] },
    { path: '/dashboard/settings', label: 'Settings', icon: '⚙️', roles: ['admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">🏥 HMS</div>
          <div className="sidebar-subtitle">Hospital Management</div>
        </div>
        <nav className="sidebar-nav">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <div className="topbar-title">Hospital Management System</div>
          <div className="topbar-actions">
            <div className="user-info">
              <div className="user-avatar">
                {user.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="user-details">
                <div className="user-name">{user.full_name}</div>
                <div className="user-role">{user.role}</div>
              </div>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary btn-small">
              Logout
            </button>
          </div>
        </div>

        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
}
