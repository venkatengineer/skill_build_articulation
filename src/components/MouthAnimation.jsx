export default function MouthAnimation({ isActive = false }) {
  return (
    <div
      className="flex flex-col items-center justify-center p-6 bg-[#FAF7F2] rounded-2xl border border-[#EFE9E0] text-center"
      role="img"
      aria-label="Speech articulation visualizer"
    >
      <svg
        width="140"
        height="100"
        viewBox="0 0 140 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-4"
      >
        {/* Soft Head Contour */}
        <path
          d="M 20,50 Q 20,10 70,10 Q 120,10 120,50 Q 120,90 70,90 Q 20,90 20,50 Z"
          fill="#FCE4EC"
          stroke="#F8BBD0"
          strokeWidth="3"
        />

        {/* Outer Lips */}
        <path
          d={
            isActive
              ? 'M 45,52 Q 70,35 95,52 Q 70,78 45,52 Z'
              : 'M 45,55 Q 70,48 95,55 Q 70,68 45,55 Z'
          }
          fill="#6A1B38"
          className="transition-all duration-300 ease-in-out"
        />

        {/* Tongue / Interior Accent */}
        {isActive && (
          <path
            d="M 55,56 Q 70,45 85,56 Q 70,65 55,56 Z"
            fill="#F8BBD0"
            className="animate-pulse"
          />
        )}

        {/* Upper Teeth */}
        <path
          d="M 50,50 L 90,50"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-sm font-semibold text-[#65605B]">
        {isActive ? 'Analyzing phonetic resonance & mouth position...' : 'Phonetic Position Ready'}
      </span>
    </div>
  );
}
