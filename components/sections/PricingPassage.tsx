export function PricingPassage() {
  return (
    <div
      className="relative overflow-hidden"
      style={{ height: "28vh" }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes pricingWarmth {
          0%, 100% { opacity: 0.60; }
          50%       { opacity: 0.84; }
        }
        @keyframes pricingShimmer {
          0%        { opacity: 0; transform: translateY(4%); }
          20%, 55%  { opacity: 1; transform: translateY(-6%); }
          80%, 100% { opacity: 0; transform: translateY(-12%); }
        }
      `}</style>

      {/* Base */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(to bottom, #050402 0%, #060503 22%, #040200 42%, #060402 62%, #080604 80%, #080503 100%)",
      }} />

      {/* Right side — counter direction */}
      <div className="pointer-events-none absolute inset-y-0 right-0" style={{
        width: "32%",
        background: "linear-gradient(to left, rgba(200,169,106,0.038) 0%, rgba(200,169,106,0.012) 52%, transparent 100%)",
      }} />

      {/* Left wall */}
      <div className="pointer-events-none absolute inset-y-0 left-0" style={{
        width: "22%",
        background: "linear-gradient(to right, rgba(2,1,0,0.78) 0%, rgba(2,1,0,0.42) 44%, transparent 100%)",
      }} />

      {/* Ceiling */}
      <div className="pointer-events-none absolute inset-x-0 top-0" style={{
        height: "26%",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)",
      }} />

      {/* Counter warmth — right of centre */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0" style={{
        height: "72%",
        animation: "pricingWarmth 5.5s ease-in-out infinite",
        background: [
          "radial-gradient(ellipse 48% 70% at 72% 100%, rgba(200,169,106,0.16) 0%, rgba(200,169,106,0.06) 44%, transparent 65%)",
          "radial-gradient(ellipse 30% 45% at 90% 80%, rgba(200,169,106,0.08) 0%, transparent 58%)",
        ].join(","),
      }} />

      {/* Surface shimmer */}
      <div className="pointer-events-none absolute inset-x-0" style={{
        height: "5%", top: "48%",
        animation: "pricingShimmer 9s ease-in-out infinite",
        background: "linear-gradient(to bottom, transparent 0%, rgba(200,169,106,0.020) 35%, rgba(200,169,106,0.028) 50%, rgba(255,255,255,0.010) 68%, transparent 100%)",
      }} />

      {/* Top blend */}
      <div className="pointer-events-none absolute inset-x-0 top-0" style={{
        height: "22%",
        background: "linear-gradient(to bottom, #050402 0%, transparent 100%)",
      }} />

      {/* Bottom blend */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0" style={{
        height: "20%",
        background: "linear-gradient(to top, #050402 0%, transparent 100%)",
      }} />
    </div>
  )
}
