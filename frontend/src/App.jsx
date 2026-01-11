import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Write from './pages/Write';
import Read from './pages/Read';
import StoryEditor from './pages/StoryEditor';
import StoryOverview from './pages/StoryOverview';
import AddChapter from './pages/AddChapter';
import EditChapter from './pages/EditChapter';
import Search from './pages/Search';
import GoogleAuthCallback from './pages/GoogleAuthCallback';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirects to home if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

function AppContent() {
  const location = useLocation();

  return (
    <div className="App">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/story/:storyId" element={<ProtectedRoute><StoryOverview /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/write" element={<ProtectedRoute><Write /></ProtectedRoute>} />
          <Route path="/write/:storyId" element={<ProtectedRoute><Write /></ProtectedRoute>} />
          <Route path="/story-editor/:storyId" element={<ProtectedRoute><StoryEditor /></ProtectedRoute>} />
          <Route path="/add-chapter/:storyId" element={<ProtectedRoute><AddChapter /></ProtectedRoute>} />
          <Route path="/edit-chapter/:storyId/:chapterId" element={<ProtectedRoute><EditChapter /></ProtectedRoute>} />
          <Route path="/read/:storyId/:chapterId" element={<ProtectedRoute><Read /></ProtectedRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/google-auth" element={<GoogleAuthCallback />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
