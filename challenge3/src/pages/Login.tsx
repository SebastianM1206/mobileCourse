import { IonPage, IonContent } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();
  const { login } = useAuthContext();

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      history.push('/listing-task');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <IonPage>
      <IonContent scrollY={false}>
        <div className="min-h-screen bg-[#f2f3f5] flex flex-col px-6 pt-safe pb-safe">

          {/* Branding */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-10">
              <div className="w-14 h-14 bg-[#c9f158] rounded-2xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-[#202020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-[#202020] mb-1">Welcome back</h1>
              <p className="text-gray-500 text-base">Sign in to TaskFlow</p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              {/* Email */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3.5 rounded-xl bg-[#f2f3f5] text-[#202020] placeholder-gray-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#c9f158] transition-all"
                />
              </div>

              {/* Password */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 pr-12 rounded-xl bg-[#f2f3f5] text-[#202020] placeholder-gray-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#c9f158] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 rounded-xl flex items-start gap-2">
                  <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}

              {/* Sign in button */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-4 bg-[#202020] text-white font-semibold rounded-2xl active:scale-95 transition-all disabled:opacity-60 text-sm tracking-wide"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </div>

            {/* Register link */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <button
                onClick={() => history.push('/register')}
                className="text-[#202020] font-bold underline underline-offset-2"
              >
                Create one
              </button>
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
