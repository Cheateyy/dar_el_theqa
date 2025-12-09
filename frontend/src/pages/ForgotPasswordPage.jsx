import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/common/AuthLayout';
import backIcon from '../assets/icons/back.svg';

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuth();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const result = await requestPasswordReset(email);

      if (result.success) {
        setSuccess(true);
        // Show success message for 2 seconds, then navigate
        setTimeout(() => {
          navigate('/confirm-email', { 
            state: { 
              email,
              isPasswordReset: true,
              message: 'We have sent a password reset code to your email'
            } 
          });
        }, 2000);
      } else {
        // Backend returns success even if email doesn't exist (security)
        // So we still show success
        setSuccess(true);
        setTimeout(() => {
          navigate('/confirm-email', { 
            state: { 
              email,
              isPasswordReset: true,
              message: 'We have sent a password reset code to your email'
            } 
          });
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
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
              disabled={loading}
              style={{
                background: 'none',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                opacity: loading ? 0.6 : 1
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

          {/* Success Message */}
          {success && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#efe',
              border: '1px solid #cfc',
              borderRadius: '8px',
              color: '#3c3',
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              Check your email for the reset code
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
              disabled={loading || success}
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
                boxSizing: 'border-box',
                opacity: (loading || success) ? 0.6 : 1
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
            disabled={loading || success}
            style={{
              width: '100%',
              height: '60px',
              backgroundColor: (loading || success) ? '#6b8da3' : '#0E4466',
              color: '#DADADA',
              border: 'none',
              borderRadius: '50px',
              fontSize: '20px',
              fontWeight: '600',
              cursor: (loading || success) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Sending...' : success ? 'Code Sent!' : 'Next'}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;