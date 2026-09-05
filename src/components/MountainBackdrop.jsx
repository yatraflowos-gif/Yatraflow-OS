// Lightweight CSS-only mountain silhouette — structural placeholder only.
// Replace with founder-supplied hero art / background asset when available.
export default function MountainBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-base-950 via-base-900 to-base-950" />
      <svg
        className="absolute bottom-0 left-0 w-full opacity-40"
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
      >
        <polygon points="0,300 0,180 150,60 280,160 420,40 600,190 760,90 900,200 1050,70 1200,180 1200,300" fill="#111827" />
        <polygon points="0,300 0,230 200,140 400,220 650,120 850,230 1050,150 1200,230 1200,300" fill="#0d1220" />
      </svg>
      <div className="absolute top-10 left-10 w-1.5 h-1.5 bg-accent-500 rounded-full" />
      <div className="absolute top-24 right-16 w-1.5 h-1.5 bg-accent-500 rounded-full" />
      <div className="absolute bottom-1/3 left-1/4 w-4 h-4 border border-accent-500/40 rounded-full" />
    </div>
  )
}
