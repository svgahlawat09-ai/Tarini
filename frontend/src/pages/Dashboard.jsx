import Reveal from "../components/Reveal";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// --- Dummy data. Replace these arrays with real API data once the
// --- backend/AI team's endpoints are ready. Shape stays the same.
const overview = [
  { label: "Beneficiaries profiled", value: "1,248" },
  { label: "Training pathways matched", value: "1,032" },
  { label: "Avg. match confidence", value: "84%" },
  { label: "Dropout rate", value: "9%" },
];

const skillGap = [
  { trade: "Tailoring", demand: 82, supply: 54 },
  { trade: "Carpentry", demand: 61, supply: 40 },
  { trade: "Electrician", demand: 74, supply: 35 },
  { trade: "Beauty & Wellness", demand: 58, supply: 44 },
  { trade: "Food Processing", demand: 49, supply: 30 },
];

const beneficiaries = [
  { name: "R. Kumari", region: "Bihar", language: "Bhojpuri", pref: "Self-employment", trade: "Tailoring" },
  { name: "S. Nayak", region: "Odisha", language: "Odia", pref: "Wage employment", trade: "Electrician" },
  { name: "M. Reddy", region: "Telangana", language: "Telugu", pref: "Self-employment", trade: "Beauty & Wellness" },
  { name: "A. Devi", region: "Bihar", language: "Hindi", pref: "Wage employment", trade: "Food Processing" },
  { name: "K. Singh", region: "UP", language: "Hindi", pref: "Self-employment", trade: "Carpentry" },
];

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-gold-dark mb-3">
        Admin view &middot; dummy data
      </p>
      <h1 className="font-display text-3xl font-semibold mb-10">
        Livelihood mapping overview
      </h1>

      {/* Overview cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {overview.map((o) => (
          <div key={o.label} className="bg-white/70 border border-indigo/10 rounded-xl p-5">
            <p className="font-mono text-2xl text-indigo font-medium">{o.value}</p>
            <p className="font-body text-xs text-ink/60 mt-1">{o.label}</p>
          </div>
        ))}
      </div>

      {/* Skill gap chart */}
      <Reveal className="mb-12">
      <div className="bg-white/70 border border-indigo/10 rounded-xl p-6">
        <h2 className="font-display text-xl font-semibold mb-1">
          Skill demand vs. supply, by trade
        </h2>
        <p className="font-body text-sm text-ink/60 mb-6">
          Demand = local employer/market openings &middot; Supply = trained
          beneficiaries available
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={skillGap}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1B2A4A15" />
            <XAxis dataKey="trade" tick={{ fontSize: 12, fontFamily: "Work Sans" }} />
            <YAxis tick={{ fontSize: 12, fontFamily: "Work Sans" }} />
            <Tooltip
              contentStyle={{ fontFamily: "Work Sans", fontSize: 13, borderRadius: 8 }}
            />
            <Bar dataKey="demand" fill="#1B2A4A" radius={[4, 4, 0, 0]} name="Demand" />
            <Bar dataKey="supply" fill="#E8A33D" radius={[4, 4, 0, 0]} name="Supply" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      </Reveal>

      {/* Beneficiary table */}
      <Reveal>
      <div className="bg-white/70 border border-indigo/10 rounded-xl p-6">
        <h2 className="font-display text-xl font-semibold mb-6">
          Recently profiled beneficiaries
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-sm">
            <thead>
              <tr className="text-ink/50 font-mono text-xs uppercase">
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Region</th>
                <th className="pb-3 pr-4">Language</th>
                <th className="pb-3 pr-4">Preference</th>
                <th className="pb-3">Recommended trade</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaries.map((b) => (
                <tr key={b.name} className="border-t border-indigo/10">
                  <td className="py-3 pr-4">{b.name}</td>
                  <td className="py-3 pr-4">{b.region}</td>
                  <td className="py-3 pr-4">{b.language}</td>
                  <td className="py-3 pr-4">{b.pref}</td>
                  <td className="py-3">{b.trade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </Reveal>
    </div>
  );
}
