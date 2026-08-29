import { useState } from "react";
import Reveal from "../components/Reveal";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const overviewStats = [
  { label: "Total SC Beneficiaries Profiled", value: "48,250", change: "+14.2% this month", isPositive: true },
  { label: "NSQF Course Enrollments", value: "39,810", change: "82.5% Conversion", isPositive: true },
  { label: "Avg. AI Match Confidence", value: "94.8%", change: "Groq Llama 3.3 Engine", isPositive: true },
  { label: "Target PM-AJAY Districts", value: "128", change: "Across 14 States", isPositive: true },
];

const skillGapData = [
  { trade: "Apparel & Tailoring", demand: 88, supply: 52 },
  { trade: "Handicrafts & Art", demand: 76, supply: 48 },
  { trade: "Healthcare Caregiver", demand: 92, supply: 38 },
  { trade: "Electronics Repair", demand: 84, supply: 42 },
  { trade: "Food Processing", demand: 64, supply: 30 },
];

const sectorDistribution = [
  { name: "Apparel & Textiles", value: 38, color: "#06b6d4" },
  { name: "Handicrafts", value: 24, color: "#10b981" },
  { name: "Healthcare Aide", value: 20, color: "#f59e0b" },
  { name: "Electronics", value: 18, color: "#6366f1" },
];

const beneficiaryDirectory = [
  { id: "BEN-0941", name: "Sunita Devi", region: "Varanasi, UP", language: "Hindi", status: "Course Enrolled", trade: "Boutique Apparel Maker", date: "Today" },
  { id: "BEN-0942", name: "Ramavati Bai", region: "Gorakhpur, UP", language: "Bhojpuri", status: "Assessment Complete", trade: "Hand Embroiderer", date: "Today" },
  { id: "BEN-0943", name: "Anita Sharma", region: "Jaipur, RJ", language: "English/Hindi", status: "Grant Approved", trade: "General Duty Assistant", date: "Yesterday" },
  { id: "BEN-0944", name: "Suresh Kumar", region: "Patna, BR", language: "Bhojpuri", status: "Assessment Complete", trade: "Field Technician Repair", date: "Yesterday" },
  { id: "BEN-0945", name: "Meena Kumari", region: "Ranchi, JH", language: "Hindi", status: "Placement Linked", trade: "Craft & Handicraft Maker", date: "2 days ago" },
];

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");

  const filteredBeneficiaries = beneficiaryDirectory.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.trade.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === "All" || b.region.includes(selectedRegion);
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Dashboard Header */}
        <header className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
                Executive Field Analytics
              </span>
              <span className="text-xs font-mono text-slate-400">PM-AJAY Scheme Monitor</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              National Vocational Mapping Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all">
              <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV Analytics
            </button>
          </div>
        </header>

        {/* Overview Stat Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewStats.map((stat, idx) => (
            <Reveal key={stat.label} delay={idx * 80}>
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 blur-xl rounded-full pointer-events-none group-hover:bg-cyan-500/20 transition-all" />
                <span className="text-xs font-mono text-slate-400 uppercase font-semibold block">{stat.label}</span>
                <p className="font-display text-3xl font-extrabold text-white">{stat.value}</p>
                <span className="text-xs font-mono text-emerald-400 font-bold block">{stat.change}</span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Skill Demand vs Supply Bar Chart (7 cols) */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                Market Analysis
              </span>
              <h3 className="font-display text-xl font-bold text-white">Skill Demand vs. Trained Supply</h3>
              <p className="text-xs text-slate-400 font-sans">
                Comparing PM-AJAY regional employer demand openings against current beneficiary supply.
              </p>
            </div>

            <div className="pt-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillGapData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#33415550" />
                  <XAxis dataKey="trade" tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "Plus Jakarta Sans" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "Plus Jakarta Sans" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: 12, color: "#f8fafc" }}
                  />
                  <Bar dataKey="demand" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Employer Openings" />
                  <Bar dataKey="supply" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Beneficiary Supply" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sector Share Pie Chart (5 cols) */}
          <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                Sector Share
              </span>
              <h3 className="font-display text-xl font-bold text-white">Beneficiary Profile Sector Breakdown</h3>
              <p className="text-xs text-slate-400 font-sans">
                Distribution of extracted skills across key vocational sectors.
              </p>
            </div>

            <div className="pt-4 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sectorDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: 12 }} />
                  <Legend tick={{ fontSize: 11, fill: "#94a3b8" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Recent Beneficiaries Directory Table */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-display text-xl font-bold text-white">Recently Profiled Beneficiaries</h3>
              <p className="text-xs text-slate-400 font-mono">Live Session Log from PM-AJAY Field Officers</p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search beneficiary or trade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800/80">
                  <th className="pb-3 pr-4">ID</th>
                  <th className="pb-3 pr-4">Beneficiary Name</th>
                  <th className="pb-3 pr-4">Region</th>
                  <th className="pb-3 pr-4">Language</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Recommended NSQF Trade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredBeneficiaries.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 pr-4 font-mono font-bold text-cyan-400">{b.id}</td>
                    <td className="py-3.5 pr-4 font-semibold text-white">{b.name}</td>
                    <td className="py-3.5 pr-4 text-slate-300">{b.region}</td>
                    <td className="py-3.5 pr-4 font-mono text-slate-400">{b.language}</td>
                    <td className="py-3.5 pr-4">
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold">
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-200 font-medium">{b.trade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
