import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Contact.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" }); // reset form
      } else {
        setMsg(data.error || "Failed to send message.");
      }
    } catch (error) {
      setMsg("Server error. Please try again later.");
    }
  };

  return (
    <div className="contact-wrapper">
      <motion.div
        className="contact-left"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="contact-heading">
          Let's Build <span>Together</span>
        </h1>
        <p className="contact-subtext">Drop a message, and let’s create something amazing.</p>
      </motion.div>

      <motion.form
        className="contact-form"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message..."
          rows={4}
          value={formData.message}
          onChange={handleChange}
          required
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Send Message
        </motion.button>
        {msg && <p style={{ marginTop: "12px", color: msg.includes("error") ? "red" : "green" }}>{msg}</p>}
      </motion.form>
    </div>
  );
}

export default Contact;
