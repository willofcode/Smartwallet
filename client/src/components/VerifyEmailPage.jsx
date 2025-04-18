// Simple verification page for email verification
// This page will be displayed when the user clicks the verification link in their email
// modification and updates will be handled by frontend team 

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('waiting');
  const [message, setMessage] = useState(
    'Waiting for verification, click the link in your inbox…'
  );

  useEffect(() => {
    const emailToken = searchParams.get('email_token');
    if (!emailToken) {
      setStatus('waiting');
      return;
    }

    setStatus('verifying');
    setMessage('Verifying your email…');

    axios
      .get(
        `${import.meta.env.VITE_API_URL}/verify-email?email_token=${emailToken}`
      )
      .then(() => {
        setStatus('verified');
        setMessage('Email verified! You can now log in.');
        navigate('/transactions', { replace: true });
      })
      .catch((err) => {
        setStatus('error');
        setMessage(
          err.response?.data || 'Verification failed. That link may have expired.'
        );
      });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#292d52]">
      <div className="p-8 bg-white rounded shadow-md max-w-md text-center">
        {status === 'waiting' && <p>{message}</p>}
        {status === 'verifying' && <p>{message}</p>}
        {status === 'error' && (
          <>
            <p className="text-red-600">{message}</p>
            <p className="mt-4 text-sm text-gray-600">
              If you didn’t get the email, please <a
                href="/"
                className="underline text-indigo-600"
              >
                sign up again
              </a>.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
