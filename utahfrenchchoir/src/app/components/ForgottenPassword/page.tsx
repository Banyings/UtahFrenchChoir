'use client'

import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  return (
    <div className="max-w-xl w-full mx-auto p-6 sm:p-8 bg-white rounded-xl shadow ">
      <h1 className="text-2xl font-bold mb-6 text-center">Recover Password</h1>
      <form className="space-y-4">
        <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded" />
        <button type="submit" className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">Send Reset Link</button>
      </form>
      <div className="text-sm text-center mt-4">
        <Link href="/components/Sign-in" className="text-blue-500 hover:underline">Back to Sign In</Link>
      </div>
    </div>
  );
}
