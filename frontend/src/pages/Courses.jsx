import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { API_BASE_URL } from "../config";

export default function Courses() {
  const { lang } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/courses`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      } else {
        throw new Error("Failed to fetch courses from backend API");
      }
    } catch (err) {
      console.warn("Backend API unreachable, using fallback dataset:", err);
      // Fallback fallback static courses if API fails
      setCourses([
        {
          qp_code: "AMH/Q0102",
          job_role: "Self Employed Tailor",
          nsqf_level: 4,
          sector: "Apparel Made-Ups & Home Furnishing SSC",
          duration_hours: 340,
          eligibility: "8th Pass",
          self_employment_possible: true,
        },
        {
          qp_code: "CON/Q0602",
          job_role: "Assistant Electrician",
          nsqf_level: 3,
          sector: "Construction Skill Development Council",
          duration_hours: 400,
          eligibility: "10th Pass",
          self_employment_possible: true,
        },
        {
          qp_code: "SSC/Q2211",
          job_role: "Domestic Data Entry Operator",
          nsqf_level: 3,
          sector: "IT-ITeS Sector Skill Council",
          duration_hours: 400,
          eligibility: "10th Pass",
          self_employment_possible: false,
        },
        {
          qp_code: "AGR/Q1208",
          job_role: "Organic Cultivator",
          nsqf_level: 3,
          sector: "Agriculture Skill Council of India",
          duration_hours: 200,
          eligibility: "5th Pass",
          self_employment_possible: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const sectors = ["All", ...new Set(courses.map((c) => c.sector))];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.job_role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.qp_code.toLowerCase().includes(searchTerm.toLowerCase());
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
              {lang === "en" ? "NSQF Recommended Courses" : "अनुशंसित NSQF पाठ्यक्रम"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              {lang === "en"
                ? "Official government vocational qualification packs aligned with Skill India & PM-AJAY schemes."
                : "कौशल भारत और पीएम-अजय योजनाओं से जुड़े आधिकारिक सरकारी व्यावसायिक पाठ्यक्रम।"}
            </p>
          </div>

          {/* Search & Sector Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Search course or QP code..."
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

        {/* Loading indicator */}
        {loading && (
          <div className="text-center py-12 text-slate-500 font-mono text-sm">
            Loading courses from FastAPI backend...
          </div>
        )}

        {/* 3 Column Grid of Course Cards */}
        {!loading && (
          <div className="grid md:grid-cols-3 gap-6 pt-2">
            {filteredCourses.map((course) => (
              <div key={course.qp_code} className="pdf-card overflow-hidden flex flex-col justify-between pdf-card-hover p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#0a5c2b]/10 text-[#0a5c2b] text-[11px] font-mono px-2.5 py-1 rounded-md font-bold">
                      NSQF Level {course.nsqf_level}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {course.qp_code}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg leading-snug">{course.job_role}</h3>
                  <p className="text-xs text-slate-500 font-mono">{course.sector}</p>
                </div>

                <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3 font-mono">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-bold">{course.duration_hours} Hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Eligibility:</span>
                    <span className="font-bold">{course.eligibility}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Self Employment:</span>
                    <span className={`font-bold ${course.self_employment_possible ? "text-emerald-700" : "text-slate-500"}`}>
                      {course.self_employment_possible ? "Yes 💪" : "No"}
                    </span>
                  </div>
                </div>

                <button className="w-full py-3 pdf-button-primary text-xs font-bold uppercase tracking-wider mt-2">
                  {lang === "en" ? "Enroll Now →" : "अभी नामांकन करें →"}
                </button>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
