import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";

export default function Profile() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-[#f4f8f3] text-slate-900 font-sans flex flex-col justify-between pb-20 md:pb-10">
      
      <main className="max-w-md mx-auto px-4 sm:px-6 py-8 space-y-5 flex-1 w-full">

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-slate-900">
            {lang === "en" ? "Profile" : "प्रोफाइल"}
          </h1>

          <button
            onClick={toggleLanguage}
            className="px-3.5 py-1.5 rounded-full border border-slate-300 bg-white text-xs font-bold text-slate-700 shadow-sm"
          >
            A / अ
          </button>
        </div>

        {/* User Card matching Screenshot 4 */}
        <div className="pdf-card p-6 text-center space-y-4">
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-2 border-emerald-700/20 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
              alt="Ramesh Kumar"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">Ramesh Kumar</h2>
            <p className="text-xs text-slate-500 flex items-center justify-center gap-1 mt-0.5">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              New Delhi, DL
            </p>
          </div>

          {/* Tarini ID Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
            <p className="text-[11px] font-mono text-slate-500 font-bold uppercase">
              TARINI ID / तारिणी आईडी
            </p>
            <p className="text-base font-extrabold font-mono text-[#0a5c2b] tracking-wider">
              TRN-8942-XCV
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
            <p className="text-xs text-slate-500">Identity confirmed</p>
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
            <h4 className="font-bold text-slate-900 text-sm">My Certificate</h4>
            <p className="text-xs text-slate-500">View and download completed skill certificates.</p>
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

        {/* Account Settings */}
        <div className="pdf-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Account Settings</h4>
          </div>
        </div>

      </main>

      {/* Bottom Navigation Bar for Mobile matching Screenshot 4 & 6 */}
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
