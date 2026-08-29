import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Landing() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-[#f4f8f3] text-slate-900 font-sans flex flex-col justify-between">
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-14 flex-1">

        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            {lang === "en" ? "Welcome to Tarini" : "तारिणी में आपका स्वागत है"}
          </h1>
          <p className="text-[#0a5c2b] font-semibold text-lg sm:text-xl">
            {lang === "en" ? "तारिणी में आपका स्वागत है" : "Welcome to Tarini"}
          </p>
          <p className="text-slate-600 text-sm sm:text-base pt-1">
            {lang === "en"
              ? "Your official platform for skill development and livelihood opportunities. Built for everyone, easy to use."
              : "कौशल विकास और आजीविका के अवसरों के लिए आपका आधिकारिक मंच। सभी के लिए निर्मित, उपयोग में आसान।"}
          </p>
        </div>

        {/* Central Voice Assistant Primary CTA Card */}
        <div className="max-w-md mx-auto">
          <Link
            to="/assistant"
            className="block bg-[#0a5c2b] hover:bg-[#074720] text-white p-8 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all group border border-emerald-800"
          >
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-1">
              {lang === "en" ? "Start Speaking to Pipo" : "पीपो से बात करना शुरू करें"}
            </h2>
            <p className="text-emerald-100 text-sm font-medium mb-3">
              {lang === "en" ? "पीपो से बात करना शुरू करें" : "Start Speaking to Pipo"}
            </p>
            <p className="text-xs text-emerald-200/80 font-mono">
              {lang === "en"
                ? "No typing needed. Just tap and speak. / कोई टाइपिंग नहीं। बस दबाएं और बोलें।"
                : "कोई टाइपिंग नहीं। बस दबाएं और बोलें।"}
            </p>
          </Link>
        </div>

        {/* How Tarini Works Section */}
        <div className="space-y-8 pt-4">
          <h3 className="text-2xl font-bold text-center text-slate-900">
            {lang === "en" ? "How Tarini Works" : "तारिणी कैसे काम करता है"}
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="pdf-card p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100/80 text-[#0a5c2b] flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                {lang === "en" ? "1. Speak" : "1. बोलें"}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === "en"
                  ? "Tell Pipo about your skills and interests using your voice."
                  : "अपनी आवाज का उपयोग करके पीपो को अपने कौशल और रुचियों के बारे में बताएं।"}
              </p>
              <p className="text-[11px] text-[#0a5c2b] font-medium">
                {lang === "en"
                  ? "अपनी आवाज का उपयोग करके पीपो को अपने कौशल के बारे में बताएं।"
                  : "Tell Pipo about your skills using voice."}
              </p>
            </div>

            {/* Step 2 */}
            <div className="pdf-card p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100/80 text-[#0a5c2b] flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                {lang === "en" ? "2. Map" : "2. मानचित्र"}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === "en"
                  ? "We build a personalized skill map for you based on your profile."
                  : "हम आपकी प्रोफाइल के आधार पर आपके लिए एक कौशल मानचित्र बनाते हैं।"}
              </p>
              <p className="text-[11px] text-[#0a5c2b] font-medium">
                {lang === "en"
                  ? "हम आपकी प्रोफाइल के आधार पर आपके लिए एक कौशल मानचित्र बनाते हैं।"
                  : "We build a personalized skill map for you."}
              </p>
            </div>

            {/* Step 3 */}
            <div className="pdf-card p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100/80 text-[#0a5c2b] flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                {lang === "en" ? "3. Grow" : "3. विकास"}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === "en"
                  ? "Find courses, jobs, and schemes tailored specifically to you."
                  : "विशेष रूप से आपके लिए तैयार किए गए पाठ्यक्रम, नौकरियां और योजनाएं खोजें।"}
              </p>
              <p className="text-[11px] text-[#0a5c2b] font-medium">
                {lang === "en"
                  ? "विशेष रूप से आपके लिए तैयार किए गए पाठ्यक्रम और नौकरियां खोजें।"
                  : "Find courses and jobs tailored for you."}
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
