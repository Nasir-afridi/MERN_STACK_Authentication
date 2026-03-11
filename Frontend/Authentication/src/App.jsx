// App.js
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./component/Navbar";
import axios from "axios";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

axios.defaults.withCredentials = true;

// ProtectedRoute with session control
const ProtectedRoute = ({ user, sessionStarted, children }) => {
  if (!sessionStarted) {
    // Initial render ke liye loading state
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [sessionStarted, setSessionStarted] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:4500/api/auth/me");
        setUser(res.data);
      } catch (err) {
        console.log(err);
        setUser(null);
      } finally {
        setSessionStarted(true);
      }
    };
    fetchUser();
  }, []);

  return (
    <Router>
      <Navbar
        user={user}
        setUser={setUser}
        setSessionStarted={setSessionStarted}
      />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute user={user} sessionStarted={sessionStarted}>
              <Home user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            !sessionStarted ? null : user ? (
              <Navigate to="/" replace />
            ) : (
              <Login setUser={setUser} />
            )
          }
        />

        <Route
          path="/register"
          element={
            !sessionStarted ? null : user ? (
              <Navigate to="/" replace />
            ) : (
              <Register setUser={setUser} />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
