import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function Profile() {
  const { lang, toggleLanguage } = useLanguage();

  const [userId, setUserId] = useState("");
  const [profile, setProfile] = useState({
    name: "Ramesh Kumar",
    age: 28,
    gender: "Male",
    education: "10th Pass",
    location: "New Delhi, DL",
    phone: "+91 98765 43210",
    interests: "Tailoring, Handloom, Farming",
    preferred_language: "hi-en",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    let storedId = localStorage.getItem("tarini_user_id");
    if (!storedId) {
      storedId = "TRN-" + Math.floor(1000 + Math.random() * 9000) + "-XCV";
      localStorage.setItem("tarini_user_id", storedId);
    }
    setUserId(storedId);
    fetchProfile(storedId);
  }, []);

  async function fetchProfile(uid) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile/${uid}`);
      if (res.ok) {
        const data = await res.json();
        setProfile((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.warn("Could not fetch profile from backend API, using defaults:", err);
    }
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaveStatus("Saving...");
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          ...profile,
        }),
      });
      if (res.ok) {
        setSaveStatus("Saved successfully!");
        setIsEditing(false);
      } else {
        throw new Error("Failed to save profile");
      }
    } catch (err) {
      console.error(err);
      setSaveStatus("Save error. Make sure backend is running.");
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f8f3] text-slate-900 font-sans flex flex-col justify-between pb-20 md:pb-10">
      <main className="max-w-md mx-auto px-4 sm:px-6 py-8 space-y-5 flex-1 w-full">

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-slate-900">
            {lang === "en" ? "Beneficiary Profile" : "लाभार्थी प्रोफाइल"}
          </h1>

          <button
            onClick={toggleLanguage}
            className="px-3.5 py-1.5 rounded-full border border-slate-300 bg-white text-xs font-bold text-slate-700 shadow-sm"
          >
            A / अ
          </button>
        </div>

        {/* User Card */}
        <div className="pdf-card p-6 text-center space-y-4">
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-2 border-emerald-700/20 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>

          {!isEditing ? (
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
              <p className="text-xs text-slate-500 flex items-center justify-center gap-1 mt-0.5 font-mono">
                📍 {profile.location} • {profile.education}
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-2 text-xs font-bold text-[#0a5c2b] hover:underline"
              >
                ✏️ Edit Profile Details
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-3 text-left pt-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block">Education</label>
                  <select
                    value={profile.education}
                    onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-semibold text-slate-800"
                  >
                    <option value="None">None</option>
                    <option value="5th Pass">5th Pass</option>
                    <option value="8th Pass">8th Pass</option>
                    <option value="10th Pass">10th Pass</option>
                    <option value="12th Pass">12th Pass</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block">Location</label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block">Interests</label>
                <input
                  type="text"
                  value={profile.interests}
                  onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 pdf-button-primary py-2 text-xs font-bold uppercase rounded-xl"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>

              {saveStatus && <p className="text-[11px] text-center text-emerald-700 font-bold">{saveStatus}</p>}
            </form>
          )}

          {/* Tarini ID Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
            <p className="text-[11px] font-mono text-slate-500 font-bold uppercase">
              TARINI ID / तारिणी आईडी
            </p>
            <p className="text-base font-extrabold font-mono text-[#0a5c2b] tracking-wider">
              {userId}
            </p>
          </div>
        </div>

        {/* Aadhaar Verified Card */}
        <div className="pdf-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-100/80 text-[#0a5c2b] flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Aadhaar Verified</h4>
            <p className="text-xs text-slate-500">Identity confirmed via PM-AJAY Database</p>
          </div>
        </div>

        {/* My Certificate Card */}
        <Link to="#" className="pdf-card pdf-card-hover p-4 flex items-center gap-4 block">
          <div className="w-10 h-10 rounded-full bg-emerald-100/80 text-[#0a5c2b] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">My Skill Certificate</h4>
            <p className="text-xs text-slate-500">View and download completed NSQF certificates.</p>
          </div>
        </Link>

        {/* Saved Courses Card */}
        <Link to="/courses" className="pdf-card pdf-card-hover p-4 flex items-center gap-4 block">
          <div className="w-10 h-10 rounded-full bg-emerald-100/80 text-[#0a5c2b] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Saved Courses</h4>
            <p className="text-xs text-slate-500">Continue your learning journey.</p>
          </div>
        </Link>

      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-2 flex items-center justify-around z-40 shadow-lg">
        <Link to="/" className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-[#0a5c2b]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] font-bold">Home</span>
        </Link>

        <Link to="/assistant" className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-[#0a5c2b]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          <span className="text-[10px] font-bold">Assistant</span>
        </Link>

        <Link to="/skill-map" className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-[#0a5c2b]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          </svg>
          <span className="text-[10px] font-bold">Skills</span>
        </Link>

        <Link to="/profile" className="flex flex-col items-center gap-0.5 text-[#0a5c2b] bg-emerald-100/80 px-3 py-1 rounded-xl font-bold">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-[10px]">Profile</span>
        </Link>
      </nav>

    </div>
  );
}
