import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { CircularProgress, Container, Typography } from "@mui/material";
import Layout from "../Layout";

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
        <Layout>
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress sx={{ color: 'purple' }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Verifying permissions...
        </Typography>
      </Container>
      </Layout>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  // Redirect to home if authenticated but not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // Render child routes if user is admin
  return <Outlet />;
};

export default AdminRoute;
