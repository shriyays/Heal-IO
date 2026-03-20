import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import './Navbar.css';

const NAV = [
  { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { to: '/log', icon: '✎', label: 'Daily Log' },
  { to: '/analytics', icon: '◎', label: 'Analytics' },
  { to: '/medications', icon: '⊕', label: 'Medications' },
  { to: '/visits', icon: '♥', label: 'Doctor Visits' },
  { to: '/report', icon: '↓', label: 'Health Report' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '??';

  return (
    <nav className="sb" aria-label="Main navigation">
      <div className="sb-top">
        <Logo />
        <div className="logo-sub">Personal health journal</div>
      </div>

      <div className="nav">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} className={({ isActive }) => `ni${isActive ? ' on' : ''}`}>
            <span className="ni-ic" aria-hidden="true">
              {n.icon}
            </span>
            {n.label}
          </NavLink>
        ))}
      </div>

      {user && (
        <div className="sb-foot">
          <div className="av" aria-hidden="true">
            {initials}
          </div>
          <div>
            <div className="sb-foot-name">{user.name}</div>
            <button className="btn-logout" onClick={handleLogout} type="button">
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
