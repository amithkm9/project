// app/page.tsx - Direct access to home page without redirects
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  // Immediately redirect to home page
  useEffect(() => {
    router.replace('/home');
  }, [router]);

  // Show nothing while redirecting
  return null;
}