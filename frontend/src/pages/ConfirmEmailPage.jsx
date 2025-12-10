import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/common/AuthLayout';
import backIcon from '../assets/icons/back.svg';

function ConfirmEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activateAccount, resendActivationCode } = useAuth();
  
  const email = location.state?.email || '';
  const isPasswordReset = location.state?.isPasswordReset || false;
  const message = location.state?.message || 'We have sent a confirmation code to your email';
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [status, setStatus] = useState('default'); // 'default', 'success', 'error'
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const handleChange = async (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (status !== 'default') {
      setStatus('default');
      setErrorMessage('');
    }

    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }

    // Auto-submit when all digits are entered
    if (newCode.every(digit => digit !== '')) {
      const fullCode = newCode.join('');
      await submitCode(fullCode);
    }
  };

  const submitCode = async (fullCode) => {
    if (!email) {
      setStatus('error');
      setErrorMessage('Email not found. Please try again.');
      return;
    }

    setLoading(true);
    setStatus('default');
    setErrorMessage('');

    if (isPasswordReset) {
      // For password reset, just navigate to reset password page with the code
      // The code will be verified when they submit the new password
      setStatus('success');
      setTimeout(() => {
        navigate('/reset-password', { 
          state: { 
            email,
            code: fullCode 
          } 
        });
      }, 1000);
      setLoading(false);
      return;
    }

    // For account activation
    try {
      const result = await activateAccount(email, fullCode);

      if (result.success) {
        setStatus('success');
        
        // Auto-login successful, redirect based on user role
        setTimeout(() => {
          if (result.data.user) {
            const role = result.data.user.role;
            if (role === 'ADMIN') {
              navigate('/admin/dashboard');
            } else if (role === 'PARTNER') {
              navigate('/partner/dashboard');
            } else {
              navigate('/');
            }
          } else {
            navigate('/login');
          }
        }, 1500);
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Invalid code. Please try again.');
        
        // Clear code after error
        setTimeout(() => {
          setCode(['', '', '', '', '', '']);
          setStatus('default');
          setErrorMessage('');
          inputRefs[0].current.focus();
        }, 2000);
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('An error occurred. Please try again.');
      console.error('Activation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setResendMessage('Email not found');
      return;
    }

    if (isPasswordReset) {
      setResendMessage('Use "Forgot Password" to get a new code');
      setTimeout(() => setResendMessage(''), 3000);
      return;
    }

    setResendLoading(true);
    setResendMessage('');

    try {
      const result = await resendActivationCode(email);

      if (result.success) {
        setResendMessage('Code resent! Check your email.');
        setCode(['', '', '', '', '', '']);
        inputRefs[0].current.focus();
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setResendMessage('');
        }, 3000);
      } else {
        setResendMessage(result.error || 'Failed to resend code');
      }
    } catch (err) {
      setResendMessage('An error occurred');
      console.error('Resend error:', err);
    } finally {
      setResendLoading(false);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleFocus = (index) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getBorderColor = (index) => {
    if (status === 'error') return '#ef4444';
    if (status === 'success') return '#22c55e';
    if (focusedIndex === index) return '#0E4466';
    return '#DADADA';
  };

  const getUnderlineColor = (index) => {
    if (status === 'error') return '#ef4444';
    if (status === 'success') return '#22c55e';
    if (focusedIndex === index) return '#0E4466';
    return '#DADADA';
  };

  if (!email) {
    return (
      <AuthLayout>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <p style={{ color: '#757575', marginBottom: '24px' }}>
            Email not found. Please {isPasswordReset ? 'request password reset' : 'sign up'} first.
          </p>
          <button
            onClick={() => navigate(isPasswordReset ? '/forgot-password' : '/signup')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#0E4466',
              color: '#DADADA',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Go Back
          </button>
        </div>
      </AuthLayout>
    );
  }

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
              {isPasswordReset ? 'Reset Password' : 'Confirm Email'}
            </h1>
          </div>

          <p style={{
            color: '#757575',
            fontSize: '16px',
            fontWeight: '500',
            marginBottom: '24px',
            marginTop: 0
          }}>
            {message}
          </p>

          {/* Email Display - Read-only */}
          <div style={{
            padding: '20px',
            backgroundColor: '#F1F1F1',
            border: '1px solid #DADADA',
            borderRadius: '12px',
            marginBottom: '24px',
            fontSize: '16px',
            fontWeight: '400',
            color: '#757575',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            boxSizing: 'border-box'
          }}>
            {email}
          </div>

          {/* Error/Success Message */}
          {errorMessage && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '8px',
              color: '#c33',
              fontSize: '14px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              {errorMessage}
            </div>
          )}

          {status === 'success' && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#efe',
              border: '1px solid #cfc',
              borderRadius: '8px',
              color: '#3c3',
              fontSize: '14px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              {isPasswordReset ? 'Code verified! Redirecting...' : 'Account activated! Redirecting...'}
            </div>
          )}

          {/* Code Input Boxes */}
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            marginBottom: '24px'
          }}>
            {code.map((digit, index) => (
              <div
                key={index}
                style={{
                  position: 'relative',
                  width: '55px',
                  height: '70px'
                }}
              >
                <input
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={() => handleFocus(index)}
                  onBlur={handleBlur}
                  disabled={loading}
                  style={{
                    width: '100%',
                    height: '100%',
                    textAlign: 'center',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    border: `2px solid ${getBorderColor(index)}`,
                    borderRadius: '12px',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                    fontFamily: 'Urbanist',
                    backgroundColor: loading ? '#f5f5f5' : 'white',
                    paddingBottom: '8px',
                    color: '#333333',
                    cursor: loading ? 'not-allowed' : 'text'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '18px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '35px',
                  height: '2px',
                  backgroundColor: getUnderlineColor(index),
                  transition: 'background-color 0.3s'
                }} />
              </div>
            ))}
          </div>

          {/* Resend Code Button */}
          {!isPasswordReset && (
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleResendCode}
                disabled={resendLoading || loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0E4466',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: (resendLoading || loading) ? 'not-allowed' : 'pointer',
                  textDecoration: 'underline',
                  opacity: (resendLoading || loading) ? 0.6 : 1
                }}
              >
                {resendLoading ? 'Sending...' : 'Resend Code'}
              </button>
              
              {resendMessage && (
                <p style={{
                  marginTop: '8px',
                  fontSize: '14px',
                  color: resendMessage.includes('resent') ? '#22c55e' : '#ef4444'
                }}>
                  {resendMessage}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}

export default ConfirmEmailPage;