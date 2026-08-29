// Dynamic Audio-Reactive Waveform Visualizer
// Supports color palettes: teal, emerald, amber, gold, indigo, white

export default function Waveform({
  active = true,
  color = "teal",
  bars = 28,
  className = "",
  volumeLevel = 1,
}) {
  let colorClass = "bg-teal-600";
  if (color === "amber") colorClass = "bg-amber-500";
  if (color === "emerald") colorClass = "bg-emerald-500";
  if (color === "gold") colorClass = "bg-amber-400";
  if (color === "indigo") colorClass = "bg-indigo-600";
  if (color === "white") colorClass = "bg-white";

  return (
    <div
      className={`flex items-end justify-center gap-[3px] h-10 ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: bars }).map((_, i) => {
        // Vary base heights for visual texture
        const heightPercent = 20 + ((i * 17) % 65);
        return (
          <span
            key={i}
            className={`w-1 rounded-full ${colorClass} ${
              active ? "animate-wave" : "opacity-30"
            }`}
            style={{
              height: active ? `${Math.min(heightPercent * volumeLevel, 100)}%` : "20%",
              animationDelay: `${(i % 8) * 0.08}s`,
              transition: "height 0.1s ease",
            }}
          />
        );
      })}
    </div>
  );
}
