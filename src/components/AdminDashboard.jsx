import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // adjust the path as needed

const AdminDashboard = () => {
  const { isAuthenticated, userRole } = AuthContext

  if (!isAuthenticated || userRole !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
        <p className="text-lg text-gray-700 mb-4">Manage orders, view system metrics, and update menu items.</p>
        {/* ...additional admin components and features... */}
      </div>
    </div>
  );
};

export default AdminDashboard;
