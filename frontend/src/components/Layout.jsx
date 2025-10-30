import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore.js';

const Layout = () => {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/" className="brand">
          Task Manager
        </Link>
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Dashboard
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Tasks
          </NavLink>
          <NavLink to="/tasks/new" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            New Task
          </NavLink>
        </nav>
        <div className="user-info">
          <span className="user-name">{user?.name}</span>
          <button className="secondary-button" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
