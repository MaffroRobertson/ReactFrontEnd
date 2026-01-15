import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ isCollapsed, onToggle }) {
  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2>Navigation</h2>
        <button
          type="button"
          className="sidebar-toggle"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={onToggle}
        >
          {isCollapsed ? '‹' : '‹'}
        </button>
      </div>
      <nav className="sidebar-nav">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          end
        >
          <span className="nav-icon">🏠</span>
          <span>Home</span>
        </NavLink>
        <NavLink 
          to="/about" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          <span className="nav-icon">👤</span>
          <span>About Me</span>
        </NavLink>
        <NavLink 
          to="/diving" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          <span className="nav-icon">🤿</span>
          <span>Diving</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
