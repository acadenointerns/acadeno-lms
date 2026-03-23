import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isBdaArea = user?.role === 'bda' || user?.role === 'super_admin';

  return (
    <div className="dashboard-layout">
      {/* Top Navbar */}
      <nav className="dashboard-nav">
        <div className="nav-brand">ACADENO LMS</div>
        <div className="nav-right">
          <div className="user-info">
            <span style={{ fontWeight: 500 }}>{user?.email}</span>
            <span className="role-badge">{user?.role}</span>
          </div>
          <button onClick={logout} className="btn-primary" style={{ minHeight: '36px', padding: '0 16px', fontSize: '13px', width: 'auto' }}>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div 
            className={`sidebar-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </div>

          {isBdaArea && (
            <>
              <div style={{ margin: '16px 0 8px 16px', fontSize: '11px', fontWeight: 600, color: 'var(--gray-border)', textTransform: 'uppercase' }}>Lead Management</div>
              <div 
                className={`sidebar-item ${location.pathname === '/leads' ? 'active' : ''}`}
                onClick={() => navigate('/leads')}
              >
                All Leads
              </div>
              <div 
                className={`sidebar-item ${location.pathname === '/leads/import' ? 'active' : ''}`}
                onClick={() => navigate('/leads/import')}
              >
                Bulk Import
              </div>
            </>
          )}

          <div style={{ margin: '16px 0 8px 16px', fontSize: '11px', fontWeight: 600, color: 'var(--gray-border)', textTransform: 'uppercase' }}>Learning</div>
          <div className="sidebar-item">Courses</div>
          <div className="sidebar-item">Assignments</div>
          
          {user?.role === 'super_admin' && (
            <>
              <div style={{ margin: '16px 0 8px 16px', fontSize: '11px', fontWeight: 600, color: 'var(--gray-border)', textTransform: 'uppercase' }}>Administration</div>
              <div className="sidebar-item">Users</div>
              <div className="sidebar-item">System Settings</div>
            </>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
