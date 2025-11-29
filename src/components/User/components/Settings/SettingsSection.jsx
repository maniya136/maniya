import React, { useEffect, useState } from 'react';
import { userApi } from '../../../../services/api';
import './SettingsSection.css';

export const SettingsSection = () => {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await userApi.getProfile();
        setProfile({ name: data.name || '', email: data.email || '' });
      } catch (err) {
        setMessage(err?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await userApi.updateProfile(profile);
      setMessage('Profile updated');
    } catch (err) {
      setMessage(err?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="uds-grid">
      <form className="uds-form" onSubmit={handleSave}>
        <div className="uds-field-grid">
          <div className="uds-field">
            <label>Name</label>
            <input name="name" value={profile.name} onChange={handleChange} />
          </div>
          <div className="uds-field">
            <label>Email</label>
            <input name="email" value={profile.email} onChange={handleChange} disabled />
          </div>
        </div>
        <button className="uds-primary" type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save changes'}
        </button>
        {message && <div className="uds-message">{message}</div>}
      </form>
    </div>
  );
};
