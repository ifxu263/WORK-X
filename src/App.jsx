import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Jobs from "./pages/Jobs";
import ApplyForm from "./pages/ApplyForm";
import Login from "./pages/Login";
import PostJob from "./pages/PostJob";
import Applicants from "./pages/Applicants";

import RecruiterLogin from "./pages/RecruiterLogin";
import RecruiterRegister from "./pages/RecruiterRegister";
import RecruiterDashboard from "./pages/RecruiterDashboard";

import Profile from "./components/Profile";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {

  const location = useLocation();

  return (
    <>
      <Navbar />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          {/* ---------- MAIN PAGES ---------- */}

          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/jobs" element={<Jobs />} />

          {/* ---------- JOB APPLY ---------- */}

          <Route path="/apply" element={<ApplyForm />} />

          {/* ---------- USER AUTH ---------- */}

          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />

          {/* ---------- JOB POST ---------- */}

          <Route path="/postjob" element={<PostJob />} />

          {/* ---------- RECRUITER ---------- */}

          <Route path="/recruiter-login" element={<RecruiterLogin />} />
          <Route path="/recruiter-register" element={<RecruiterRegister />} />
          <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />

          {/* ---------- APPLICANTS ---------- */}

          <Route path="/applicants" element={<Applicants />} />

        </Routes>
      </AnimatePresence>

      <Footer />
    </>
  );

}

export default App;