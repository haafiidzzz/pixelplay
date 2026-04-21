import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <ul className="navbar-menu">
          <li><Link to="/">HOME</Link></li>
          <li><Link to="/leaderboard">LEADERBOARD</Link></li>
          <li><Link to="/achievements">ACHIEVEMENTS</Link></li>
        </ul>
      </div>

      <div className="navbar-right">
        <div className="search-box">
          <input type="text" placeholder="" />
          <svg
            className="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {user ? (
          <div className="user-section">
            <span className="user-greeting">
              Hi, {profile?.username || user.email.split('@')[0]}
            </span>
            <button onClick={handleSignOut} className="signout-btn">
              SIGN OUT
            </button>
          </div>
        ) : (
          <Link to="/signin" className="signin-btn">SIGN IN</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;