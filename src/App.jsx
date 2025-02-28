import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  StatusPage
} from "./pages";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import CategoryList from "./components/menu-browsing/CategoryList";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { MenuProvider } from "./contexts/MenuContext.jsx";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <CartProvider>
          <MenuProvider>
          <Router>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<h1>Services</h1>} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/auth/login" element={<AuthPage variant='signin' />} />
                <Route path="/auth/register" element={<AuthPage variant='signup'/>} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/categories/" element={<CategoryList />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="admin" element={<AdminPage />} />
                <Route path="status" element={<StatusPage />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </ErrorBoundary>
            <ToastContainer />
          </Router>
          </MenuProvider>
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
