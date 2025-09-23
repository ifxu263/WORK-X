import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/icon.png";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userInitial = user?.name ? user.name[0].toUpperCase() : user?.email ? user.email.toUpperCase() : "U";
  const profileTooltip = user?.name ? user.name + (user?.email ? ` (${user.email})` : "") : user?.email || "Profile";

  return (
    <motion.nav className="navbar" initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
      <motion.div className="brand" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
        <img src={logo} alt="JobFinder Logo" className="logo" />
        <span className="finder">Nanded JOB Finder</span>
      </motion.div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/postjob">Post Job</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        {!user ? (
          <Link to="/login">
            <motion.button className="login-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Login
            </motion.button>
          </Link>
        ) : (
          <div className="profile-actions">
            <span className="profile-icon"
                  onClick={() => navigate("/profile")}
                  title={profileTooltip}
                  tabIndex={0}
                  role="button"
                  aria-label="Profile"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "#6843c6",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "1.18em",
                    cursor: "pointer",
                    marginRight: "9px"
                  }}>
              {userInitial}
            </span>
            <motion.button className="logout-btn"
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.97 }}
                           onClick={logout}
                           style={{
                             background: "#ff4081",
                             borderRadius: "6px",
                             border: "none",
                             color: "#fff",
                             fontWeight: 600,
                             padding: "0.36em 1em",
                             cursor: "pointer"
                           }}>
              Logout
            </motion.button>
          </div>
        )}
      </div>
    </motion.nav>
  );
}

export default Navbar;
