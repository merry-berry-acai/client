import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MenuPage from "./pages/MenuPage";
import ContactPage from "./pages/ContactPage";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Cart from "./pages/CartPage"; // added import
import PageNotFound from "./pages/404Page";
import CategoryList from "./components/menu-browsing/CategoryList";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<h1>Services</h1>} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/auth/login" element={<AuthPage />} />
          <Route path="/auth/register" element={<AuthPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/categories/" element={<CategoryList />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<PageNotFound />} />
        
        </Routes>
        <ToastContainer />
      </Router>
      <ToastContainer />
      </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
