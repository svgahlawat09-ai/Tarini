import { Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Landing from "./pages/Landing";
import VoiceDemo from "./pages/VoiceDemo";
import Profile from "./pages/Profile";
import Courses from "./pages/Courses";
import Empower from "./pages/Empower";
import Problem from "./pages/Problem";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#f4f8f3] text-slate-900 font-sans flex flex-col justify-between">
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/assistant" element={<VoiceDemo />} />
            <Route path="/demo" element={<VoiceDemo />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/empower" element={<Empower />} />
            <Route path="/problem" element={<Problem />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
