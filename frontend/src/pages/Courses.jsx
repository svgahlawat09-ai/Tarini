import { useLanguage } from "../context/LanguageContext";

export default function Courses() {
  const { lang } = useLanguage();

  const courseList = [
    {
      id: "C01",
      title: lang === "en" ? "Assistant Electrician" : "सहायक इलेक्ट्रीशियन",
      desc: lang === "en"
        ? "Comprehensive training in residential and commercial electrical systems, safety protocols, and basic troubleshooting."
        : "आवासीय और वाणिज्यिक विद्युत प्रणालियों, सुरक्षा प्रोटोकॉल और बुनियादी समस्या निवारण में व्यापक प्रशिक्षण।",
      badge: "NSQF Level 3",
      isHighDemand: false,
      hours: "400 Hours",
      location: "Bhubaneswar",
      image: "./assets/electrician.jpg",
    },
    {
      id: "C02",
      title: lang === "en" ? "Textile Tailoring & Design" : "कपड़ा सिलाई और डिजाइन",
      desc: lang === "en"
        ? "Master garment construction, pattern making, and modern tailoring techniques using industrial equipment."
        : "औद्योगिक उपकरणों का उपयोग करके वस्त्र निर्माण, पैटर्न मेकिंग और आधुनिक सिलाई तकनीकों में महारत हासिल करें।",
      badge: "NSQF Level 4",
      isHighDemand: true,
      hours: "550 Hours",
      location: "Cuttack",
      image: "./assets/tailoring.jpg",
    },
    {
      id: "C03",
      title: lang === "en" ? "Domestic Data Entry Operator" : "घरेलू डेटा एंट्री ऑपरेटर",
      desc: lang === "en"
        ? "Develop essential computer skills, typing proficiency, and data management techniques for administrative roles."
        : "प्रशासनिक भूमिकाओं के लिए आवश्यक कंप्यूटर कौशल, टाइपिंग दक्षता और डेटा प्रबंधन तकनीक विकसित करें।",
      badge: "NSQF Level 2",
      isHighDemand: false,
      hours: "300 Hours",
      location: "Online / Hybrid",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f8f3] text-slate-900 font-sans">
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {lang === "en" ? "Recommended Courses" : "अनुशंसित पाठ्यक्रम"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              {lang === "en"
                ? "Tailored skill development programs based on current industry demands in your region."
                : "आपके क्षेत्र में वर्तमान उद्योग मांगों के आधार पर तैयार किए गए कौशल विकास कार्यक्रम।"}
            </p>
          </div>

          {/* Filter Action Buttons matching Screenshot 5 */}
          <div className="flex flex-wrap items-center gap-2">
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm hover:border-emerald-700/40">
              <svg className="w-3.5 h-3.5 text-[#0a5c2b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              Near Me
            </button>

            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm hover:border-emerald-700/40">
              <svg className="w-3.5 h-3.5 text-[#0a5c2b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              Bilingual Support
            </button>

            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm hover:border-emerald-700/40">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filters
            </button>
          </div>
        </div>

        {/* 3 Column Grid of Course Cards */}
        <div className="grid md:grid-cols-3 gap-6 pt-2">
          {courseList.map((course) => (
            <div key={course.id} className="pdf-card overflow-hidden flex flex-col justify-between pdf-card-hover">
              
              {/* Card Image Header with Floating Badges */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded-md font-bold">
                    {course.badge}
                  </span>
                  {course.isHighDemand && (
                    <span className="bg-rose-600 text-white text-[11px] font-mono px-2.5 py-1 rounded-md font-bold">
                      High Demand
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 text-lg leading-snug">{course.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{course.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {course.hours}
                  </span>

                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {course.location}
                  </span>
                </div>

                {/* Enroll Button */}
                <button className="w-full py-3 pdf-button-primary text-xs font-bold uppercase tracking-wider mt-2">
                  {lang === "en" ? "Enroll Now →" : "अभी नामांकन करें →"}
                </button>
              </div>

            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
