import React from 'react';
import { Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import SummaryPage from './pages/SummaryPage';
import ClassroomPage from './pages/ClassroomPage';
import QuizPage from './pages/QuizPage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { Sparkles, Upload, Users, LogOut } from 'lucide-react';
import { getCurrentUser, logoutUser } from './services/authService';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    setUser(getCurrentUser());
  }, [location.pathname]);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    navigate('/login');
  };

  const getLinkClass = (path) => {
    const isActive = location.pathname.startsWith(path) && path !== '/' || location.pathname === path;
    return `text-sm transition-colors py-2 px-3 rounded-lg font-medium ${isActive
      ? 'bg-white text-slate-900'
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
      }`;
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50">

      <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-6 z-50">

        {/* Left Side: Login & Menu */}
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-primary-600 hidden sm:block">{user.name}</span>
              <button onClick={handleLogout} className="text-slate-600 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-100" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors py-2 px-3 hover:bg-slate-100 rounded-lg">
              Log In
            </Link>
          )}

          {/* Main Links */}
          <div className="hidden md:flex items-center gap-1 border-l border-slate-200 pl-6">
            <Link to="/" className={getLinkClass('/')}>Home</Link>
            <Link to="/classroom" className={getLinkClass('/classroom')}>Classroom</Link>
            <Link to="/upload" className={getLinkClass('/upload')}>Arena</Link>
          </div>
        </div>

        {/* Right Side: Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <span className="font-bold text-xl tracking-tight text-slate-900 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
            luminaIq
          </span>
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
            <img src="/logo.png" alt="luminaIq Logo" className="w-full h-full object-cover" />
          </div>
        </Link>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 flex flex-col z-10">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={setUser} />} />
          <Route path="/register" element={<RegisterPage onLoginSuccess={setUser} />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/summary/:docId" element={<SummaryPage />} />
          <Route path="/classroom" element={<ClassroomPage />} />
          <Route path="/classroom/:code" element={<ClassroomPage />} />
          <Route path="/classroom/:code/quiz/:quizId" element={<QuizPage />} />
          <Route path="/classroom/:code/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </main>

      <footer className="py-8 text-center text-slate-500 text-sm glass-panel mt-auto z-10 flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-2 opacity-70">
          <img src="/logo.png" alt="luminaIq Logo" className="w-5 h-5 object-contain" />
          <span>luminaIq – AI Exam Buddy MVP</span>
        </div>
        <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
