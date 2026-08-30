import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";

export default function Empower() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-[#f4f8f3] text-slate-900 font-sans flex flex-col justify-between pb-20 md:pb-10">
      
      <main className="max-w-md mx-auto px-4 sm:px-6 py-8 space-y-6 flex-1 w-full">

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <span className="font-sans text-2xl font-bold text-[#0a5c2b]">Tarini</span>
          <button
            onClick={toggleLanguage}
            className="px-3.5 py-1.5 rounded-full border border-slate-300 bg-white text-xs font-bold text-slate-700 shadow-sm"
          >
            English / हिंदी
          </button>
        </div>

        {/* Hero Title Section */}
        <div className="text-center space-y-2 pt-2">
          <h1 className="text-3xl font-extrabold text-[#0a5c2b] tracking-tight">
            {lang === "en" ? "Empower Your Skills" : "कौशल सशक्तिकरण मंच"}
          </h1>
          <p className="text-sm font-semibold text-slate-700">
            {lang === "en" ? "कौशल सशक्तिकरण मंच" : "Empower Your Skills"}
          </p>
          <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
            {lang === "en"
              ? "Discover training, job opportunities, and government schemes tailored for you."
              : "अपने लिए तैयार किए गए प्रशिक्षण, नौकरी के अवसर और सरकारी योजनाएं खोजें।"}
          </p>
        </div>

        {/* 2x2 Grid Category Buttons matching Screenshot 6 */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          {/* Learn */}
          <Link
            to="/courses"
            className="pdf-card pdf-card-hover p-6 text-center space-y-2 flex flex-col items-center justify-center block"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100/80 text-[#0a5c2b] flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Learn</h3>
              <p className="text-xs text-slate-500 font-medium">सीखें</p>
            </div>
          </Link>

          {/* Jobs */}
          <Link
            to="/skill-map"
            className="pdf-card pdf-card-hover p-6 text-center space-y-2 flex flex-col items-center justify-center block"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100/80 text-[#0a5c2b] flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Jobs</h3>
              <p className="text-xs text-slate-500 font-medium">नौकरी</p>
            </div>
          </Link>

          {/* Schemes */}
          <Link
            to="/assistant"
            className="pdf-card pdf-card-hover p-6 text-center space-y-2 flex flex-col items-center justify-center block"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100/80 text-[#0a5c2b] flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Schemes</h3>
              <p className="text-xs text-slate-500 font-medium">योजनाएं</p>
            </div>
          </Link>

          {/* Help */}
          <Link
            to="/assistant"
            className="pdf-card pdf-card-hover p-6 text-center space-y-2 flex flex-col items-center justify-center block"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100/80 text-[#0a5c2b] flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Help</h3>
              <p className="text-xs text-slate-500 font-medium">सहायता</p>
            </div>
          </Link>
        </div>

        {/* Featured Card: Digital Literacy Course matching Screenshot 6 */}
        <div className="pdf-card p-6 space-y-4 border border-emerald-900/15 shadow-md">
          <div className="flex items-center gap-2">
            <span className="bg-rose-700 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              New
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
              Digital Literacy Course
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              Start your journey to digital empowerment today. Free for all registered users.
            </p>
          </div>

          <Link
            to="/courses"
            className="block w-full py-3.5 text-center pdf-button-primary text-xs font-bold uppercase tracking-wider"
          >
            Enroll Now / अभी नामांकन करें
          </Link>
        </div>

      </main>

      {/* Bottom Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-2 flex items-center justify-around z-40 shadow-lg">
        <Link to="/" className="flex flex-col items-center gap-0.5 text-[#0a5c2b] bg-emerald-100/80 px-3 py-1 rounded-xl font-bold">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px]">Home</span>
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

        <Link to="/profile" className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-[#0a5c2b]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-[10px] font-bold">Profile</span>
        </Link>
      </nav>

    </div>
  );
}
