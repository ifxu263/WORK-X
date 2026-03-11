import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Applicants.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function Applicants() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/applications`);
        const data = await res.json();
        setApps(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Applicants load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  return (
    <div className="applicants-page">
      <h1 className="applicants-title">Job Applicants</h1>

      {loading ? (
        <div className="applicants-empty">Loading applicants...</div>
      ) : apps.length === 0 ? (
        <div className="applicants-empty">No applications yet.</div>
      ) : (
        <div className="applicants-grid">
          {apps.map((a) => (
            <motion.div
              key={a._id}
              className="applicant-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="applicant-name">{a.name}</div>

              <div className="applicant-email">{a.email}</div>

              <div className="applicant-job">
                Applied for: <span>{a.jobTitle}</span>
              </div>

              <div className="applicant-msg">{a.message}</div>

              <div className="applicant-date">
                {new Date(a.createdAt).toLocaleDateString()}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Applicants;