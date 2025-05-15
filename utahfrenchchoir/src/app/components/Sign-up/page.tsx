'use client'

import Link from 'next/link';
import { useState } from 'react';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="max-w-xl w-full mx-auto p-6 sm:p-8 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
      <form className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded" />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Create Account</button>
      </form>
      <div className="text-sm text-center mt-4">
        Already have an account? <Link href="/components/Sign-in" className="text-blue-500 hover:underline">Sign In</Link>
      </div>
    </div>
  );
}
