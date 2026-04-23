import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import './SignUp.css';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const { data, error } = await authService.signIn(formData);

    if (error) {
      setMessage({
        type: 'error',
        text: error.message === 'Invalid login credentials'
          ? 'Email atau password salah!'
          : error.message,
      });
      setLoading(false);
    } else {
      setMessage({ type: 'success', text: 'Login berhasil! Redirecting...' });
      // Redirect ke home setelah 1 detik
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">SIGN IN</h1>
        <p className="auth-subtitle">Welcome back to PixelPlay</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">EMAIL</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">PASSWORD</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {message.text && (
            <div className={`message message-${message.type}`}>
              {message.text}
            </div>
          )}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
        

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">SIGN UP</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;