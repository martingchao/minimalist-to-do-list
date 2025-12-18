import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login, register } from '../api/auth';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-paper-light">
      <div className="w-full max-w-md">
        {/* Paper-like container with notepad effect */}
        <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] rounded-sm p-8 relative border border-black/10">
          {/* Notepad left edge effect */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-paper-dark border-r-2 border-black/20"></div>
          {/* Notepad bottom edge effect */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-paper-dark border-t-2 border-black/20"></div>
          {/* Decorative top line with dots */}
          <div className="relative mb-6">
            <div className="absolute left-0 right-0 top-3 border-t border-black"></div>
            <div className="absolute left-2 top-2.5 w-1.5 h-1.5 bg-black rounded-full"></div>
            <div className="absolute right-2 top-2.5 w-1.5 h-1.5 bg-black rounded-full"></div>
            <div className="text-center relative">
              <span className="text-2xl">✦</span>
              <span className="text-3xl mx-2">✦</span>
              <span className="text-2xl">✦</span>
            </div>
          </div>

          <h1 className="text-3xl font-normal text-center mb-8 tracking-wide">
            {isLogin ? 'LOGIN' : 'REGISTER'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full px-4 py-3 border-b-2 border-black bg-transparent focus:outline-none focus:border-gray-600 text-lg placeholder-gray-500"
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={6}
                className="w-full px-4 py-3 border-b-2 border-black bg-transparent focus:outline-none focus:border-gray-600 text-lg placeholder-gray-500"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors duration-200 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '...' : isLogin ? 'LOGIN' : 'REGISTER'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sm text-gray-600 hover:text-black underline"
            >
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

