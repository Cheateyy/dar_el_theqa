import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/common/AuthLayout';
import backIcon from '../assets/icons/back-icon.svg';

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Reset password for:', email);
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
            marginBottom: '12px'
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
              Reset Password
            </h1>
          </div>

          <p style={{
            color: '#757575',
            fontSize: '16px',
            fontWeight: '500',
            marginBottom: '24px',
            marginTop: 0
          }}>
            Enter the email you used to create your account
          </p>

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
        </div>

        {/* Bottom Button */}
        <div>
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
              cursor: 'pointer'
            }}
          >
            Next
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;