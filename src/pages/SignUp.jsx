import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './SignUp.css';
import { authService } from '../services/authService';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validasi basic
    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password harus minimal 6 karakter!' });
      setLoading(false);
      return;
    }

    if (formData.username.length < 3) {
      setMessage({ type: 'error', text: 'Username harus minimal 3 karakter!' });
      setLoading(false);
      return;
    }

    try {
      // Sign up ke Supabase Auth
const { data, error } = await authService.signUp({
  email: formData.email,
  password: formData.password,
  username: formData.username,
});

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({
          type: 'success',
          text: 'Sign up berhasil! Cek email lo buat verifikasi akun.',
        });

        // Reset form
        setFormData({ username: '', email: '', password: '' });

        // Auto redirect ke signin setelah 3 detik
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan. Coba lagi.' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">SIGN UP</h1>
        <p className="auth-subtitle">Join PixelPlay community</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">USERNAME</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              minLength={3}
            />
          </div>

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
              placeholder="Min. 6 characters"
              required
              minLength={6}
            />
          </div>

          {message.text && (
            <div className={`message message-${message.type}`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/signin" className="auth-link">SIGN IN</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;