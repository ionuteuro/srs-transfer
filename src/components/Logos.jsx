export function ToyotaLogo({ size = 44 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="Toyota"
    >
      <g fill="none" stroke="#EB0A1E" strokeWidth="7">
        <ellipse cx="60" cy="60" rx="50" ry="33" />
        <ellipse cx="60" cy="60" rx="33" ry="50" />
        <path d="M28 60 Q60 26 92 60" />
        <path d="M28 60 Q60 94 92 60" />
      </g>
    </svg>
  )
}

export function DaciaLogo({ size = 44 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="Dacia"
    >
      <defs>
        <linearGradient id="daciaChrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f6f9" />
          <stop offset="0.45" stopColor="#aab4c0" />
          <stop offset="0.55" stopColor="#7c8694" />
          <stop offset="1" stopColor="#454c56" />
        </linearGradient>
      </defs>
      <polygon
        points="60,6 110,60 60,114 10,60"
        fill="url(#daciaChrome)"
        stroke="#3a3f47"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <text
        x="60"
        y="58"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="22"
        letterSpacing="1.5"
        fill="#1f2630"
      >
        DACIA
      </text>
      <text
        x="60"
        y="78"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="600"
        fontSize="9"
        letterSpacing="3"
        fill="#1f2630"
      >
        AUTO
      </text>
    </svg>
  )
}
