import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Quiz() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(0);

  const options = [
    {
      title: lang === "en" ? "Apologize immediately" : "तुरंत माफी मांगें",
      desc: lang === "en"
        ? "Acknowledge their frustration and apologize for the inconvenience before looking up their file."
        : "उनकी निराशा को स्वीकार करें और उनकी फाइल देखने से पहले हुई असुविधा के लिए माफी मांगें।",
    },
    {
      title: lang === "en" ? "Ask for their ID" : "उनकी आईडी मांगें",
      desc: lang === "en"
        ? "Immediately ask for their tracking number or ID to find out what went wrong."
        : "क्या गलत हुआ यह जानने के लिए तुरंत उनका ट्रैकिंग नंबर या आईडी मांगें।",
    },
    {
      title: lang === "en" ? "Transfer the call" : "कॉल ट्रांसफ़र करें",
      desc: lang === "en"
        ? "Transfer them to a supervisor since they are upset and require escalation."
        : "उन्हें सुपरवाइजर के पास ट्रांसफर करें क्योंकि वे परेशान हैं और ध्यान देने की आवश्यकता है।",
    },
    {
      title: lang === "en" ? "Explain the policy" : "नीति के बारे में बताएं",
      desc: lang === "en"
        ? "Explain the standard processing times to show that the delay might be normal."
        : "यह दिखाने के लिए कि देरी सामान्य हो सकती है, मानक प्रसंस्करण समय के बारे में बताएं।",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f8f3] text-slate-900 font-sans flex flex-col justify-between">
      
      {/* Top Quiz Header Bar */}
      <div className="bg-[#f4f8f3] border-b border-emerald-900/10 px-4 sm:px-8 py-4">
        <div className="max-w-2xl mx-auto space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-[#0a5c2b]">
            <span>{lang === "en" ? "MODULE 2: PRACTICAL SCENARIO" : "मॉड्यूल 2: व्यावहारिक परिदृश्य"}</span>
            <span>{lang === "en" ? "Question 4 of 10" : "प्रश्न 4/10"}</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div className="bg-[#0a5c2b] h-full rounded-full w-[40%]" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-8 py-8 space-y-6 flex-1 w-full relative">

        {/* Question Title */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {lang === "en"
              ? "A customer is upset about a delay in their service request. How do you first respond?"
              : "एक ग्राहक अपने सेवा अनुरोध में देरी के कारण परेशान है। आप सबसे पहले क्या प्रतिक्रिया देंगे?"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {lang === "en"
              ? "Select the most appropriate initial action from the options below."
              : "नीचे दिए गए विकल्पों में से सबसे उपयुक्त प्रारंभिक कार्रवाई चुनें।"}
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {options.map((opt, idx) => (
            <label
              key={opt.title}
              onClick={() => setSelectedOption(idx)}
              className={`pdf-card p-5 block cursor-pointer transition-all ${
                selectedOption === idx
                  ? "border-2 border-[#0a5c2b] bg-white shadow-md"
                  : "border border-slate-200 bg-white hover:border-emerald-700/40"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Custom Radio Circle */}
                <div
                  className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                    selectedOption === idx ? "border-[#0a5c2b] bg-[#0a5c2b]" : "border-slate-300 bg-white"
                  }`}
                >
                  {selectedOption === idx && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">{opt.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">{opt.desc}</p>
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* Floating Pipo Voice Assistant Button at Bottom Right */}
        <button
          onClick={() => navigate("/assistant")}
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-slate-200 text-[#0a5c2b] shadow-xl flex items-center justify-center border-2 border-emerald-900/20 hover:scale-105 transition-transform"
          title="Ask Pipo with Voice"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>

      </main>

      {/* Sticky Bottom Control Bar */}
      <div className="bg-white border-t border-slate-200 px-4 sm:px-8 py-4 sticky bottom-0 z-10 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-bold hover:bg-slate-50 transition-colors"
          >
            {lang === "en" ? "Back" : "पीछे"}
          </button>
          <button
            onClick={() => navigate("/skill-map")}
            className="px-10 py-3 rounded-xl pdf-button-primary text-sm font-bold shadow-md"
          >
            {lang === "en" ? "Next" : "आगे"}
          </button>
        </div>
      </div>

    </div>
  );
}
