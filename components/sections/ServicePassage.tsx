export function ServicePassage() {
  return (
    <div
      className="relative overflow-hidden"
      style={{ height: "28vh" }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes serviceWarmth {
          0%, 100% { opacity: 0.60; }
          50%       { opacity: 0.85; }
        }
        @keyframes serviceShimmer {
          0%        { opacity: 0; transform: translateY(6%); }
          20%, 55%  { opacity: 1; transform: translateY(-10%); }
          80%, 100% { opacity: 0; transform: translateY(-18%); }
        }
      `}</style>

      {/* Base */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(to bottom, #050402 0%, #060402 20%, #040200 40%, #070503 60%, #0A0806 80%, #0A0806 100%)",
      }} />

      {/* Side walls */}
      <div className="pointer-events-none absolute inset-y-0 left-0" style={{
        width: "20%",
        background: "linear-gradient(to right, rgba(2,1,0,0.88) 0%, rgba(2,1,0,0.52) 44%, transparent 100%)",
      }} />
      <div className="pointer-events-none absolute inset-y-0 right-0" style={{
        width: "20%",
        background: "linear-gradient(to left, rgba(2,1,0,0.88) 0%, rgba(2,1,0,0.52) 44%, transparent 100%)",
      }} />

      {/* Ceiling */}
      <div className="pointer-events-none absolute inset-x-0 top-0" style={{
        height: "22%",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)",
      }} />

      {/* Dining warmth */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0" style={{
        height: "72%",
        animation: "serviceWarmth 4.5s ease-in-out infinite",
        background: [
          "radial-gradient(ellipse 58% 72% at 62% 100%, rgba(200,169,106,0.17) 0%, rgba(200,169,106,0.07) 42%, transparent 65%)",
          "radial-gradient(ellipse 38% 50% at 38% 100%, rgba(200,169,106,0.08) 0%, transparent 58%)",
        ].join(","),
      }} />

      {/* Threshold shimmer */}
      <div className="pointer-events-none absolute inset-x-0" style={{
        height: "7%", top: "44%",
        animation: "serviceShimmer 7s ease-in-out infinite",
        background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.012) 28%, rgba(255,255,255,0.020) 50%, rgba(200,169,106,0.016) 70%, transparent 100%)",
      }} />

      {/* Top blend */}
      <div className="pointer-events-none absolute inset-x-0 top-0" style={{
        height: "22%",
        background: "linear-gradient(to bottom, #050402 0%, transparent 100%)",
      }} />

      {/* Bottom blend */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0" style={{
        height: "20%",
        background: "linear-gradient(to top, #0a0806 0%, transparent 100%)",
      }} />
    </div>
  )
}
