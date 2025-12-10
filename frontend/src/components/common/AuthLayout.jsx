import { useState, useEffect } from 'react';
import logo from '../../assets/images/logo.svg';
import whiteLogo from '../../assets/images/logo-white.svg';
import authBg from '../../assets/images/auth-background.png';

function AuthLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#F1F1F1'
    }}>
      {/* Header/Navbar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isMobile ? '0px 20px' : '0px 80px',
        backgroundColor: '#F1F1F1'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={logo} 
            alt="Dar El Theqa Logo" 
            style={{ 
              width: isMobile ? '80px' : '104px', 
              height: isMobile ? '80px' : '104px', 
              objectFit: 'contain' 
            }} 
          />
        </div>
      </header>

      {/* Main Content Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '0',
        margin: isMobile ? '0px 20px 20px 20px' : '0px 120px 60px 120px',
        backgroundColor: 'white',
        borderRadius: isMobile ? '16px' : '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        {/* Left Side - Form */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
          padding: isMobile ? '24px' : '44px',
          order: isMobile ? 2 : 1
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: isMobile ? '100%' : '500px'
          }}>
            {children}
          </div>
        </div>

        {/* Right Side - Image */}
        <div style={{
          flex: isMobile ? '0 0 200px' : 1,
          padding: isMobile ? '24px' : '44px',
          position: 'relative',
          backgroundImage: `url(${authBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          order: isMobile ? 1 : 2,
          minHeight: isMobile ? '200px' : 'auto'
        }}>
          {/* Dark overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
          }} />
          
          {/* Content overlay with logo and text */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            color: 'white',
            padding: isMobile ? '20px' : '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0px'
          }}>
            {/* White logo in center */}
            <div style={{
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src={whiteLogo} 
                alt="Dar El Theqa" 
                style={{ 
                  width: isMobile ? '60px' : '104px', 
                  height: isMobile ? '60px' : '104px', 
                  objectFit: 'contain' 
                }} 
              />
            </div>
            
            <p style={{ 
              fontSize: isMobile ? '14px' : '18px', 
              margin: 0,
              opacity: 0.95,
              maxWidth: '400px'
            }}>
              Your Trustworthy Real Estate Agency
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;