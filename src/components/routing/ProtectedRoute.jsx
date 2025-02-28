import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { CircularProgress, Container, Typography } from "@mui/material";
import Layout from "../Layout";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
        <Layout>
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress sx={{ color: 'purple' }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Checking authentication...
        </Typography>
      </Container>
    </Layout>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  // Render child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
