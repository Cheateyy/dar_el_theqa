import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/common/AuthLayout';
import OpenEyeIcon from '../assets/icons/openEye.svg';
import ClosedEyeIcon from '../assets/icons/closedEye.svg';
import backIcon from '../assets/icons/back.svg';

function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'PARTNER') {
        navigate('/partner/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Navigation will happen in the useEffect above
        console.log('Login successful');
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Top Content */}
        <div style={{ flex: 1 }}>
          {/* Title with Back button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px'
          }}>
            <button 
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <img src={backIcon} alt="Back" style={{ width: '24px', height: '24px' }} />
            </button>
            
            <h1 style={{ 
              fontSize: isMobile ? '28px' : '36px', 
              fontWeight: '600',
              margin: 0,
              color: '#000000'
            }}>
              Log In
            </h1>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '8px',
              color: '#c33',
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          {/* Email Field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '12px',
              fontSize: '16px',
              color: '#141414',
              fontWeight: '400'
            }}>
              Email
            </label>
            <input
              type="email"
              placeholder="user@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                height: isMobile ? '50px' : '60px',
                padding: '0px 20px',
                border: '1px solid #DADADA',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '400',
                color: '#000000',
                outline: 'none',
                boxSizing: 'border-box',
                opacity: loading ? 0.6 : 1
              }}
              onFocus={(e) => e.target.style.borderColor = '#0E4466'}
              onBlur={(e) => e.target.style.borderColor = '#DADADA'}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '12px',
              fontSize: '16px',
              color: '#141414',
              fontWeight: '400'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="insert password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                style={{
                  width: '100%',
                  height: isMobile ? '50px' : '60px',
                  padding: '0px 20px',
                  paddingRight: '50px',
                  border: '1px solid #DADADA',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '400',
                  color: '#000000',
                  outline: 'none',
                  boxSizing: 'border-box',
                  opacity: loading ? 0.6 : 1
                }}
                onFocus={(e) => e.target.style.borderColor = '#0E4466'}
                onBlur={(e) => e.target.style.borderColor = '#DADADA'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  opacity: loading ? 0.6 : 1
                }}
              >
                <img 
                  src={showPassword ? OpenEyeIcon : ClosedEyeIcon} 
                  alt="Toggle password" 
                  style={{ width: '20px', height: '20px' }} 
                />
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div style={{ textAlign: 'right', marginBottom: '24px' }}>
            <a 
              href="/forgot-password" 
              style={{ 
                color: '#0E4466', 
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '400',
                pointerEvents: loading ? 'none' : 'auto',
                opacity: loading ? 0.6 : 1
              }}
            >
              Forgot Password
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div>
          {/* Login Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              height: isMobile ? '50px' : '60px',
              backgroundColor: loading ? '#6b8da3' : '#0E4466',
              color: '#DADADA',
              border: 'none',
              borderRadius: '50px',
              fontSize: isMobile ? '18px' : '20px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '8px'
            }}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          {/* Sign Up Link */}
          <p style={{ 
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: '400',
            color: '#757575',
            margin: 0
          }}>
            Don't have an account?{' '}
            <a 
              href="/signup" 
              style={{ 
                color: '#0E4466', 
                textDecoration: 'none',
                fontWeight: '600',
                pointerEvents: loading ? 'none' : 'auto',
                opacity: loading ? 0.6 : 1
              }}
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

export default LoginPage;