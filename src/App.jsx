import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { 
  HomePage, 
  AboutPage, 
  MenuPage, 
  ContactPage, 
  CartPage, 
  PageNotFound, 
  ProfilePage, 
  AuthPage, 
  AdminPage,
  StatusPage,
  CheckoutPage
} from "./pages";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import CategoryList from "./components/menu-browsing/CategoryList";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { MenuProvider } from "./contexts/MenuContext.jsx";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import AdminRoute from "./components/routing/AdminRoute";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { FirebaseProvider } from "./contexts/FirebaseContext";

function App() {
  return (
    <div className="App">
      <SnackbarProvider>
        <AuthProvider>
          <FirebaseProvider>
            <CartProvider>
              <MenuProvider>
                <Router>
                  <ErrorBoundary>
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
                  </ErrorBoundary>
                </Router>
              </MenuProvider>
            </CartProvider>
          </FirebaseProvider>
        </AuthProvider>
      </SnackbarProvider>
    </div>
  );
}

export default App;
