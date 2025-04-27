import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import './Profile.css';

function UserProfile() {
  const { email } = useParams(); // Get the email parameter from the route
  const [profile, setProfile] = useState(null); // Initially null until data is fetched

  // Fetch user details from the database
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${email}`);
        const data = await res.json();

        if (res.ok) {
          setProfile(data.user);
        } else {
          alert(data.message || 'Failed to fetch profile');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        alert('Something went wrong');
      }
    };

    fetchProfile();
  }, [email]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="card profile-header">
        <div className="cover-image">
          <img src={profile.coverPhotoUrl} alt="Cover" className="cover-photo" />
        </div>
        <div className="profile-content">
          <div className="avatar-section">
            <div className="avatar-wrapper">
              <img src={profile.profilePhotoUrl} alt={profile.name} className="avatar" />
            </div>
            <div className="profile-info">
              <div className="profile-top-row">
                <div>
                  <h1 className="profile-name">{profile.name}</h1>
                  <p className="profile-email">{profile.email}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="profile-bio">
            <h3>About</h3>
            <p>{profile.about}</p>
            <div className="profile-grid">
              <div>
                <h4>College</h4>
                <p>{profile.college}</p>
              </div>
              <div>
                <h4>Branch</h4>
                <p>{profile.branch}</p>
              </div>
              <div>
                <h4>Year</h4>
                <p>{profile.year}</p>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;