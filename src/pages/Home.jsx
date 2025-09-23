import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import JobCard from "../components/JobCard";
import ApplyForm from "./ApplyForm";
import "./Home.css";
import { useAuth } from "../context/AuthContext";

// Logo imports
import a2logo from "../assets/a2.svg";
import amez6logo from "../assets/amez6.svg";
import apple5logo from "../assets/apple5.svg";
import f4logo from "../assets/f4.svg";
import gog7logo from "../assets/gog7.svg";
import m1logo from "../assets/m1.svg";
import t3logo from "../assets/t3.svg";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function Home() {
  const [filter, setFilter] = useState("");
  const [applyJob, setApplyJob] = useState(null);
  const [user, setUser] = useState(null);
  const [apiJobs, setApiJobs] = useState([]);
  const [dbJobs, setDbJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchDbJobs() {
    try {
      const res = await fetch(`${API_BASE}/api/jobs`);
      if (!res.ok) throw new Error("API Error");
      const json = await res.json();
      setDbJobs(Array.isArray(json) ? json : json.data || []);
    } catch (err) {
      console.error("DB jobs error:", err);
      setDbJobs([]);
    }
  }

  async function fetchApiJobs() {
    try {
      const app_id = "c67068bf";
      const app_key = "565a29974705aac8eb5e3fe2e1752d09";
      const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${app_id}&app_key=${app_key}&results_per_page=8&what=developer&where=india`;
      const response = await fetch(url);
      const data = await response.json();
      setApiJobs(Array.isArray(data.results) ? data.results : []);
    } catch (err) {
      console.error("Adzuna API error:", err);
      setApiJobs([]);
    }
  }

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchApiJobs(), fetchDbJobs()]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const allJobs = [
    ...apiJobs.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company?.display_name,
      location: job.location?.display_name,
      description: job.description,
      isApi: true,
      redirect_url: job.redirect_url,
    })),
    ...dbJobs.map((job) => ({
      id: job._id,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.desc || job.description,
      isApi: false,
      salary: job.salary,
      type: job.type,
      contact: job.contact,
      address: job.address,
      companyImg: job.companyImg,
    })),
  ];

  const filteredJobs = allJobs.filter(
    (job) =>
      (job.company && job.company.toLowerCase().includes(filter.toLowerCase())) ||
      (job.location && job.location.toLowerCase().includes(filter.toLowerCase())) ||
      (job.title && job.title.toLowerCase().includes(filter.toLowerCase()))
  );

  const handleApply = (job) => {
    if (!user && job.isApi) {
      window.open(job.redirect_url, "_blank");
      return;
    }
    if (!user) {
      alert("Please login first to apply for jobs.");
      return;
    }
    if (job.isApi) {
      window.open(job.redirect_url, "_blank");
    } else {
      setApplyJob(job);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    await fetch(`${API_BASE}/api/jobs/${id}`, { method: "DELETE" });
    await fetchDbJobs();
  };

  return (
    <motion.div
      className="home-page"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6 }}
    >
      <div className="ads-top-note">
        <span>
          Want your company advertisement here?{" "}
          <Link to="/contact" className="ads-contact-link">
            <b>Contact us</b>
          </Link>
        </span>
      </div>

      <div className="company-logos-slider" aria-label="Company Logos">
        <div className="logos-track" aria-live="off">
          {[a2logo, amez6logo, apple5logo, f4logo, gog7logo, m1logo, t3logo].map((logo, i) => (
            <a key={i} href="#" aria-label={`Company Logo ${i}`} tabIndex={-1}>
              <img src={logo} alt={`Company Logo ${i}`} />
            </a>
          ))}
          {[a2logo, amez6logo, apple5logo, f4logo, gog7logo, m1logo, t3logo].map((logo, i) => (
            <a key={`dup-${i}`} href="#" aria-label={`Company Logo Duplicate ${i}`} tabIndex={-1}>
              <img src={logo} alt={`Company Logo ${i}`} />
            </a>
          ))}
          <span className="advertise-slide" tabIndex={-1} aria-hidden="true">
            Advertise your shop !!
          </span>
          <span className="advertise-slide" tabIndex={-1} aria-hidden="true">
            Advertise your shop !!
          </span>
        </div>
      </div>

      <div className="home-header-row center-row">
        <motion.h1
          className="brand-name"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          Nanded JOB Finder
        </motion.h1>
        <form className="search-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="search"
            className="search-input"
            placeholder="Search jobs, company, etc..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" className="search-btn">
            <span role="img" aria-label="search" style={{ marginRight: "6px", fontSize: "1.19em" }}>
              🔍
            </span>
            Search
          </button>
        </form>
      </div>

      <h2 className="section-title" tabIndex={-1}>
        Latest Opportunities
      </h2>

      <div className="job-list" role="list" aria-live="polite">
        {loading ? (
          <div className="no-jobs-message">Loading jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="no-jobs-message">No jobs found.</div>
        ) : (
          filteredJobs.map((job) => (
            <motion.div
              key={job.id}
              className="home-job-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              role="listitem"
              tabIndex={-1}
            >
              <JobCard
                job={job}
                onApply={() => handleApply(job)}
                onDelete={!job.isApi ? () => handleDeleteJob(job.id) : undefined}
              />
            </motion.div>
          ))
        )}
      </div>

      {applyJob && <ApplyForm job={applyJob} onClose={() => setApplyJob(null)} />}
    </motion.div>
  );
}

export default Home;
