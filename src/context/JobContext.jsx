import React, { createContext, useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/jobs`);
        if (!res.ok) throw new Error("Network response not ok");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const addJob = async (job) => {
    try {
      const res = await fetch(`${API_BASE}/api/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });
      if (!res.ok) throw new Error("Job not added");
      const newJob = await res.json();
      setJobs((prev) => [newJob, ...prev]);
    } catch (err) {
      alert("Failed to add job.");
    }
  };

  const deleteJob = async (id) => {
    try {
      await fetch(`${API_BASE}/api/jobs/${id}`, { method: "DELETE" });
      setJobs((prev) => prev.filter((job) => job._id !== id));
    } catch {
      alert("Failed to delete job.");
    }
  };

  return (
    <JobContext.Provider value={{ jobs, addJob, deleteJob, loading }}>
      {children}
    </JobContext.Provider>
  );
};
