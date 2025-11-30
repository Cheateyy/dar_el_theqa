import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/common/AuthLayout';
import OpenEyeIcon from '../assets/icons/openEye.svg';
import ClosedEyeIcon from '../assets/icons/closedEye.svg';
import backIcon from '../assets/icons/back.svg';

function SignUpPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Sign up:', { fullName, phone, email, password });
    navigate('/confirm-email', { state: { email } });
  };

  const handleBack = () => {
    navigate('/login');
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
              onClick={handleBack}
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
              fontSize: '28px', 
              fontWeight: '600',
              margin: 0,
              color: '#000000'
            }}>
              Sign Up
            </h1>
          </div>

          {/* Full Name */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '12px',
              fontSize: '16px',
              color: '#141414',
              fontWeight: '400'
            }}>
              Full Name
            </label>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{
                  width: '100%',
                  height: '43px',
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

          {/* Phone Number */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '12px',
              fontSize: '16px',
              color: '#141414',
              fontWeight: '400'
            }}>
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+213 561 30 47 77"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                  width: '100%',
                  height: '43px',
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

          {/* Email */}
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
                  height: '43px',
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

          {/* Password */}
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
                  height: '43px',
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

          {/* Confirm Password */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '12px',
              fontSize: '16px',
              color: '#141414',
              fontWeight: '400'
            }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="insert password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  height: '43px',
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
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  src={showConfirmPassword ? OpenEyeIcon : ClosedEyeIcon} 
                  alt="Toggle password" 
                  style={{ width: '20px', height: '20px' }} 
                />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div>
          {/* Next Button */}
          <button
            onClick={handleSubmit}
            style={{
              width: '100%',
              height: '60px',
              backgroundColor: '#0E4466',
              color: '#DADADA',
              border: 'none',
              borderRadius: '50px',
              fontSize: '20px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '16px'
            }}
          >
            Next
          </button>

          {/* Login Link */}
          <p style={{ 
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: '400',
            color: '#757575',
            margin: 0
          }}>
            Already have an account?{' '}
            <a 
              href="/login" 
              style={{ 
                color: '#0E4466', 
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Log In
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

export default SignUpPage;