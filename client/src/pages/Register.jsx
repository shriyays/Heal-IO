import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WaveBackground from '../components/WaveBackground';
import Logo from '../components/Logo';
import './Register.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="auth-page">
      <WaveBackground />
      <div className="auth-card">
        <div style={{ marginBottom: 20 }}>
          <Logo />
        </div>
        <h2>Create account</h2>
        <p className="sub">Start tracking your health today</p>

        {error && <div className="toast error" role="alert" style={{ marginBottom: 14 }}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="lbl" htmlFor="reg-name">Full Name</label>
            <input id="reg-name" className="inp" type="text" placeholder="Sara Johnson" value={form.name} onChange={set('name')} required />
          </div>
          <div>
            <label className="lbl" htmlFor="reg-email">Email</label>
            <input id="reg-email" className="inp" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
          </div>
          <div>
            <label className="lbl" htmlFor="reg-password">Password</label>
            <input id="reg-password" className="inp" type="password" placeholder="Min 8 characters" value={form.password} onChange={set('password')} required />
          </div>
          <div>
            <label className="lbl" htmlFor="reg-confirm">Confirm Password</label>
            <input id="reg-confirm" className="inp" type="password" placeholder="Re-enter password" value={form.confirm} onChange={set('confirm')} required />
          </div>
          <button className="btn-full" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
