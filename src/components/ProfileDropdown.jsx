import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProfileDropdown = ({ profileInitial }) => {
  const [open, setOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative profile-dropdown" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {profileInitial}
      </button>
      {open && (
        <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
          <li className="px-4 py-2 hover:bg-gray-100">
            <Link to="/profile">Profile</Link>
          </li>
          <li className="px-4 py-2 hover:bg-gray-100">
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ProfileDropdown;
