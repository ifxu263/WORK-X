import "./ApplyForm.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function ApplyForm({ job, onClose }) {
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);

  if (!job) {
    return (
      <motion.div className="apply-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2>No Job Selected</h2>
        <p>Please go back and select a job to apply for.</p>
        <button onClick={() => { onClose(); navigate("/jobs"); }}>Go Back to Jobs</button>
      </motion.div>
    );
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name: formState.name,
      email: formState.email,
      message: formState.message,
      job_id: job._id || job.id
    };

    try {
      const res = await fetch(`${API_BASE}/api/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed");
      alert("Application submitted!");
      onClose();
      navigate("/jobs");
    } catch {
      alert("Application failed! Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div className="apply-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2>Apply for {job.title}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formState.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formState.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Why are you a good fit?"
          value={formState.message}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
        <button type="button" onClick={onClose} style={{marginLeft: '10px'}}>
          Close
        </button>
      </form>
    </motion.div>
  );
}

export default ApplyForm;
