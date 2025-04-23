// Simple verification page for email verification
// awaits for email verification
// once email verification is done, links to authform 

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your email…');

  useEffect(() => {
    const status = searchParams.get('status');

    if (status === 'success') {
      setMessage('Email verified! Redirecting you to login…');
      return void setTimeout(() => {
        navigate('/authform', { replace: true });
      }, 1500);
    }

    if (status === 'invalid') {
      setMessage('That verification link is invalid or expired.');
    }

    if (status === 'error') {
      setMessage('Oops—something went wrong verifying your email.');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#292d52]">
      <div className="p-8 bg-white rounded shadow-md max-w-md text-center">
        <p>{message}</p>
        {searchParams.get('status') === 'invalid' && (
          <p className="mt-4 text-sm">
            <a href="/authform" className="underline text-indigo-600">
              Back to sign up
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
