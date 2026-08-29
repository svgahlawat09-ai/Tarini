import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Problem from "./pages/Problem";
import VoiceDemo from "./pages/VoiceDemo";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div className="font-body min-h-screen bg-paper text-ink">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/problem" element={<Problem />} />
        <Route path="/demo" element={<VoiceDemo />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}
