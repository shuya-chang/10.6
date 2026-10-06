import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import PaperList from './pages/PaperList';
import AddPaper from './pages/AddPaper';
import EditPaper from './pages/EditPaper';
import PaperDetail from './pages/PaperDetail';
import { AuthContext } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { token } = React.useContext(AuthContext);
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="container mx-auto px-4 py-8 max-w-7xl">
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/papers" element={
                            <ProtectedRoute>
                                <PaperList />
                            </ProtectedRoute>
                        } />
                        <Route path="/papers/new" element={
                            <ProtectedRoute>
                                <AddPaper />
                            </ProtectedRoute>
                        } />
                        <Route path="/papers/:id" element={
                            <ProtectedRoute>
                                <PaperDetail />
                            </ProtectedRoute>
                        } />
                        <Route path="/papers/:id/edit" element={
                            <ProtectedRoute>
                                <EditPaper />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
