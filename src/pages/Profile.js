import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiCalendar, FiEdit3, FiCheck } from 'react-icons/fi';

const Profile = () => {
  const { user, isAuthenticated, login: updateSession } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getUserProfile(user.id);
      setProfile(res.data);
      setFormData({ name: res.data.name, email: res.data.email });
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await updateUserProfile(user.id, formData);
      // Update localStorage and context
      const updatedUser = { ...user, name: formData.name, email: formData.email };
      localStorage.setItem('bms_user', JSON.stringify(updatedUser));
      const token = localStorage.getItem('bms_token');
      updateSession(updatedUser, token);
      setProfile({ ...profile, name: formData.name, email: formData.email });
      setEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page container" style={{ textAlign: 'center', paddingTop: 80 }}>
        Loading profile...
      </div>
    );
  }

  return (
    <div className="page auth-page" id="profile-page">
      <div className="auth-card animate-fadeInUp" style={{ maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--accent-green))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '2rem',
              fontWeight: 700,
              color: '#fff',
            }}
          >
            {profile?.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="auth-card__title" style={{ marginBottom: 4 }}>
            My Profile
          </h2>
        </div>

        {message && (
          <div style={{
            background: 'rgba(34,197,94,0.1)',
            color: '#22c55e',
            padding: '10px 16px',
            borderRadius: 8,
            marginBottom: 16,
            fontSize: '0.85rem',
            fontWeight: 600,
          }}>
            ✅ {message}
          </div>
        )}
        {error && <div className="alert alert--error">⚠️ {error}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <FiUser size={14} /> Name
            </label>
            {editing ? (
              <input
                className="form-group__input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            ) : (
              <div style={{ padding: '12px 16px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', fontWeight: 500 }}>
                {profile?.name}
              </div>
            )}
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <FiMail size={14} /> Email
            </label>
            {editing ? (
              <input
                className="form-group__input"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            ) : (
              <div style={{ padding: '12px 16px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', fontWeight: 500 }}>
                {profile?.email}
              </div>
            )}
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <FiCalendar size={14} /> Member Since
            </label>
            <div style={{ padding: '12px 16px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', fontWeight: 500, color: 'var(--text-muted)' }}>
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          {editing ? (
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ flex: 1 }}>
                <FiCheck style={{ marginRight: 6 }} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                className="navbar__btn navbar__btn--outline"
                onClick={() => { setEditing(false); setFormData({ name: profile.name, email: profile.email }); setError(''); }}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button className="btn-primary" onClick={() => setEditing(true)} style={{ width: '100%' }}>
              <FiEdit3 style={{ marginRight: 6 }} />
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
