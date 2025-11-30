import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/common/AuthLayout';
import backIcon from '../assets/icons/back-icon.svg';

function ConfirmEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'user@mail.com';
  
  const [code, setCode] = useState(['', '', '', '']);
  const [status, setStatus] = useState('default');
  const [focusedIndex, setFocusedIndex] = useState(null);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  const CORRECT_CODE = '1234';

  const handleChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (status !== 'default') {
      setStatus('default');
    }

    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }

    if (newCode.every(digit => digit !== '')) {
      const fullCode = newCode.join('');
      
      if (fullCode === CORRECT_CODE) {
        setStatus('success');
        setTimeout(() => {
          navigate('/reset-password');
        }, 1500);
      } else {
        setStatus('error');
        setTimeout(() => {
          setCode(['', '', '', '']);
          setStatus('default');
          inputRefs[0].current.focus();
        }, 2000);
      }
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
              Confirm Email
            </h1>
          </div>

          <p style={{
            color: '#757575',
            fontSize: '16px',
            fontWeight: '500',
            marginBottom: '24px',
            marginTop: 0
          }}>
            We have sent a confirmation code to your email
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

          {/* Code Input Boxes */}
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center'
          }}>
            {code.map((digit, index) => (
              <div
                key={index}
                style={{
                  position: 'relative',
                  width: '70px',
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
                    backgroundColor: 'white',
                    paddingBottom: '8px',
                    color: '#333333'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '18px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '40px',
                  height: '2px',
                  backgroundColor: getUnderlineColor(index),
                  transition: 'background-color 0.3s'
                }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export default ConfirmEmailPage;