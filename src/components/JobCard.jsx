import React, { useState, useCallback, memo } from "react";
import PropTypes from "prop-types";
import "./JobCard.css";

// Utility function for salary formatting
const formatSalary = (salary) => {
  if (!salary) return "";
  if (typeof salary === "string" && salary.startsWith("₹")) return salary;
  if (!isNaN(Number(salary))) return `₹${Number(salary).toLocaleString()}`;
  return salary;
};

// Utility function for date formatting
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return "Today";
  if (diffDays === 2) return "Yesterday";
  if (diffDays <= 7) return `${diffDays - 1} days ago`;
  return date.toLocaleDateString();
};

const JobCard = memo(({ job, onApply, onDelete, onSave, isSaved = false, showActions = true }) => {
  const [imageError, setImageError] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const companyLogo = job.companyImg;
  const companyInitial = job.company?.[0]?.toUpperCase() || "?";

  // Handle image load error
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Handle apply button click
  const handleApply = useCallback(async () => {
    if (isApplying) return;
    setIsApplying(true);
    try {
      await onApply?.(job);
    } catch (error) {
      console.error("Error applying for job:", error);
    } finally {
      setIsApplying(false);
    }
  }, [isApplying, onApply, job]);

  // Handle delete button click
  const handleDelete = useCallback(async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete?.(job.id || job._id);
    } catch (error) {
      console.error("Error deleting job:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [isDeleting, onDelete, job]);

  // Handle save button click
  const handleSave = useCallback(async () => {
    try {
      await onSave?.(job.id || job._id, !isSaved);
    } catch (error) {
      console.error("Error saving job:", error);
    }
  }, [onSave, job, isSaved]);

  return (
    <article className="adv-job-card" role="article" aria-label={`Job posting for ${job.title} at ${job.company}`}>
      <header className="adv-job-card-header">
        <div className="company-img-holder">
          {companyLogo && !imageError ? (
            <img
              src={companyLogo}
              className="company-img"
              alt={`${job.company} logo`}
              loading="lazy"
              onError={handleImageError}
            />
          ) : (
            <div className="company-img-placeholder" aria-label={`${job.company} company initial`}>
              {companyInitial}
            </div>
          )}
        </div>
        
        <div className="job-card-companymeta">
          <h4 className="company-name">{job.company || "Unknown Company"}</h4>
          {job.category && (
            <span className="job-category" aria-label={`Job category: ${job.category}`}>
              {job.category}
            </span>
          )}
          {job.location && (
            <span className="job-location" aria-label={`Job location: ${job.location}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2C7 2 3 6 3 11c0 5.2 6.4 10.3 7.1 10.8a2 2 0 0 0 2.7 0C14.6 21.3 21 16.2 21 11c0-5-4-9-9-9zm0 15c-3.1 0-6-2.5-6-6s2.9-6 6-6 6 2.5 6 6-2.9 6-6 6z" fill="#8b82d1"/>
                <circle cx="12" cy="11" r="3" fill="#ff4081"/>
              </svg>
              {job.location}
            </span>
          )}
          {job.postedDate && (
            <span className="job-posted-date" aria-label={`Posted ${formatDate(job.postedDate)}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#666"/>
              </svg>
              {formatDate(job.postedDate)}
            </span>
          )}
        </div>
      </header>

      <h3 className="adv-job-title">
        <a href="#" onClick={(e) => e.preventDefault()} aria-label={`View details for ${job.title} position`}>
          {job.title}
        </a>
      </h3>

      {job.salary && (
        <div className="job-salaryline" aria-label={`Salary: ${formatSalary(job.salary)}`}>
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 1.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17z" fill="#835ee0" />
            <text x="7" y="14" fontSize="8" fill="#fff">₹</text>
          </svg>
          <span className="salary">{formatSalary(job.salary)}</span>
          {job.type && (
            <span className="job-type" aria-label={`Employment type: ${job.type}`}>
              {job.type}
            </span>
          )}
        </div>
      )}

      <p className="adv-job-desc" aria-label="Job description">
        {job.desc || job.description || "No description available"}
      </p>

      {job.skills && job.skills.length > 0 && (
        <div className="job-skills" aria-label="Required skills">
          {job.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="skill-tag more-skills" aria-label={`${job.skills.length - 3} more skills`}>
              +{job.skills.length - 3}
            </span>
          )}
        </div>
      )}

      {showActions && (
        <footer className="adv-job-actions">
          <button
            className={`apply-btn ${isApplying ? 'loading' : ''}`}
            onClick={handleApply}
            disabled={isApplying}
            aria-label={`Apply for ${job.title} position`}
            title="Apply for this job"
          >
            {isApplying ? (
              <>
                <span className="loading-spinner" aria-hidden="true"></span>
                Applying...
              </>
            ) : (
              <>
                <span role="img" aria-label="apply">📝</span> Apply
              </>
            )}
          </button>
          
          {onSave && (
            <button
              className={`save-btn ${isSaved ? 'saved' : ''}`}
              onClick={handleSave}
              aria-label={isSaved ? `Remove ${job.title} from saved jobs` : `Save ${job.title} for later`}
              title={isSaved ? "Remove from saved" : "Save for later"}
            >
              <span role="img" aria-label={isSaved ? "unsave" : "save"}>
                {isSaved ? "❤️" : "🤍"}
              </span>
            </button>
          )}
          
          {!job.isApi && onDelete && (
            <button
              className={`delete-btn ${isDeleting ? 'loading' : ''}`}
              onClick={handleDelete}
              disabled={isDeleting}
              aria-label={`Delete ${job.title} job posting`}
              title="Delete this job"
            >
              {isDeleting ? (
                <>
                  <span className="loading-spinner" aria-hidden="true"></span>
                  Deleting...
                </>
              ) : (
                <span role="img" aria-label="delete">🗑️</span>
              )}
            </button>
          )}
        </footer>
      )}
    </article>
  );
});

JobCard.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.string,
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
    company: PropTypes.string,
    companyImg: PropTypes.string,
    category: PropTypes.string,
    location: PropTypes.string,
    salary: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string,
    desc: PropTypes.string,
    description: PropTypes.string,
    skills: PropTypes.arrayOf(PropTypes.string),
    postedDate: PropTypes.string,
    isApi: PropTypes.bool
  }).isRequired,
  onApply: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
  isSaved: PropTypes.bool,
  showActions: PropTypes.bool
};

JobCard.defaultProps = {
  isSaved: false,
  showActions: true
};

JobCard.displayName = "JobCard";

export default JobCard;
