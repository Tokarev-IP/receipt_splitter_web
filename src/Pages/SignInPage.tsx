import React, { useState, useEffect } from 'react';
import { signInUsingEmailAndPassword, 
  sendPasswordResetLinkToEmail,
  registerUsingEmailAndPassword,
  sendEmailVerificationLink,
  signInWithGoogle,
  handleRedirectResult,
  } from '../Firebase/FirebaseAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Email validation function
function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format.';
  }
  return null;
}

// Password validation function
function validatePassword(password: string): string | null {
  // Password: min 10 chars, at least 1 lowercase, 1 uppercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/;
  if (!passwordRegex.test(password)) {
    return 'Password must be at least 10 characters long and include at least one lowercase letter, one uppercase letter, and one number.';
  }
  return null;
}

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [showUnverifiedModal, setShowUnverifiedModal] = useState(false);
  const [unverifiedUser, setUnverifiedUser] = useState<any>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(false);
  const [stillNotVerified, setStillNotVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(!!(location.state && location.state.popupMessage));
  const popupMessage = location.state && location.state.popupMessage;

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.emailVerified) {
          navigate('/receipt');
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Handle redirect result for Google Sign-In
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await handleRedirectResult();
        if (result) {
          const user = result.user;
          if (user) {
            alert('Sign in with Google successful!');
            navigate('/receipt');
          }
        }
      } catch (error: any) {
        console.error('Redirect result error:', error);
        // Don't show alert for redirect errors as they're expected
      }
    };

    checkRedirectResult();
  }, [navigate]);

  useEffect(() => {
    // Сохраняем текущее значение overflow
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInUsingEmailAndPassword(email, password);
      const user = userCredential.user;
      if (user.emailVerified) {
        alert('Sign in successful!');
        navigate('/receipt');
      } else {
        setUnverifiedUser(user);
        setUnverifiedEmail(user.email || email);
        setShowUnverifiedModal(true);
        setVerificationSent(false);
        setStillNotVerified(false);
        await sendEmailVerificationLink(user);
      }
    } catch (error: any) {
      alert('Sign in failed: ' + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotModal(true);
    setForgotEmail('');
  };

  const handleCloseModal = () => {
    setShowForgotModal(false);
  };

  const handleSendForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetLinkToEmail(forgotEmail);
      alert('Password reset email sent!');
      setShowForgotModal(false);
    } catch (error: any) {
      alert('Failed to send password reset email: ' + (error.message || error));
    }
  };

  const handleOpenRegister = () => {
    setShowRegisterModal(true);
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterConfirmPassword('');
  };

  const handleCloseRegister = () => {
    setShowRegisterModal(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerPassword !== registerConfirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    const emailError = validateEmail(registerEmail);
    if (emailError) {
      alert(emailError);
      return;
    }
    const passwordError = validatePassword(registerPassword);
    if (passwordError) {
      alert(passwordError);
      return;
    }
    setLoading(true);
    try {
      const userCredential = await registerUsingEmailAndPassword(registerEmail, registerPassword);
      const user = userCredential.user;
      if (user.emailVerified) {
        alert('Registration successful!');
        setShowRegisterModal(false);
        navigate('/receipt');
      } else {
        setShowRegisterModal(false);
        setUnverifiedUser(user);
        setUnverifiedEmail(user.email || registerEmail);
        setShowUnverifiedModal(true);
        setVerificationSent(false);
        setStillNotVerified(false);
        await sendEmailVerificationLink(user);
      }
    } catch (error: any) {
      alert('Registration failed: ' + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (unverifiedUser) {
      try {
        await sendEmailVerificationLink(unverifiedUser);
        setVerificationSent(true);
      } catch (error: any) {
        alert('Failed to send verification email: ' + (error.message || error));
      }
    }
  };

  const handleContinueCheck = async () => {
    if (unverifiedUser) {
      setCheckingVerification(true);
      setStillNotVerified(false);
      try {
        await unverifiedUser.reload();
        const refreshedUser = getAuth().currentUser;
        if (refreshedUser && refreshedUser.emailVerified) {
          setShowUnverifiedModal(false);
          alert('Email verified!');
          navigate('/receipt');
        } else {
          setStillNotVerified(true);
        }
      } catch (error: any) {
        alert('Error checking verification: ' + (error.message || error));
      } finally {
        setCheckingVerification(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Check if we're on a mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // For mobile devices, the redirect will happen automatically
        // The result will be handled in the useEffect above
        await signInWithGoogle();
      } else {
        // For desktop devices, handle the result immediately
        const userCredential = await signInWithGoogle();
        if (userCredential?.user) {
          alert('Sign in with Google successful!');
          navigate('/receipt');
        }
      }
    } catch (error: any) {
      alert('Google sign in failed: ' + (error.message || error));
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', background: '#f7fafc' }}>
        <div style={{ fontSize: '1.2rem', color: '#2d3748' }}>Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="flex-center" style={{ background: '#fff', minHeight: 0, height: '100%', alignItems: 'flex-start' }}>
      {/* Popup Modal for navigation state message */}
      {showPopup && popupMessage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            minWidth: '320px',
            maxWidth: '90vw',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            textAlign: 'center',
          }}>
            <h2 style={{ color: '#dc2626', marginBottom: '16px', fontWeight: 700 }}>Notice</h2>
            <p style={{ color: '#374151', marginBottom: '24px', fontSize: '16px' }}>{popupMessage}</p>
            <button
              onClick={() => setShowPopup(false)}
              style={{
                padding: '12px 32px',
                borderRadius: '8px',
                border: 'none',
                background: '#3182ce',
                color: '#fff',
                fontWeight: 600,
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#2563eb')}
              onMouseOut={e => (e.currentTarget.style.background = '#3182ce')}
            >
              OK
            </button>
          </div>
        </div>
      )}
      <form
        onSubmit={handleSignIn}
        className="responsive-modal-content"
        style={{ maxWidth: 400, width: '100%', margin: '40px auto' }}
      >
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#2d3748' }}>Sign In</h2>
        <label style={{ marginBottom: '0.5rem', color: '#4a5568', width: '100%', display: 'block' }}>
          Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.25rem',
              marginBottom: '1rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e0',
              fontSize: '1rem',
              boxSizing: 'border-box',
              display: 'block',
            }}
          />
        </label>
        <label style={{ marginBottom: '0.5rem', color: '#4a5568', width: '100%', display: 'block' }}>
          Password
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.25rem',
                marginBottom: '1.5rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e0',
                fontSize: '1rem',
                boxSizing: 'border-box',
                display: 'block',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#3182ce',
                fontSize: '0.95rem',
                padding: 0,
                height: 'auto',
                lineHeight: 1,
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>
        {/* Sign In and Google Sign In buttons in one row */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '0.75rem', width: '100%', marginBottom: '1rem' }}>
          <button
            type="submit"
            style={{
              flex: 1,
              background: '#3182ce',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.75rem',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background 0.2s',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#2563eb')}
            onMouseOut={e => (e.currentTarget.style.background = '#3182ce')}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            style={{
              flex: 1,
              background: '#fff',
              color: '#2d3748',
              border: '1px solid #cbd5e0',
              borderRadius: '6px',
              padding: '0.75rem',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'background 0.2s',
              height: '48px',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#f1f5f9')}
            onMouseOut={e => (e.currentTarget.style.background = '#fff')}
          >
            <svg width="20" height="20" viewBox="0 0 48 48" style={{ marginRight: 8 }}><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.36 30.74 0 24 0 14.82 0 6.73 5.8 2.69 14.09l7.98 6.2C12.13 13.09 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.59C43.93 37.13 46.1 31.36 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.29a14.5 14.5 0 0 1 0-8.58l-7.98-6.2A23.94 23.94 0 0 0 0 24c0 3.93.94 7.65 2.69 10.89l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.15 15.9-5.85l-7.19-5.59c-2.01 1.35-4.59 2.16-8.71 2.16-6.38 0-11.87-3.59-14.33-8.79l-7.98 6.2C6.73 42.2 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
            Sign in with Google
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#3182ce',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
              fontSize: '0.95rem',
            }}
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </button>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#3182ce',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
              fontSize: '0.95rem',
            }}
            onClick={handleOpenRegister}
          >
            Registration
          </button>
        </div>
      </form>
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <form
            onSubmit={handleSendForgot}
            style={{
              background: '#fff',
              padding: '2rem 2.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
              minWidth: '320px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Forgot Password</h3>
            <p style={{ marginBottom: '1rem', color: '#4a5568', textAlign: 'center' }}>
              Put your email and we will send you EMAIL with link to rewrite password.
            </p>
            <input
              type="email"
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              required
              placeholder="Email"
              style={{
                width: '100%',
                padding: '0.5rem',
                marginBottom: '1.5rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e0',
                fontSize: '1rem',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <button
                type="button"
                onClick={handleCloseModal}
                style={{
                  background: '#e2e8f0',
                  color: '#2d3748',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1.5rem',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  marginRight: '1rem',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  background: '#3182ce',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1.5rem',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#2563eb')}
                onMouseOut={e => (e.currentTarget.style.background = '#3182ce')}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
      {showRegisterModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <form
            onSubmit={handleRegister}
            style={{
              background: '#fff',
              padding: '2rem 2.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
              minWidth: '320px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Registration</h3>
            <input
              type="email"
              value={registerEmail}
              onChange={e => setRegisterEmail(e.target.value)}
              required
              placeholder="Email"
              style={{
                width: '100%',
                maxWidth: '320px',
                padding: '0.5rem',
                marginBottom: '1rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e0',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ position: 'relative', width: '100%', maxWidth: '320px', marginBottom: '1rem' }}>
              <input
                type={showRegisterPassword ? 'text' : 'password'}
                value={registerPassword}
                onChange={e => setRegisterPassword(e.target.value)}
                required
                placeholder="Password"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e0',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowRegisterPassword((prev) => !prev)}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#3182ce',
                  fontSize: '0.95rem',
                  padding: 0,
                }}
              >
                {showRegisterPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div style={{ position: 'relative', width: '100%', maxWidth: '320px', marginBottom: '1.5rem' }}>
              <input
                type={showRegisterConfirmPassword ? 'text' : 'password'}
                value={registerConfirmPassword}
                onChange={e => setRegisterConfirmPassword(e.target.value)}
                required
                placeholder="Confirm Password"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e0',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowRegisterConfirmPassword((prev) => !prev)}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#3182ce',
                  fontSize: '0.95rem',
                  padding: 0,
                }}
              >
                {showRegisterConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '320px' }}>
              <button
                type="button"
                onClick={handleCloseRegister}
                style={{
                  background: '#e2e8f0',
                  color: '#2d3748',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1.5rem',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  marginRight: '1rem',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  background: '#3182ce',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1.5rem',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#2563eb')}
                onMouseOut={e => (e.currentTarget.style.background = '#3182ce')}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      )}
      {showUnverifiedModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#fff',
            padding: '2rem 2.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
            minWidth: '320px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Email Not Verified</h3>
            <p style={{ marginBottom: '1rem', color: '#4a5568', textAlign: 'center' }}>
              A verification link was sent to <b>{unverifiedEmail}</b>.<br />
              To continue, please confirm your email by clicking the link.
            </p>
            <button
              type="button"
              onClick={handleContinueCheck}
              disabled={checkingVerification}
              style={{
                background: '#3182ce',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem 1.5rem',
                fontSize: '1rem',
                cursor: 'pointer',
                marginBottom: '1rem',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#2563eb')}
              onMouseOut={e => (e.currentTarget.style.background = '#3182ce')}
            >
              {checkingVerification ? 'Checking...' : 'Continue'}
            </button>
            {stillNotVerified && (
              <p style={{ color: '#e53e3e', marginBottom: '1rem' }}>Still not verified. Please check your email.</p>
            )}
            <button
              type="button"
              onClick={handleResendVerification}
              style={{
                background: '#3182ce',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem 1.5rem',
                fontSize: '1rem',
                cursor: 'pointer',
                marginBottom: '1rem',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#2563eb')}
              onMouseOut={e => (e.currentTarget.style.background = '#3182ce')}
            >
              Resend verification email
            </button>
            {verificationSent && (
              <p style={{ color: '#38a169', marginBottom: '1rem' }}>Verification email sent!</p>
            )}
            <button
              type="button"
              onClick={() => setShowUnverifiedModal(false)}
              style={{
                background: '#e2e8f0',
                color: '#2d3748',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem 1.5rem',
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInPage;
