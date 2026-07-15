import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import './Layout.css';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="layout">
      <nav className="layout__nav" aria-label="Main navigation">
        <div className="layout__logo">
          <h2>TMS</h2>
        </div>
        <ul className="layout__links">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'} end>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/tickets" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
              Tickets
            </NavLink>
          </li>
          <li>
            <NavLink to="/kanban" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
              Kanban
            </NavLink>
          </li>
          {user?.role === 'admin' && (
            <>
              <li>
                <NavLink to="/users" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
                  Users
                </NavLink>
              </li>
              <li>
                <NavLink to="/roles" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
                  Roles
                </NavLink>
              </li>
            </>
          )}
        </ul>

        <div className="layout__user-menu" ref={menuRef}>
          <button
            className="layout__user-button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-haspopup="true"
            aria-label="User menu"
          >
            <span className="layout__user-avatar">
              {user?.name?.charAt(0).toUpperCase() || '?'}
            </span>
            <span className="layout__user-name">{user?.name || 'User'}</span>
          </button>

          {menuOpen && (
            <div className="layout__dropdown" role="menu">
              <button
                className="layout__dropdown-item"
                role="menuitem"
                onClick={() => { setMenuOpen(false); navigate('/profile'); }}
              >
                Update Profile
              </button>
              <button
                className="layout__dropdown-item layout__dropdown-item--danger"
                role="menuitem"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
};
