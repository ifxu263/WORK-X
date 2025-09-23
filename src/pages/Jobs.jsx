import React, { useState, useEffect } from "react";
import JobCard from "../components/JobCard";
import "./Jobs.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      const app_id = "c67068bf";    // <-- Replace Adzuna App ID
      const app_key = "565a29974705aac8eb5e3fe2e1752d09";  // <-- Replace Adzuna App Key
      const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${app_id}&app_key=${app_key}&results_per_page=8&what=developer&where=india`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setJobs(data.results);
      } catch (error) {
        alert("API Error: " + error.message);
        setJobs([]);
      }
      setLoading(false);
    }
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) =>
    (job.company.display_name && job.company.display_name.toLowerCase().includes(filter.toLowerCase())) ||
    (job.location.display_name && job.location.display_name.toLowerCase().includes(filter.toLowerCase())) ||
    (job.title && job.title.toLowerCase().includes(filter.toLowerCase()))
  );

  function handleApply(job) {
    window.open(job.redirect_url, "_blank");
  }

  return (
    <div className="jobs-page">
      <div className="jobs-container">
        <h1 className="jobs-title">JOBS BY NANDED JOB FINDER</h1>
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search company, location, etc..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="job-list">
          {loading ? (
            <div>Loading jobs...</div>
          ) : filteredJobs.length ? (
            filteredJobs.map(job => (
              <JobCard
                key={job.id}
                job={{
                  title: job.title,
                  company: job.company.display_name,
                  location: job.location.display_name,
                  description: job.description,
                  id: job.id
                }}
                onApply={() => handleApply(job)}
              />
            ))
          ) : (
            <div>No jobs found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Jobs;
