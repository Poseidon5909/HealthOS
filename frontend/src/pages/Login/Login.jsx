import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import authService from '../../services/authService';
import { BrandMark } from '../../components/ui';
import { isValidEmail, parseErrorMessage } from '../../utils/validation';

function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const errorType = queryParams.get('error');

    if (errorType === 'google_auth_failed') {
      setError('Google sign-in failed. Please try again.');
      window.history.replaceState({}, '', '/login');
      return;
    }

    const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const provider = hashParams.get('provider');

    if (provider === 'google' && accessToken && refreshToken) {
      const finalizeGoogleLogin = async () => {
        setIsLoading(true);
        setError('');
        try {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          const userData = await authService.getCurrentUser();
          setAuth(userData, accessToken, refreshToken);
          toast.success('Signed in with Google successfully.');
          window.history.replaceState({}, '', '/login');
          navigate('/dashboard', { replace: true });
        } catch (err) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setError(parseErrorMessage(err));
          setIsLoading(false);
          window.history.replaceState({}, '', '/login');
        }
      };

      finalizeGoogleLogin();
    }
  }, [navigate, setAuth]);

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google/login`;
  };

  const pageStyles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      background: '#f8fafc',
    },
    hero: {
      flex: 1,
      background: 'linear-gradient(145deg, #1d4ed8 0%, #4f46e5 48%, #7c3aed 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    heroContent: {
      position: 'relative',
      zIndex: 2,
      textAlign: 'center',
      color: '#fff',
      padding: '0 40px',
    },
    panel: {
      width: 500,
      flexShrink: 0,
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 48px',
      overflowY: 'auto',
      boxShadow: '-24px 0 60px rgba(15, 23, 42, 0.06)',
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!formData.password) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login(formData.email, formData.password);
      const { access_token, refresh_token } = response;
      localStorage.setItem('accessToken', access_token);
      const userData = await authService.getCurrentUser();
      setAuth(userData, access_token, refresh_token);
      setIsSuccess(true);
      toast.success('Login successful. Welcome back!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(parseErrorMessage(err));
      setIsLoading(false);
    }
  };

  return (
    <div style={pageStyles.container}>

      <div
        className="login-hero-panel"
        style={pageStyles.hero}
      >
        {[
          { w: 380, top: -100, left: -100, delay: '0s' },
          { w: 260, bottom: 40, right: -70, delay: '2s' },
          { w: 180, top: '40%', left: '8%', delay: '4s' },
        ].map((b, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: b.w,
              height: b.w,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)',
              filter: 'blur(40px)',
              top: b.top,
              left: b.left,
              bottom: b.bottom,
              right: b.right,
              animation: `pulse 7s ease-in-out ${b.delay} infinite`,
            }}
          />
        ))}

        <div style={pageStyles.heroContent}>
          <BrandMark
            subtitle="Track every meal. Every rep. Every goal."
            containerStyle={{
              flexDirection: 'column',
              gap: 0,
            }}
            titleStyle={{
              marginTop: 24,
              textAlign: 'center',
            }}
            subtitleStyle={{
              maxWidth: 320,
              textAlign: 'center',
            }}
          />
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.9; }
          }

          @media (max-width: 980px) {
            .login-hero-panel {
              display: none;
            }

            .login-form-panel {
              width: 100% !important;
              min-height: 100vh;
              padding: 40px 24px !important;
              box-shadow: none !important;
            }
          }
        `}</style>
      </div>

      <div
        className="login-form-panel"
        style={pageStyles.panel}
      >
        <div style={{ width: '100%', maxWidth: 380 }}>

          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 24, letterSpacing: -0.5 }}>
            Member Login
          </h2>

          {error && (
            <div style={{
              marginBottom: 16,
              padding: '12px 14px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 10,
            }}>
              <p style={{ fontSize: 13, color: '#b91c1c', fontWeight: 500 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              disabled={isLoading || isSuccess}
              style={{
                display: 'block',
                width: '100%',
                height: 56,
                padding: '0 16px',
                fontSize: 15,
                background: '#f1f5f9',
                border: '1.5px solid transparent',
                borderRadius: 12,
                color: '#0f172a',
                outline: 'none',
                marginBottom: 12,
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                opacity: isLoading || isSuccess ? 0.6 : 1,
              }}
              onFocus={e => {
                e.target.style.background = '#fff';
                e.target.style.borderColor = '#1a56db';
                e.target.style.boxShadow = '0 0 0 3px rgba(26,86,219,0.1)';
              }}
              onBlur={e => {
                e.target.style.background = '#f1f5f9';
                e.target.style.borderColor = 'transparent';
                e.target.style.boxShadow = 'none';
              }}
            />

            <div style={{ position: 'relative', marginBottom: 8 }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                disabled={isLoading || isSuccess}
                style={{
                  display: 'block',
                  width: '100%',
                  height: 56,
                  padding: '0 48px 0 16px',
                  fontSize: 15,
                  background: '#f1f5f9',
                  border: '1.5px solid transparent',
                  borderRadius: 12,
                  color: '#0f172a',
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  opacity: isLoading || isSuccess ? 0.6 : 1,
                }}
                onFocus={e => {
                  e.target.style.background = '#fff';
                  e.target.style.borderColor = '#1a56db';
                  e.target.style.boxShadow = '0 0 0 3px rgba(26,86,219,0.1)';
                }}
                onBlur={e => {
                  e.target.style.background = '#f1f5f9';
                  e.target.style.borderColor = 'transparent';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                style={{
                  position: 'absolute', right: 14, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#94a3b8', padding: 0, display: 'flex',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div style={{ textAlign: 'right', marginBottom: 20 }}>
              <button type="button" style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#1a56db', fontSize: 13, fontWeight: 600,
                fontFamily: 'inherit',
              }}>
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || isSuccess}
              style={{
                width: '100%', height: 56,
                background: isSuccess ? '#10b981' : '#1a56db',
                color: '#fff', border: 'none',
                borderRadius: 12, fontSize: 16, fontWeight: 700,
                cursor: isLoading || isSuccess ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, opacity: isLoading ? 0.8 : 1,
                marginBottom: 20,
              }}
              onMouseEnter={e => {
                if (!isLoading && !isSuccess) {
                  e.target.style.background = '#1648c0';
                  e.target.style.boxShadow = '0 6px 20px rgba(26,86,219,0.3)';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={e => {
                e.target.style.background = isSuccess ? '#10b981' : '#1a56db';
                e.target.style.boxShadow = 'none';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {isSuccess ? 'Welcome back!' : isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading || isSuccess}
            style={{
              width: '100%', height: 54,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              background: '#fff', border: '1.5px solid #e2e8f0',
              borderRadius: 12, fontSize: 15, fontWeight: 700,
              color: '#334155', cursor: isLoading || isSuccess ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              marginBottom: 20, transition: 'all 0.2s',
              opacity: isLoading || isSuccess ? 0.7 : 1,
            }}
            onMouseEnter={e => {
              if (isLoading || isSuccess) return;
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b', marginBottom: 12 }}>
            Not a member yet?{' '}
            <Link to="/register" style={{ color: '#1a56db', fontWeight: 700, textDecoration: 'none' }}>
              Sign up now!
            </Link>
          </p>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', lineHeight: 1.7 }}>
            By continuing, you agree to our{' '}
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 12, textDecoration: 'underline', fontFamily: 'inherit' }}>
              Terms of Service
            </button>
            {' '}and{' '}
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 12, textDecoration: 'underline', fontFamily: 'inherit' }}>
              Privacy Policy
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;
