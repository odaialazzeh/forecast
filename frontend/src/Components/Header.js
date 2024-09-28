import * as React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo from "../Assets/logo.svg";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout as logoutAction } from "../slices/authSlice";
import { FaBars, FaTimes } from "react-icons/fa"; // Icons for mobile menu

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State to toggle mobile menu
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.auth.userInfo);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAction());
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout: ", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="py-4 mb-12 border-b shadow-sm">
      <div className="ml-2 flex justify-between items-center">
        <div className="container mx-auto flex justify-between items-center gap-6">
          <Link to="/">
            <img src={logo} alt="Logo" className="w-40 h-16" />
          </Link>

          {/* Hamburger icon for mobile */}
          <button
            className="text-3xl md:hidden focus:outline-none" // Show on screens less than 768px
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Links for larger screens (768px and above) */}
          <nav className="hidden md:flex gap-6">
            <Link to="/">Home</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/accountLog">Account Log</Link>
            {userInfo?.isAdmin ? (
              <Link to="/activityLog">Activity Log</Link>
            ) : (
              ""
            )}
          </nav>
        </div>

        <div className="mr-4 hidden md:block">
          <a
            onClick={handleLogout}
            className="bg-primary hover:bg-secondary text-white p-2 shadow-md rounded-lg transition cursor-pointer"
          >
            Logout
          </a>
        </div>
      </div>

      {/* Mobile menu for screens less than 768px */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-white shadow-md mt-4 py-4">
          <ul className="flex flex-col items-center gap-4">
            <Link to="/" onClick={toggleMobileMenu}>
              Home
            </Link>
            <Link to="/profile" onClick={toggleMobileMenu}>
              Profile
            </Link>
            <Link to="/accountLog" onClick={toggleMobileMenu}>
              Account Log
            </Link>
            {userInfo?.isAdmin ? (
              <Link to="/activityLog" onClick={toggleMobileMenu}>
                Activity Log
              </Link>
            ) : (
              ""
            )}
            <a
              onClick={() => {
                toggleMobileMenu();
                handleLogout();
              }}
              className="bg-primary hover:bg-secondary text-white p-2 shadow-md rounded-lg transition cursor-pointer"
            >
              Logout
            </a>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
