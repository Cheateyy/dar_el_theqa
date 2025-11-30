import { useState, useEffect } from 'react';
import AuthLayout from '../components/common/AuthLayout';
import OpenEyeIcon from '../assets/icons/openEye.svg';
import ClosedEyeIcon from '../assets/icons/closedEye.svg';
import backIcon from '../assets/icons/back-icon.svg';

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', { email, password });
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
            <button style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center'
            }}>
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
                boxSizing: 'border-box'
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
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0E4466'}
                onBlur={(e) => e.target.style.borderColor = '#DADADA'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
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
                fontWeight: '400'
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
            style={{
              width: '100%',
              height: isMobile ? '50px' : '60px',
              backgroundColor: '#0E4466',
              color: '#DADADA',
              border: 'none',
              borderRadius: '50px',
              fontSize: isMobile ? '18px' : '20px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '8px'
            }}
          >
            Log In
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
                fontWeight: '600'
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