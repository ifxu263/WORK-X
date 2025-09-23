import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: ""
  });
  const [editMode, setEditMode] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("info"); // success, error, info
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(null);

  // Show message with type
  const showMessage = useCallback((message, type = "info") => {
    setMsg(message);
    setMsgType(type);
    if (type === "success") {
      setTimeout(() => setMsg(""), 3000);
    }
  }, []);

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    try {
      // Get user from localStorage to get email
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        showMessage("You must login first.", "error");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      const userData = JSON.parse(storedUser);
      const res = await fetch(`${API_BASE}/api/auth/profile?email=${userData.email}`, {
        credentials: "include",
      });

      if (res.status === 401) {
        showMessage("You must login first.", "error");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.user) {
        setProfile(data.user);
        setOriginalProfile(data.user);
        showMessage("", "");
      } else {
        showMessage("Invalid user! Please login.", "error");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      showMessage("Unable to fetch profile. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [navigate, showMessage]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = e => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    
    if (!file) {
      setAvatarFile(null);
      setAvatarPreview("");
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showMessage("Please select a valid image file.", "error");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showMessage("Image size should be less than 5MB.", "error");
      return;
    }

    setAvatarFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.onerror = () => showMessage("Error reading image file.", "error");
    reader.readAsDataURL(file);
  };

  const handleUpdate = async e => {
    e.preventDefault();
    
    if (saving) return;
    
    setSaving(true);
    showMessage("Saving changes...", "info");

    try {
      const updatedProfile = {
        name: profile.name.trim(),
        avatar: profile.avatar
      };

      if (avatarFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          updatedProfile.avatar = reader.result;
          sendUpdate(updatedProfile);
        };
        reader.onerror = () => {
          showMessage("Error processing image.", "error");
          setSaving(false);
        };
        reader.readAsDataURL(avatarFile);
      } else {
        await sendUpdate(updatedProfile);
      }
    } catch (error) {
      console.error("Update error:", error);
      showMessage("Failed to update profile.", "error");
      setSaving(false);
    }
  };

  const sendUpdate = async (updatedProfile) => {
    try {
      // Get user email from localStorage
      const storedUser = localStorage.getItem("user");
      const userData = JSON.parse(storedUser);
      
      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updatedProfile,
          email: userData.email
        }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        setProfile(data.user);
        setOriginalProfile(data.user);
        showMessage("Profile updated successfully! ✨", "success");
        setEditMode(false);
        setAvatarFile(null);
        setAvatarPreview("");
      } else {
        showMessage(data.error || "Update failed. Please try again.", "error");
      }
    } catch (error) {
      console.error("Server error:", error);
      showMessage("Server error. Please try again later.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setAvatarPreview("");
    setAvatarFile(null);
    setProfile(originalProfile || { name: "", email: "", avatar: "" });
    showMessage("", "");
  };

  const handleLogout = () => {
    // Clear any stored tokens/cookies
    fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      navigate("/login");
    });
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-card">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  const avatarSrc = avatarPreview || profile.avatar || "https://via.placeholder.com/120/6a32b2/ffffff?text=👤";

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>My Profile</h2>
          <div className="profile-avatar-container">
            <img
              src={avatarSrc}
              alt={`${profile.name || 'User'}'s profile picture`}
              className="profile-img"
            />
            {editMode && (
              <div className="avatar-overlay">
                <span>📷</span>
              </div>
            )}
          </div>
        </div>

        {!editMode ? (
          <div className="profile-info">
            <div className="info-item">
              <label>Name</label>
              <p>{profile.name || "Not set"}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{profile.email || "Not set"}</p>
            </div>
            
            <div className="profile-actions">
              <button 
                onClick={() => setEditMode(true)} 
                className="profile-btn primary"
                disabled={saving}
              >
                ✏️ Edit Profile
              </button>
              <button 
                onClick={handleLogout} 
                className="profile-btn secondary"
                disabled={saving}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={profile.name}
                placeholder="Enter your name"
                onChange={handleChange}
                required
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="avatar">Profile Picture</label>
              <div className="file-input-wrapper">
                <input
                  id="avatar"
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={saving}
                />
                <div className="file-input-label">
                  {avatarFile ? avatarFile.name : "Choose an image"}
                </div>
              </div>
              {avatarFile && (
                <p className="file-info">
                  Selected: {avatarFile.name} ({(avatarFile.size / 1024 / 1024).toFixed(2)}MB)
                </p>
              )}
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="profile-btn primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="loading-spinner small"></span>
                    Saving...
                  </>
                ) : (
                  "💾 Save Changes"
                )}
              </button>
              <button
                type="button"
                className="profile-btn secondary"
                onClick={handleCancel}
                disabled={saving}
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        )}

        {msg && (
          <div className={`profile-msg ${msgType}`}>
            <span className="msg-icon">
              {msgType === "success" ? "✅" : msgType === "error" ? "❌" : "ℹ️"}
            </span>
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}
