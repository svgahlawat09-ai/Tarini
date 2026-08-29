import { Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import VoiceDemo from "./pages/VoiceDemo";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-paper text-ink font-body">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/demo" element={<VoiceDemo />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </LanguageProvider>
  );
}
