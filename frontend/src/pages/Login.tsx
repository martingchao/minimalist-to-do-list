import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login, register } from '../api/auth';

// Eye icon for showing password
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

// Eye slash icon for hiding password
const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

// Leaf decoration component
const LeafDecoration = () => (
  <div className="flex justify-center gap-2 mb-2">
    <span className="text-forest-400 text-xl animate-pulse">🌿</span>
    <span className="text-forest-300 text-2xl">🍀</span>
    <span className="text-forest-400 text-xl animate-pulse">🌿</span>
  </div>
);

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = isLogin
        ? await login({ email, password })
        : await register({ email, password });

      setAuth(response.token, response.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <div className="w-full max-w-md">
        {/* Glass-morphic container with green glow */}
        <div className="bg-gradient-to-br from-forest-900/90 via-forest-800/85 to-forest-900/90 backdrop-blur-xl shadow-green-glow-lg rounded-2xl p-8 relative border border-forest-500/30 overflow-hidden">
          {/* Animated green accent lines */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-glow to-transparent opacity-60"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-forest-400 to-transparent opacity-40"></div>
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-forest-400 to-transparent opacity-40"></div>
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-forest-400 to-transparent opacity-40"></div>
          
          {/* Decorative corner accents */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-forest-400/50 rounded-tl-lg"></div>
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-forest-400/50 rounded-tr-lg"></div>
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-forest-400/50 rounded-bl-lg"></div>
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-forest-400/50 rounded-br-lg"></div>

          <LeafDecoration />

          <h1 className="text-4xl font-bold text-center mb-8 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-forest-200 via-mint to-forest-200">
            {isLogin ? 'LOGIN' : 'REGISTER'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full px-4 py-3 border-b-2 border-forest-500 bg-forest-950/50 focus:outline-none focus:border-mint text-lg placeholder-forest-400 text-forest-100 rounded-t-lg transition-all duration-300 focus:bg-forest-900/50"
              />
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-glow transition-all duration-300 group-focus-within:w-full"></div>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={6}
                className="w-full px-4 py-3 pr-12 border-b-2 border-forest-500 bg-forest-950/50 focus:outline-none focus:border-mint text-lg placeholder-forest-400 text-forest-100 rounded-t-lg transition-all duration-300 focus:bg-forest-900/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-forest-400 hover:text-mint transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-900/30 py-2 px-4 rounded-lg border border-red-500/30">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-forest-600 via-forest-500 to-forest-600 hover:from-forest-500 hover:via-forest-400 hover:to-forest-500 text-white font-semibold text-lg rounded-lg shadow-green-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-green-glow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Loading...
                </span>
              ) : (
                isLogin ? '🌱 LOGIN' : '🌱 REGISTER'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sm text-forest-300 hover:text-mint underline decoration-forest-500 hover:decoration-mint transition-colors"
            >
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
