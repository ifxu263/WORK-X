// src/pages/PostJob.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/iconcopy.png";
import "./PostJob.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const PostJob = () => {
  const navigate = useNavigate();
  const [job, setJob] = useState({
    title: "",
    company: "",
    category: "",
    location: "",
    address: "",
    type: "",
    salary: "",
    contact: "",
    desc: "",
    companyImg: "",
  });
  const [previewImg, setPreviewImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setJob((prev) => ({ ...prev, companyImg: reader.result }));
      setPreviewImg(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to post job");
      }
      setMsg("✅ Job posted!");
      setTimeout(() => {
        navigate("/"); // Redirect to home page
      }, 700);
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-horizontal-page">
      <form className="post-job-horizontal-form" onSubmit={handleSubmit}>
        {/* LEFT: LOGO + IMAGE UPLOAD */}
        <div className="pj-horizontal-left">
          <img src={logo} alt="Site-Logo" className="pj-brand-logo" />
          <div className="pj-img-upload">
            <label className="pj-label" htmlFor="companyImg">
              {previewImg ? (
                <img
                  src={previewImg}
                  className="pj-img-preview"
                  alt="Preview"
                />
              ) : (
                <span className="pj-upload-illustration">+</span>
              )}
              <input
                id="companyImg"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
            <div className="pj-img-hint">Logo / Banner</div>
          </div>
          {msg && <div className="pj-msg">{msg}</div>}
        </div>

        {/* RIGHT: FORM FIELDS */}
        <div className="pj-horizontal-right">
          <h2 className="pj-form-title">Post a Job</h2>
          <div className="pj-row-group">
            <div className="pj-form-row">
              <input
                required
                name="title"
                value={job.title}
                onChange={handleChange}
                placeholder="Job Title*"
              />
            </div>
            <div className="pj-form-row">
              <input
                required
                name="company"
                value={job.company}
                onChange={handleChange}
                placeholder="Company / Shop Name*"
              />
            </div>
          </div>

          <div className="pj-row-group">
            <div className="pj-form-row">
              <select
                required
                name="category"
                value={job.category}
                onChange={handleChange}
              >
                <option value="">Category*</option>
                <option>Retail/Store</option>
                <option>Services</option>
                <option>Hospitality</option>
                <option>Education/Teaching</option>
                <option>Medical/Healthcare</option>
                <option>Delivery/Logistics</option>
                <option>Sales/Marketing</option>
                <option>IT/Software</option>
                <option>Finance/Accounts</option>
                <option>Administration</option>
                <option>Repairs/Maintenance</option>
                <option>Beauty/Salon</option>
                <option>Driver/Transport</option>
                <option>Others</option>
              </select>
            </div>
            <div className="pj-form-row">
              <input
                required
                name="location"
                value={job.location}
                onChange={handleChange}
                placeholder="City / Location*"
              />
            </div>
            <div className="pj-form-row">
              <input
                required
                name="address"
                value={job.address}
                onChange={handleChange}
                placeholder="Full Address*"
              />
            </div>
          </div>

          <div className="pj-row-group">
            <div className="pj-form-row">
              <select
                required
                name="type"
                value={job.type}
                onChange={handleChange}
              >
                <option value="">Job Type*</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Temporary</option>
              </select>
            </div>
            <div className="pj-form-row">
              <input
                required
                name="salary"
                value={job.salary}
                onChange={handleChange}
                type="text"
                placeholder="Salary* (e.g. ₹12000/month)"
              />
            </div>
            <div className="pj-form-row">
              <input
                required
                name="contact"
                value={job.contact}
                onChange={handleChange}
                type="tel"
                placeholder="Contact Number*"
                pattern="[0-9+\-\s]{8,15}"
              />
            </div>
          </div>

          <div className="pj-form-row">
            <textarea
              required
              name="desc"
              value={job.desc}
              onChange={handleChange}
              placeholder="Description*"
              rows={3}
            />
          </div>

          <button type="submit" disabled={loading} className="pj-form-btn">
            {loading ? "Posting..." : "Post Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
