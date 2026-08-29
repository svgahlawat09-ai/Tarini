import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function SkillMap() {
  const { lang } = useLanguage();

  const strengths = [
    {
      title: lang === "en" ? "Agriculture & Farming" : "कृषि और खेती",
      desc: lang === "en" ? "High proficiency in organic farming techniques and crop rotation." : "जैविक खेती तकनीकों और फसल चक्र में उच्च दक्षता।",
      percent: 85,
      icon: (
        <svg className="w-5 h-5 text-[#0a5c2b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
        </svg>
      ),
    },
    {
      title: lang === "en" ? "Tailoring & Textiles" : "सिलाई और वस्त्र",
      desc: lang === "en" ? "Advanced skills in garment construction and pattern making." : "पोशाक निर्माण और पैटर्न बनाने में उन्नत कौशल।",
      percent: 70,
      icon: (
        <svg className="w-5 h-5 text-[#0a5c2b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 0L4 4m5.121 5.121L4 14.121M12 12l2.879-2.879M12 12L9.121 14.121" />
        </svg>
      ),
    },
    {
      title: lang === "en" ? "Handloom Weaving" : "हथकरघा बुनाई",
      desc: lang === "en" ? "Intermediate knowledge of traditional loom setup and operation." : "पारंपरिक करघा सेटअप और संचालन का मध्यम ज्ञान।",
      percent: 55,
      icon: (
        <svg className="w-5 h-5 text-[#0a5c2b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
    },
    {
      title: lang === "en" ? "Retail Management" : "खुदरा प्रबंधन",
      desc: lang === "en" ? "Basic understanding of inventory and customer service." : "इन्वेंट्री और ग्राहक सेवा की बुनियादी समझ।",
      percent: 40,
      icon: (
        <svg className="w-5 h-5 text-[#0a5c2b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f8f3] text-slate-900 font-sans">
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">

        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {lang === "en" ? "Skill Assessment Complete" : "कौशल मूल्यांकन पूर्ण हुआ"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {lang === "en"
              ? "Here is a comprehensive breakdown of your mapped skills and recommended pathways."
              : "यहां आपके मैप किए गए कौशल और अनुशंसित मार्गों का व्यापक विवरण दिया गया है।"}
          </p>
        </div>

        {/* Grid Layout: Left Main Column (8 cols) + Right Side Panel (4 cols) */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">

            {/* Mapping Completion Card */}
            <div className="pdf-card p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {lang === "en" ? "Mapping Completion" : "मानचित्रण पूर्णता"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === "en" ? "Your profile is fully assessed." : "आपकी प्रोफाइल का पूरी तरह से मूल्यांकन किया गया है।"}
                  </p>
                </div>
                <span className="text-2xl font-extrabold text-[#0a5c2b]">100%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-[#0a5c2b] h-full rounded-full w-full" />
              </div>
            </div>

            {/* Identified Strengths Header */}
            <div className="space-y-4 pt-2">
              <h2 className="text-xl font-bold text-slate-900">
                {lang === "en" ? "Identified Strengths" : "पहचाने गए कौशल"}
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                {strengths.map((item) => (
                  <div key={item.title} className="pdf-card p-5 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100/80 flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-end">
                        <span className="text-xs font-bold font-mono text-slate-600">{item.percent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#0a5c2b] h-full rounded-full transition-all duration-500"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Side Panel: What's Next? */}
          <div className="lg:col-span-4 space-y-6">
            <div className="pdf-card p-6 space-y-5 border border-emerald-900/15 shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100/80 text-[#0a5c2b] flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {lang === "en" ? "What's Next?" : "आगे क्या है?"}
                </h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === "en"
                  ? "Based on your results, we recommend the following pathways to enhance your livelihood opportunities."
                  : "आपके परिणामों के आधार पर, हम आपकी आजीविका के अवसरों को बढ़ाने के लिए निम्नलिखित मार्गों की सिफारिश करते हैं।"}
              </p>

              {/* Opportunity 1 */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#0a5c2b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h4 className="font-bold text-slate-900 text-xs">
                    {lang === "en" ? "Advanced Organic Farming Certification" : "उन्नत जैविक खेती प्रमाणन"}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500 pl-6">
                  {lang === "en" ? "Level up your agriculture skills." : "अपने कृषि कौशल का स्तर बढ़ाएं।"}
                </p>
              </div>

              {/* Opportunity 2 */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#0a5c2b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h4 className="font-bold text-slate-900 text-xs">
                    {lang === "en" ? "Textile Cooperative Opportunities" : "कपड़ा सहकारी अवसर"}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500 pl-6">
                  {lang === "en" ? "Connect with local tailoring groups." : "स्थानीय सिलाई समूहों से जुड़ें।"}
                </p>
              </div>

              {/* CTA Button */}
              <Link
                to="/courses"
                className="block w-full py-3 text-center pdf-button-primary text-xs font-bold uppercase tracking-wider"
              >
                {lang === "en" ? "Explore All Recommended Courses →" : "सभी अनुशंसित पाठ्यक्रम देखें →"}
              </Link>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
