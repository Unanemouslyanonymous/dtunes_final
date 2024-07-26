"use client";
import React, { useContext, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthContext } from '@/context/authContext';
const DAuthCallback = () => {
  const authContext = useContext(AuthContext)
  if (!authContext) return null
  const { loginWithDAuth } = authContext
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const hasHandled = useRef(false);

  useEffect(() => {
    if (code && !hasHandled.current) {
      loginWithDAuth(code);
      hasHandled.current = true;
    }
  }, [code]);

  return <div>Loading...</div>;
};

export default DAuthCallback;
