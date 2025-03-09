import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { lazy, Suspense } from 'react';
// import {
//   HomePage,
//   AboutPage,
//   MenuPage,
//   ContactPage,
//   CartPage,
//   PageNotFound,
//   ProfilePage,
//   AuthPage,
//   AdminPage,
//   StatusPage,
//   CheckoutPage
// } from "./pages";

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const MenuPage = lazy(() => import('./pages/MenuPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const PageNotFound = lazy(() => import('./pages/404Page'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const StatusPage = lazy(() => import('./pages/StatusPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { MenuProvider } from "./contexts/MenuContext";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { CategoryList } from "./components/menu-browsing";
import { ErrorBoundary, ProtectedRoute, AdminRoute } from "./components";

function App() {
  return (
    <div className="App">
      <SnackbarProvider>
        <AuthProvider>
          <MenuProvider>
            <CartProvider>
              <Router>
                <ErrorBoundary>
                  <Suspense fallback={<div>Loading pages...</div>}>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/services" element={<h1>Services</h1>} />
                      <Route path="/menu" element={<MenuPage />} />
                      <Route path="/auth/login" element={<AuthPage variant='signin' />} />
                      <Route path="/auth/register" element={<AuthPage variant='signup'/>} />
                      <Route path="/cart" element={<CartPage />} />
                      
                      <Route path="/categories" element={<CategoryList />} />
                      <Route path="/status" element={<StatusPage />} />
                      
                      {/* Protected routes - require authentication */}
                      <Route element={<ProtectedRoute />}>
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                      </Route>
                      
                      {/* Admin routes - require authentication and admin permission */}
                      <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<AdminPage />} />
                      </Route>
                      
                      <Route path="*" element={<PageNotFound />} />
                    </Routes>
                  </Suspense>
                  </ErrorBoundary>
              </Router>
            </CartProvider>
          </MenuProvider>
        </AuthProvider>
      </SnackbarProvider>
    </div>
  );
}

export default App;
