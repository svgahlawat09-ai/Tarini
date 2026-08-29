// A simple animated "voice waveform" made of bars.
// This is our signature visual element - it shows up on the hero,
// the voice demo page, and as a subtle divider between sections,
// because the whole product is about VOICE interaction.
//
// `active` = true makes the bars animate (like someone is speaking)
// `color` lets us reuse this in gold or paper-white depending on background

export default function Waveform({ active = true, color = "gold", bars = 24, className = "" }) {
  const colorClass = color === "gold" ? "bg-gold" : "bg-paper";

  return (
    <div className={`flex items-end gap-[3px] h-10 ${className}`} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={`w-1 rounded-full ${colorClass} ${active ? "animate-wave" : ""}`}
          style={{
            height: active ? undefined : "20%",
            animationDelay: `${(i % 8) * 0.09}s`,
          }}
        />
      ))}
    </div>
  );
}
