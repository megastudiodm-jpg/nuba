import React from 'react';

interface NubianOpposingTrianglesProps {
  className?: string;
  height?: number;
  orientation?: 'horizontal' | 'vertical';
  repeatCount?: number;
}

/**
 * Authentic Aswan Nubian House Opposing / Interlocking Triangles
 * Directly inspired by traditional Aswan Nubian architecture (West Suhail, Elephantine, Heissa)
 * As seen in the authentic photo: Yellow opposite Blue, Green opposite Red, Cyan opposite Orange!
 */
export const NubianOpposingTriangles: React.FC<NubianOpposingTrianglesProps> = ({
  className = '',
  height = 18,
  orientation = 'horizontal',
  repeatCount = 12,
}) => {
  if (orientation === 'vertical') {
    return (
      <div className={`flex flex-col overflow-hidden select-none ${className}`} aria-hidden="true">
        <svg
          viewBox="0 0 24 160"
          className="w-6 h-auto"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Vertical interlocking opposing triangles (pointing left & right like Nubian pillars) */}
          {/* Unit 1: Yellow right, Blue left */}
          <polygon points="0,0 0,40 24,20" fill="#FACC15" />
          <polygon points="24,20 24,60 0,40" fill="#0284C7" />
          {/* Unit 2: Green right, Magenta/Red left */}
          <polygon points="0,40 0,80 24,60" fill="#16A34A" />
          <polygon points="24,60 24,100 0,80" fill="#E11D48" />
          {/* Unit 3: Yellow right, Blue left */}
          <polygon points="0,80 0,120 24,100" fill="#FACC15" />
          <polygon points="24,100 24,140 0,120" fill="#0284C7" />
          {/* Unit 4: Green right, Magenta/Red left */}
          <polygon points="0,120 0,160 24,140" fill="#16A34A" />
          <polygon points="24,140 24,180 0,160" fill="#E11D48" />
        </svg>
      </div>
    );
  }

  // Horizontal Opposing Triangles Frieze / Ribbon
  // Top triangles point downward (▼), bottom triangles point upward (▲) interlocking
  return (
    <div
      className={`w-full overflow-hidden select-none flex items-center ${className}`}
      style={{ height: `${height}px` }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 80 20"
        className="w-full h-full"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="nubianOpposingPattern" width="80" height="20" patternUnits="userSpaceOnUse">
            {/* Pair 1: Blue down ▼, Yellow up ▲ */}
            <polygon points="0,0 20,0 10,20" fill="#0284C7" />
            <polygon points="10,20 30,20 20,0" fill="#FACC15" />

            {/* Pair 2: Green down ▼, Magenta/Rose up ▲ */}
            <polygon points="20,0 40,0 30,20" fill="#16A34A" />
            <polygon points="30,20 50,20 40,0" fill="#E11D48" />

            {/* Pair 3: Cyan down ▼, Sun Orange up ▲ */}
            <polygon points="40,0 60,0 50,20" fill="#06B6D4" />
            <polygon points="50,20 70,20 60,0" fill="#F59E0B" />

            {/* Pair 4: Magenta/Rose down ▼, Blue up ▲ */}
            <polygon points="60,0 80,0 70,20" fill="#E11D48" />
            <polygon points="70,20 90,20 80,0" fill="#0284C7" />
          </pattern>
        </defs>
        <rect width="100%" height="20" fill="url(#nubianOpposingPattern)" />
      </svg>
    </div>
  );
};

/**
 * Architectural Nubian House Archway Banner
 * Featuring the opposing triangles, Nubian eyes, clay jar, stars, and the memory of the people motto
 */
export const NubianHouseMuralBanner: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-3xl border-2 border-cyan-200/90 shadow-md overflow-hidden relative">
      {/* Top Opposing Triangles Band */}
      <NubianOpposingTriangles height={16} />

      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-cyan-50/70 via-white to-amber-50/60">
        {/* Left Motifs: Nubian Eye & Sun Star */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-100 border border-cyan-300 flex items-center justify-center text-cyan-900 text-2xl shadow-inner shrink-0">
            𓁹
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-cyan-900 bg-cyan-200/80 px-2.5 py-0.5 rounded-full">
                طراز بيوت أسوان
              </span>
              <span className="text-amber-500 text-sm">★</span>
              <span className="text-rose-500 text-sm">★</span>
              <span className="text-blue-500 text-sm">★</span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
              زخارف المثلثات المتقابلة وتراث العمارة النوبية
            </h3>
          </div>
        </div>

        {/* Center Quote from the photo */}
        <div className="bg-[#0b3860] text-amber-300 px-4 py-2 rounded-2xl border-2 border-amber-300/60 text-xs sm:text-sm font-black shadow-sm text-center flex items-center gap-2">
          <span className="text-base">𓉐</span>
          <span>«رسومات مو للزينة.. هذي ذاكرة شعب»</span>
        </div>
      </div>

      {/* Bottom Opposing Triangles Band */}
      <NubianOpposingTriangles height={12} />
    </div>
  );
};
