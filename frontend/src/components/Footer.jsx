import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-white pt-12 pb-10 px-4 sm:px-8 border-t border-slate-800">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h3 className="font-sans text-xl font-bold text-white tracking-wide">Tarini</h3>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-medium">
          <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="#" className="hover:text-white transition-colors">Help Desk</Link>
          <Link to="#" className="hover:text-white transition-colors">Accessibility</Link>
        </div>

        <p className="text-[11px] text-slate-500 font-mono pt-4 border-t border-slate-800/80">
          © 2024 Tarini Livelihood Platform. Government of India Initiative.
        </p>
      </div>
    </footer>
  );
}
