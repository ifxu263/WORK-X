import { motion } from "framer-motion";
import "../pages/About.css"; // Adjust if the path differs




function About() {
  return (
    <motion.div
      className="about-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1
        className="about-title"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        About Nanded Finder
      </motion.h1>

      <motion.p
        className="about-description"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        Nanded Finder is a local platform designed to connect job seekers with employers
        and service providers across Nanded. Our mission is to empower local talent
        by making job and service discovery smoother, faster, and more visually engaging.
      </motion.p>

      <motion.div
        className="created-by"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        CREATED BY IRFAN AND SUFYAN
      </motion.div>
      
    </motion.div>
  );
}

export default About;
