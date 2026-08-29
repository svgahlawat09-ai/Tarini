// Mock reference data — same shape as backend/data/occupations.csv, so this
// file can be deleted later once the real API is wired (see README-v2.md).
export const occupations = [
  {
    id: "OCC01",
    title: { en: "Boutique / Custom Apparel Maker", hi: "बुटीक / कस्टम परिधान निर्माता" },
    sector: "Apparel",
    skills: ["tailoring", "embroidery", "pattern making"],
    nsqfLevel: 4,
    courses: [
      { id: "C01", name: { en: "Self Employed Tailor", hi: "स्वरोज़गार दर्ज़ी" }, nsqfLevel: 4, durationHours: 300 },
    ],
  },
  {
    id: "OCC02",
    title: { en: "Hand Embroiderer", hi: "हाथ की कढ़ाई कारीगर" },
    sector: "Apparel",
    skills: ["embroidery", "hand stitching", "designing"],
    nsqfLevel: 3,
    courses: [
      { id: "C02", name: { en: "Hand Embroidery Specialist", hi: "हैंड एम्ब्रॉयडरी विशेषज्ञ" }, nsqfLevel: 3, durationHours: 240 },
    ],
  },
  {
    id: "OCC03",
    title: { en: "Garment Quality Inspector", hi: "परिधान गुणवत्ता निरीक्षक" },
    sector: "Apparel",
    skills: ["quality check", "garment inspection", "tailoring"],
    nsqfLevel: 4,
    courses: [
      { id: "C03", name: { en: "Apparel Quality Control", hi: "परिधान गुणवत्ता नियंत्रण" }, nsqfLevel: 4, durationHours: 200 },
    ],
  },
  {
    id: "OCC04",
    title: { en: "Beauty & Wellness Assistant", hi: "ब्यूटी एंड वेलनेस सहायक" },
    sector: "Beauty & Wellness",
    skills: ["makeup", "skincare", "customer handling"],
    nsqfLevel: 3,
    courses: [
      { id: "C04", name: { en: "Beauty Care Assistant", hi: "ब्यूटी केयर असिस्टेंट" }, nsqfLevel: 3, durationHours: 260 },
    ],
  },
  {
    id: "OCC05",
    title: { en: "Retail Sales Associate", hi: "रिटेल सेल्स एसोसिएट" },
    sector: "Retail",
    skills: ["customer handling", "billing", "inventory"],
    nsqfLevel: 3,
    courses: [
      { id: "C05", name: { en: "Retail Sales Associate Course", hi: "रिटेल सेल्स एसोसिएट कोर्स" }, nsqfLevel: 3, durationHours: 180 },
    ],
  },
  {
    id: "OCC06",
    title: { en: "Electrician / Electronics Repair", hi: "इलेक्ट्रीशियन / इलेक्ट्रॉनिक्स मरम्मत" },
    sector: "Electronics",
    skills: ["wiring", "appliance repair", "electrical safety"],
    nsqfLevel: 4,
    courses: [
      { id: "C06", name: { en: "Domestic Electrician", hi: "घरेलू इलेक्ट्रीशियन" }, nsqfLevel: 4, durationHours: 320 },
    ],
  },
];

// Skill keywords the mock extractor recognizes, in both languages/scripts,
// including common Hinglish phrasings — mirrors the few-shot approach in
// Part 5 of the plan so this preview behaves close to how the real LLM will.
const skillKeywords = {
  tailoring: ["tailoring", "tailor", "silai", "सिलाई", "sewing", "stitching"],
  embroidery: ["embroidery", "kadhai", "कढ़ाई", "embroider"],
  "pattern making": ["pattern", "पैटर्न"],
  "hand stitching": ["hand stitch", "haath ki silai"],
  designing: ["design", "डिज़ाइन"],
  "quality check": ["quality check", "quality", "क्वालिटी"],
  "garment inspection": ["inspection", "निरीक्षण"],
  makeup: ["makeup", "मेकअप"],
  skincare: ["skincare", "skin care", "स्किन केयर"],
  "customer handling": ["customer", "ग्राहक"],
  billing: ["billing", "बिलिंग"],
  inventory: ["inventory", "स्टॉक"],
  wiring: ["wiring", "वायरिंग"],
  "appliance repair": ["repair", "मरम्मत", "electronics"],
  "electrical safety": ["electrical", "बिजली"],
};

const experienceWordMap = {
  ek: 1, एक: 1, one: 1,
  do: 2, दो: 2, two: 2,
  teen: 3, तीन: 3, three: 3,
  char: 4, चार: 4, four: 4,
  paanch: 5, पांच: 5, five: 5,
};

/**
 * Mock version of what the real Groq LLM extraction (Part 5) will return.
 * Looks at the actual transcript text instead of a fixed placeholder, so
 * different inputs genuinely produce different profiles in this preview.
 */
export function mockExtractProfile(text) {
  const lower = text.toLowerCase();
  const foundSkills = Object.entries(skillKeywords)
    .filter(([, keywords]) => keywords.some((kw) => lower.includes(kw.toLowerCase())))
    .map(([skill]) => skill);

  // experience: look for a digit, or a spelled-out number word (Hindi/Hinglish)
  let experienceYears = null;
  const digitMatch = text.match(/\d+/);
  if (digitMatch) {
    experienceYears = parseInt(digitMatch[0], 10);
  } else {
    for (const [word, years] of Object.entries(experienceWordMap)) {
      if (lower.includes(word.toLowerCase())) {
        experienceYears = years;
        break;
      }
    }
  }

  const sectorGuess = foundSkills.length
    ? occupations.find((o) => o.skills.some((s) => foundSkills.includes(s)))?.sector ?? "unclear"
    : "unclear";

  return {
    skills: foundSkills.length ? foundSkills : [],
    experienceYears,
    sectorGuess,
  };
}

/** Mirrors the weighted scoring from Part 6 of the plan, on mock data. */
export function mockScoreOccupations(profile) {
  return occupations
    .map((occ) => {
      const matched = occ.skills.filter((s) => profile.skills.includes(s));
      const missing = occ.skills.filter((s) => !profile.skills.includes(s));
      const sectorBonus = occ.sector === profile.sectorGuess ? 5 : 0;
      const expBonus = Math.min(profile.experienceYears || 0, 5) * 2;
      const gapRatio = occ.skills.length ? missing.length / occ.skills.length : 0;
      const score = matched.length * 10 + sectorBonus + expBonus - gapRatio * 8;
      return { ...occ, score: Math.round(score * 10) / 10, matched, missing };
    })
    .sort((a, b) => b.score - a.score);
}
