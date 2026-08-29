export default function ScoreBar({ score, max = 30 }) {
  const pct = Math.max(0, Math.min(100, (score / max) * 100));
  return (
    <div className="w-full bg-ink/10 rounded-full h-3">
      <div
        className="h-3 rounded-full bg-gradient-to-r from-thread-green to-marigold transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
