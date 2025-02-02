import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="bg-purple-400 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/logo.png" 
            alt="Merry Berry Logo" 
            className="h-12 w-12"
          />
          <span className="text-2xl font-bold text-gray-800">
            Merry Berry
          </span>
        </Link>
        <div className="flex space-x-4">
          <Link to="/order" className="bg-purple-600 text-white px-6 py-2 rounded-full 
            hover:bg-purple-700 transition-colors shadow-md">
            Order Now
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Header;