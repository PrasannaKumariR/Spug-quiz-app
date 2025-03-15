import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  // Fetch profile information on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('/api/users/get-user-info', {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setProfile(response.data.data);
          setFormData({
            name: response.data.data.name,
            email: response.data.data.email,
          });
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to update the profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/users/update-profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setProfile(response.data.data);
        setEditMode(false);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  if (loading) return <div>loader</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="profile-page" style={styles.container}>
      <h2 style={styles.heading}>Profile</h2>
      {editMode ? (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>Save</button>
          <button type="button" onClick={toggleEditMode} style={styles.buttonCancel}>Cancel</button>
        </form>
      ) : (
        <div style={styles.profileInfo}>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Admin:</strong> {profile.isAdmin ? 'Yes' : 'No'}</p>
          <p><strong>Joined:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
          <button onClick={toggleEditMode} style={styles.button}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

// Styling that matches the login theme
const styles = {
  container: {
    backgroundColor: '#0f3640',  // Dark teal background
    color: '#FFFFFF',  // White text for contrast
    padding: '20px',
    borderRadius: '10px',
    width: '300px',
    margin: '0 auto',
    marginTop: '50px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '20px',
    borderBottom: '1px solid #ffffff',  // Underline effect
    paddingBottom: '10px',
  },
  profileInfo: {
    textAlign: 'left',
    fontSize: '18px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '10px',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ffffff',
    color: '#0f3640',
    width: '100%',
  },
  button: {
    padding: '10px',
    backgroundColor: '#00b894',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  buttonCancel: {
    padding: '10px',
    backgroundColor: '#d63031',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  }
};

export default Profile;
