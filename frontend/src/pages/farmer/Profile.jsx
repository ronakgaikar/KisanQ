import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { User, Phone, MapPin, Globe, Save } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    village: '',
    district: '',
    state: '',
    preferred_language: 'English'
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/farmers/me').then(res => {
      setProfile(res.data);
      setFormData({
        name: res.data.name,
        village: res.data.village,
        district: res.data.district,
        state: res.data.state,
        preferred_language: res.data.preferred_language
      });
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    api.put('/farmers/me', formData).then(res => {
      setProfile(res.data);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    });
  };

  if (!profile) return <div className="p-8 text-center text-slate-500">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900">Farmer Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Government Registration Details & Language Preferences</p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl">
          {message}
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b">
            <div>
              <span className="text-slate-400 font-bold uppercase">Govt Farmer ID</span>
              <p className="text-sm font-extrabold text-emerald-700 mt-1">{profile.farmer_id}</p>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase">Registered Mobile</span>
              <p className="text-sm font-bold text-slate-900 mt-1">{profile.mobile_number}</p>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold uppercase mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold uppercase mb-1">Village</label>
              <input
                type="text"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold uppercase mb-1">District</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold uppercase mb-1">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold uppercase mb-1">Preferred Language</label>
            <select
              value={formData.preferred_language}
              onChange={(e) => setFormData({ ...formData, preferred_language: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border rounded-xl outline-none"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="Marathi">Marathi (मराठी)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save Profile Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
