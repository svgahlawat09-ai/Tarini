import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { API_BASE_URL } from "../config";

export default function Courses() {
  const { lang } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");

  const OCCUPATION_IDS = [
    "OCC01", "OCC02", "OCC03", "OCC04", "OCC05",
    "OCC06", "OCC07", "OCC08", "OCC09", "OCC10",
    "OCC11", "OCC12", "OCC13", "OCC14", "OCC15"
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    setLoading(true);
    let loadedCourses = [];

    try {
      // Fetch occupation course details from backend API
      const fetchPromises = OCCUPATION_IDS.map(async (id) => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/occupation/${id}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.courses && data.courses.length > 0) {
              return data.courses.map((c) => ({
                id: c.id,
                title: c.course_name || data.title,
                sector: data.sector || "General",
                provider: c.provider || "Skill India Digital Hub",
                url: c.url || "https://www.skillindiadigital.gov.in/",
                occupation_id: id,
              }));
            }
          }
        } catch (_) {}
        return [];
      });

      const results = await Promise.all(fetchPromises);
      loadedCourses = results.flat();
    } catch (err) {
      console.warn("Could not fetch occupations from backend API:", err);
    }

    // Official fallback list with legitimate URLs if API is offline
    if (loadedCourses.length === 0) {
      loadedCourses = [
        {
          id: "OCC01-C01",
          title: "Boutique/Custom Apparel Maker — Skill Certification (NSQF Level 4)",
          sector: "Apparel",
          provider: "Skill India Digital Hub",
          url: "https://www.skillindiadigital.gov.in/",
        },
        {
          id: "OCC02-C01",
          title: "Hand Embroiderer — Skill Certification (NSQF Level 3)",
          sector: "Apparel",
          provider: "Skill India Digital Hub",
          url: "https://www.skillindiadigital.gov.in/",
        },
        {
          id: "OCC06-C01",
          title: "Data Entry Operator — Skill Certification (NSQF Level 4)",
          sector: "IT/ITES",
          provider: "National Skill Development Corporation (NSDC)",
          url: "https://www.nsdcindia.org/",
        },
        {
          id: "OCC08-C01",
          title: "Commercial Vehicle Driver — Skill Certification (NSQF Level 4)",
          sector: "Transport",
          provider: "Skill India Digital Hub",
          url: "https://www.skillindiadigital.gov.in/",
        },
        {
          id: "OCC11-C01",
          title: "Electrician (Domestic) — Skill Certification (NSQF Level 4)",
          sector: "Construction",
          provider: "National Skill Development Corporation (NSDC)",
          url: "https://www.nsdcindia.org/",
        },
        {
          id: "OCC13-C01",
          title: "Retail Sales Associate — Skill Certification (NSQF Level 3)",
          sector: "Retail",
          provider: "Skill India Digital Hub",
          url: "https://www.skillindiadigital.gov.in/",
        },
      ];
    }

    setCourses(loadedCourses);
    setLoading(false);
  }

  const sectors = ["All", ...new Set(courses.map((c) => c.sector).filter(Boolean))];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === "All" || c.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="min-h-screen bg-[#f4f8f3] text-slate-900 font-sans">
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {lang === "en" ? "Official Vocational Courses" : "आधिकारिक व्यावसायिक पाठ्यक्रम"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              {lang === "en"
                ? "Verified NSQF skill programs linked to Skill India Digital & NSDC official learning portals."
                : "कौशल भारत डिजिटल और एनएसडीसी आधिकारिक पोर्टल से जुड़े प्रमाणित एनएसक्यूएफ पाठ्यक्रम।"}
            </p>
          </div>

          {/* Search & Sector Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Search courses or sector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-300 px-3.5 py-2 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0a5c2b] shadow-sm"
            />
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-white border border-slate-300 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 shadow-sm focus:outline-none"
            >
              {sectors.map((sec) => (
                <option key={sec} value={sec}>
                  {sec === "All" ? "All Sectors" : sec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center py-12 text-slate-500 font-mono text-sm">
            Loading official courses from backend...
          </div>
        )}

        {/* Course Cards Grid */}
        {!loading && (
          <div className="grid md:grid-cols-3 gap-6 pt-2">
            {filteredCourses.map((course) => (
              <div key={course.id} className="pdf-card overflow-hidden flex flex-col justify-between pdf-card-hover p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#0a5c2b]/10 text-[#0a5c2b] text-[11px] font-mono px-2.5 py-1 rounded-md font-bold">
                      {course.sector}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                      Official Portal
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug">{course.title}</h3>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-slate-400">Provider:</span>
                    <span className="font-semibold text-slate-800 text-[11px]">{course.provider}</span>
                  </div>
                </div>

                {/* Direct Official Link */}
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-3 pdf-button-primary text-xs font-bold uppercase tracking-wider block rounded-xl transition-all"
                >
                  {lang === "en" ? "Go to Official Portal ↗" : "आधिकारिक पोर्टल पर जाएं ↗"}
                </a>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
