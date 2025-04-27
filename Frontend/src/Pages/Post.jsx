import React, { useState } from 'react';
import './Post.css';

const postTypes = [
  { id: 'study', name: 'Study Partner', color: 'study' },
  { id: 'guide', name: 'Guide', color: 'guide' },
  { id: 'collaborator', name: 'Collaborator', color: 'collaborator' },
  { id: 'internship', name: 'Internship Partner', color: 'internship' },
];

function Post() {
  const [postType, setPostType] = useState('');
  const [content, setContent] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Fetch user email from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.email) {
      alert("User not logged in");
      return;
    }

    const postData = {
      email: user.email,
      postType,
      content,
      skills,
    };

    try {
      const res = await fetch("http://localhost:5000/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Post created successfully!");
        setPostType("");
        setContent("");
        setSkills([]);
      } else {
        alert(data.message || "Failed to create post");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="post-container">
      <h2 className="post-heading">Create a New Post</h2>
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label className="form-label">Post Type</label>
          <div className="post-type-grid">
            {postTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setPostType(type.id)}
                className={`post-type-button ${postType === type.id ? 'selected' : ''}`}
              >
                <span className={`post-type-label ${type.color}`}>
                  {type.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="content" className="form-label">Post Content</label>
          <textarea
            id="content"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="textarea"
            placeholder="Describe what you're looking for..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="skills" className="form-label">Related Skills</label>
          <input
            id="skills"
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleAddSkill}
            className="input"
            placeholder="Type a skill and press Enter"
          />
          <div className="skill-list">
            {skills.map(skill => (
              <span key={skill} className="skill-tag">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="remove-skill"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-button">Create Post</button>
      </form>
    </div>
  );
}

export default Post;