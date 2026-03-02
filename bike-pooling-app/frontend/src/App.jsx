import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RiderDashboard from "./pages/RiderDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import Layout from "./components/Layout";

function Home() {
  const { currentUser } = useAuth();
  // In a real app, we fetch role from DB. For now, read from localStorage or default to CUSTOMER
  const role = localStorage.getItem('userRole') || 'CUSTOMER';

  if (!currentUser) return <Navigate to="/login" />;

  return role === 'RIDER' ? <RiderDashboard /> : <CustomerDashboard />;
}

function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
