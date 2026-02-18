'use client';

import { useState, useEffect } from 'react';
import RegisterForm from './RegisterForm';

export default function ClientAuthWrapper() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Render a minimal placeholder during SSR/hydration
    return (
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-1">Start managing your tasks today</p>
        </div>
        <div className="space-y-4">
          <div className="w-full">
            <div className="block text-sm font-medium text-gray-700 mb-1 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="w-full">
            <div className="block text-sm font-medium text-gray-700 mb-1 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="w-full">
            <div className="block text-sm font-medium text-gray-700 mb-1 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="w-full">
            <div className="block text-sm font-medium text-gray-700 mb-1 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="w-full h-10 bg-gray-300 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  // After hydration, render the actual form
  return <RegisterForm />;
}