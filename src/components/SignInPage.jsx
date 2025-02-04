import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const SignInPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(credentials.username, credentials.password)
      .then(() => navigate("/admin"))
      .catch(() => alert("Invalid credentials"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Username:</label>
            <input
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Password:</label>
            <input
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
