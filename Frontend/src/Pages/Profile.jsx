import React, { useState, useEffect } from "react";
import { Camera, Edit2, Plus } from "lucide-react";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newLearningSkill, setNewLearningSkill] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.email) {
          alert("User not logged in");
          return;
        }

        const res = await fetch(
          `http://localhost:5000/api/users/${user.email}`
        );
        const data = await res.json();

        if (res.ok) {
          setProfile(data.user);
        } else {
          alert(data.message || "Failed to fetch profile");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        alert("Something went wrong");
      }
    };

    fetchProfile();
  }, []);

  const handleAddSkill = (e) => {
    if (e.key === "Enter" && newSkill.trim()) {
      setProfile((prev) => ({
        ...prev,
        knownSkills: [...prev.knownSkills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleAddLearningSkill = (e) => {
    if (e.key === "Enter" && newLearningSkill.trim()) {
      setProfile((prev) => ({
        ...prev,
        wantToLearn: [...prev.wantToLearn, newLearningSkill.trim()],
      }));
      setNewLearningSkill("");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Profile updated successfully!");
        setIsEditing(false);
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Something went wrong");
    }
  };

  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("Please select an image to upload");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("email", profile.email);

    try {
      const res = await fetch(
        "http://localhost:5000/api/photo/upload-profile-photo",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Profile photo uploaded successfully!");
        setProfile((prev) => ({
          ...prev,
          profilePhotoUrl: data.profilePhotoUrl,
        }));
      } else {
        alert(data.message || "Failed to upload profile photo");
      }
    } catch (err) {
      console.error("Error uploading profile photo:", err);
      alert("Something went wrong");
    }
  };

  const handleCoverPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("Please select an image to upload");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("email", profile.email);

    try {
      const res = await fetch(
        "http://localhost:5000/api/photo/upload-cover-photo",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Cover photo uploaded successfully!");
        setProfile((prev) => ({
          ...prev,
          coverPhotoUrl: data.coverPhotoUrl,
        }));
      } else {
        alert(data.message || "Failed to upload cover photo");
      }
    } catch (err) {
      console.error("Error uploading cover photo:", err);
      alert("Something went wrong");
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="card profile-header">
        <div className="cover-image">
          <img
            src={profile.coverPhotoUrl}
            alt="Cover"
            className="cover-photo"
          />
          {isEditing && (
            <button
              onClick={() =>
                document.getElementById("cover-photo-upload").click()
              }
              className="camera-btn"
            >
              <Camera size={20} />
            </button>
          )}
          <input
            type="file"
            id="cover-photo-upload"
            accept="image/*"
            onChange={handleCoverPhotoUpload}
            className="upload-input"
            style={{ display: "none" }}
          />
        </div>
        <div className="profile-content">
          <div className="avatar-section">
            <div className="avatar-wrapper">
              <img
                src={profile.profilePhotoUrl}
                alt={profile.name}
                className="avatar"
              />
              {isEditing && (
                <button
                  onClick={() =>
                    document.getElementById("profile-photo-upload").click()
                  }
                  className="small-camera-btn"
                >
                  <Camera size={16} />
                </button>
              )}
              <input
                type="file"
                id="profile-photo-upload"
                accept="image/*"
                onChange={handleProfilePhotoUpload}
                className="upload-input"
                style={{ display: "none" }}
              />
            </div>
            <div className="profile-info">
              <div className="profile-top-row">
                <div>
                  <h1 className="profile-name">{profile.name}</h1>
                  <p className="profile-email">{profile.email}</p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="edit-btn"
                >
                  <Edit2 size={16} />
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </button>
              </div>
            </div>
          </div>
          <div className="profile-bio">
            <h3>About</h3>
            {isEditing ? (
              <textarea
                value={profile.about}
                onChange={(e) =>
                  setProfile({ ...profile, about: e.target.value })
                }
                rows={4}
              />
            ) : (
              <p>{profile.about}</p>
            )}
            <div className="profile-grid">
              <div>
                <h4>College</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.college}
                    onChange={(e) =>
                      setProfile({ ...profile, college: e.target.value })
                    }
                  />
                ) : (
                  <p>{profile.college}</p>
                )}
              </div>
              <div>
                <h4>Branch</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.branch}
                    onChange={(e) =>
                      setProfile({ ...profile, branch: e.target.value })
                    }
                  />
                ) : (
                  <p>{profile.branch}</p>
                )}
              </div>
              <div>
                <h4>Year</h4>
                {isEditing ? (
                  <input
                    type="number"
                    value={profile.year}
                    onChange={(e) =>
                      setProfile({ ...profile, year: e.target.value })
                    }
                  />
                ) : (
                  <p>{profile.year}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="card">
        <div className="card-content">
          <h2>Skills</h2>
          <div className="skills-section">
            <div>
              <h3>Known Skills</h3>
              <div className="skill-tags">
                {profile.knownSkills.map((skill, index) => (
                  <span key={index} className="skill known">
                    {skill}
                  </span>
                ))}
                {isEditing && (
                  <div className="input-skill-wrapper">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={handleAddSkill}
                      placeholder="Add skill..."
                    />
                    <Plus size={14} className="plus-icon" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3>Want to Learn</h3>
              <div className="skill-tags">
                {profile.wantToLearn.map((skill, index) => (
                  <span key={index} className="skill learning">
                    {skill}
                  </span>
                ))}
                {isEditing && (
                  <div className="input-skill-wrapper">
                    <input
                      type="text"
                      value={newLearningSkill}
                      onChange={(e) => setNewLearningSkill(e.target.value)}
                      onKeyDown={handleAddLearningSkill}
                      placeholder="Add skill to learn..."
                    />
                    <Plus size={14} className="plus-icon" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="profile-actions">
          <button onClick={() => setIsEditing(false)} className="cancel-btn">
            Cancel
          </button>
          <button onClick={handleUpdateProfile} className="save-btn">
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
