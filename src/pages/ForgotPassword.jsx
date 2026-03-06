// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validation';
import { Card, IconBadge, PageTitle, Input, Button, Alert, LinkButton } from '../components/UI';

const MailIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  const [email, setEmail]       = useState('');
  const [fieldError, setFieldError] = useState('');
  const [apiError, setApiError]     = useState('');
  const [success, setSuccess]       = useState('');
  const [loading, setLoading]       = useState(false);

  const handleSubmit = async () => {
    setFieldError(''); setApiError(''); setSuccess('');
    const err = validateEmail(email);
    if (err) return setFieldError(err);

    setLoading(true);
    try {
      const data = await forgotPassword(email.trim());
      setSuccess(data.message || 'Check your inbox for the reset link.');
    } catch (e) {
      setApiError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <IconBadge><MailIcon /></IconBadge>
      <PageTitle
        title="Forgot password?"
        subtitle="Enter your email — we'll send a reset link valid for 15 minutes."
      />

      <Alert type="error"   message={apiError || fieldError} />
      <Alert type="success" message={success} />

      {!success && (
        <>
          <Input id="fp-email" label="Email address" type="email" value={email}
            onChange={v => { setEmail(v); setFieldError(''); setApiError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="you@example.com" error={fieldError}
            autoComplete="email" autoFocus />

          <Button onClick={handleSubmit} loading={loading}>Send reset link</Button>
        </>
      )}

      {success && (
        <Button onClick={() => navigate('/login')} style={{ marginTop:16 }}>Back to sign in</Button>
      )}

      {!success && (
        <div style={{ textAlign:'center', marginTop:20 }}>
          <LinkButton onClick={() => navigate('/login')}>← Back to sign in</LinkButton>
        </div>
      )}
    </Card>
  );
}
