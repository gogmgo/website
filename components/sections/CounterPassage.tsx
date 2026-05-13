export function CounterPassage() {
  return (
    <div
      className="relative overflow-hidden"
      style={{ height: "28vh" }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes counterWarmth {
          0%, 100% { opacity: 0.58; }
          50%       { opacity: 0.82; }
        }
        @keyframes counterShimmer {
          0%        { opacity: 0; transform: translateY(6%); }
          20%, 55%  { opacity: 1; transform: translateY(-8%); }
          80%, 100% { opacity: 0; transform: translateY(-14%); }
        }
      `}</style>

      {/* Base */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(to bottom, #0a0806 0%, #080604 22%, #050402 42%, #060503 62%, #070503 80%, #060402 100%)",
      }} />

      {/* Left wall — counter side */}
      <div className="pointer-events-none absolute inset-y-0 left-0" style={{
        width: "30%",
        background: "linear-gradient(to right, rgba(200,169,106,0.032) 0%, rgba(200,169,106,0.010) 52%, transparent 100%)",
      }} />

      {/* Right wall */}
      <div className="pointer-events-none absolute inset-y-0 right-0" style={{
        width: "22%",
        background: "linear-gradient(to left, rgba(2,1,0,0.80) 0%, rgba(2,1,0,0.45) 44%, transparent 100%)",
      }} />

      {/* Ceiling */}
      <div className="pointer-events-none absolute inset-x-0 top-0" style={{
        height: "26%",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.20) 55%, transparent 100%)",
      }} />

      {/* Counter warmth */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0" style={{
        height: "70%",
        animation: "counterWarmth 5s ease-in-out infinite",
        background: [
          "radial-gradient(ellipse 50% 72% at 30% 100%, rgba(200,169,106,0.15) 0%, rgba(200,169,106,0.06) 44%, transparent 65%)",
          "radial-gradient(ellipse 32% 48% at 55% 100%, rgba(200,169,106,0.07) 0%, transparent 58%)",
        ].join(","),
      }} />

      {/* Counter surface shimmer */}
      <div className="pointer-events-none absolute inset-x-0" style={{
        height: "5%", top: "50%",
        animation: "counterShimmer 8s ease-in-out infinite",
        background: "linear-gradient(to bottom, transparent 0%, rgba(200,169,106,0.018) 35%, rgba(200,169,106,0.026) 50%, rgba(255,255,255,0.010) 68%, transparent 100%)",
      }} />

      {/* Top blend */}
      <div className="pointer-events-none absolute inset-x-0 top-0" style={{
        height: "22%",
        background: "linear-gradient(to bottom, #0a0806 0%, transparent 100%)",
      }} />

      {/* Bottom blend */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0" style={{
        height: "20%",
        background: "linear-gradient(to top, #050402 0%, transparent 100%)",
      }} />
    </div>
  )
}
