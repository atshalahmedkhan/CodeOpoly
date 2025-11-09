import { useState } from 'react';
import { signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, googleProvider, outlookProvider } from '../lib/firebase';

interface AuthProps {
  onAuthSuccess: (user: User) => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      // Check if Firebase is properly configured
      if (!import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === 'demo-key') {
        alert('Firebase not configured. Please use "Play as Guest" or set up Firebase in .env file.');
        setLoading(false);
        return;
      }
      const result = await signInWithPopup(auth, googleProvider);
      onAuthSuccess(result.user);
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      alert('Firebase auth not configured. Please use "Play as Guest" instead.');
    } finally {
      setLoading(false);
    }
  };

  const handleOutlookSignIn = async () => {
    setLoading(true);
    try {
      // Check if Firebase is properly configured
      if (!import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === 'demo-key') {
        alert('Firebase not configured. Please use "Play as Guest" or set up Firebase in .env file.');
        setLoading(false);
        return;
      }
      const result = await signInWithPopup(auth, outlookProvider);
      onAuthSuccess(result.user);
    } catch (error: any) {
      console.error('Outlook sign-in error:', error);
      alert('Firebase auth not configured. Please use "Play as Guest" instead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white/20">
        <div className="text-center mb-4">
          <p className="text-sm text-white/60 mb-4">Optional: Sign in to save your progress</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-100 text-gray-800 font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          <button
            onClick={handleOutlookSignIn}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
            </svg>
            Sign in with Outlook
          </button>
        </div>

        {loading && (
          <div className="mt-4 text-center text-white/60">Signing in...</div>
        )}
      </div>
    </div>
  );
}

