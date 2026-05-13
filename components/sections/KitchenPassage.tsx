// Pure atmospheric threshold — no scroll listeners, no JS.
// Kitchen heat and door-crack light are CSS animations so the passage stays
// alive even when the user pauses scrolling.

export function KitchenPassage() {
  return (
    <div
      className="relative overflow-hidden"
      style={{ height: "28vh" }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes kitchenHeat {
          0%, 100% { opacity: 0.55; }
          50%       { opacity: 0.80; }
        }
        @keyframes doorCrack {
          0%, 100%    { opacity: 0; }
          30%, 70%    { opacity: 1; }
        }
      `}</style>

      {/* Base corridor */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(to bottom, #050505 0%, #060402 22%, #030100 42%, #070502 62%, #0A0806 80%, #0C0A06 100%)",
      }} />

      {/* Left wall — kitchen side */}
      <div className="pointer-events-none absolute inset-y-0 left-0" style={{
        width: "28%",
        background: "linear-gradient(to right, rgba(200,169,106,0.038) 0%, rgba(200,169,106,0.012) 52%, transparent 100%)",
      }} />

      {/* Right wall */}
      <div className="pointer-events-none absolute inset-y-0 right-0" style={{
        width: "24%",
        background: "linear-gradient(to left, rgba(2,1,0,0.85) 0%, rgba(2,1,0,0.50) 44%, transparent 100%)",
      }} />

      {/* Low ceiling */}
      <div className="pointer-events-none absolute inset-x-0 top-0" style={{
        height: "30%",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.24) 55%, transparent 100%)",
      }} />

      {/* Kitchen heat bloom — breathing CSS animation */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0" style={{
        height: "68%",
        animation: "kitchenHeat 4s ease-in-out infinite",
        background: [
          "radial-gradient(ellipse 44% 70% at 22% 100%, rgba(200,169,106,0.16) 0%, rgba(200,169,106,0.06) 44%, transparent 65%)",
          "radial-gradient(ellipse 22% 44% at 8% 88%, rgba(183,214,109,0.04) 0%, transparent 56%)",
        ].join(","),
      }} />

      {/* Service door hairline crack */}
      <div className="pointer-events-none absolute inset-y-0" style={{
        left: "17%",
        width: "1px",
        animation: "doorCrack 6s ease-in-out infinite",
        background: "linear-gradient(to bottom, transparent 14%, rgba(200,169,106,0.10) 34%, rgba(200,169,106,0.18) 54%, rgba(200,169,106,0.10) 74%, transparent 92%)",
      }} />

      {/* Top blend */}
      <div className="pointer-events-none absolute inset-x-0 top-0" style={{
        height: "22%",
        background: "linear-gradient(to bottom, #050505 0%, transparent 100%)",
      }} />

      {/* Bottom blend */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0" style={{
        height: "20%",
        background: "linear-gradient(to top, #050402 0%, transparent 100%)",
      }} />
    </div>
  )
}
