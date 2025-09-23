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
import Profile from "./components/Profile"; // import Profile page/component
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


function App() {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/apply" element={<ApplyForm />} />
          <Route path="/postjob" element={<PostJob />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} /> {/* <-- ADD THIS LINE */}
        </Routes>
      </AnimatePresence>
      <Footer />
      
    </>
  );
}

export default App;
