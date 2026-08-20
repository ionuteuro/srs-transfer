export function ToyotaLogo({ size = 44 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="Toyota"
    >
      <defs>
        <linearGradient id="toyotaChrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#aeb8c4" />
          <stop offset="1" stopColor="#5f6975" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#toyotaChrome)" strokeWidth="7">
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
        <linearGradient id="daciaMetal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbfdff" />
          <stop offset="0.35" stopColor="#c7d0da" />
          <stop offset="0.5" stopColor="#8b97a5" />
          <stop offset="0.65" stopColor="#c7d0da" />
          <stop offset="1" stopColor="#5a636f" />
        </linearGradient>
        <linearGradient id="daciaText" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#aeb8c4" />
          <stop offset="1" stopColor="#69727e" />
        </linearGradient>
      </defs>
      <polygon
        points="60,7 112,60 60,113 8,60"
        fill="url(#daciaMetal)"
        stroke="#2f343b"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <polygon
        points="60,16 103,60 60,104 17,60"
        fill="none"
        stroke="#eef2f6"
        strokeWidth="1.5"
        opacity="0.7"
      />
      <text
        x="60"
        y="58"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="22"
        letterSpacing="2"
        fill="url(#daciaText)"
        stroke="#3a4049"
        strokeWidth="0.5"
      >
        DACIA
      </text>
      <text
        x="60"
        y="80"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="600"
        fontSize="9"
        letterSpacing="4"
        fill="#2f343b"
      >
        AUTO
      </text>
    </svg>
  )
}
