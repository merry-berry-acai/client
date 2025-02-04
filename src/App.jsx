import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import AboutPage from "./components/AboutPage";
import Header from "./components/Navigation";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MenuPage from "./components/MenuPage";
import ContactPage from "./components/ContactPage";
import AdminDashboard from "./components/AdminDashboard";
import SignInPage from "./components/SignInPage";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Cart from "./components/CartPage"; // added import

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <CartProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<h1>Services</h1>} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/cart" element={<Cart />} /> {/* added route */}
          <Route path="*" element="404 Not Found" />
        </Routes>
        <Footer />
        <ToastContainer />
      </Router>
      </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
