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
          <stop offset="0.45" stopColor="#c2ccd6" />
          <stop offset="0.55" stopColor="#9aa4b0" />
          <stop offset="1" stopColor="#5f6975" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#toyotaChrome)" strokeWidth="6">
        <ellipse cx="60" cy="60" rx="50" ry="33" />
        <ellipse cx="60" cy="60" rx="28" ry="50" />
        <ellipse cx="60" cy="60" rx="44" ry="13" />
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
          <stop offset="0.34" stopColor="#d3dbe4" />
          <stop offset="0.5" stopColor="#9099a6" />
          <stop offset="0.66" stopColor="#c7d0da" />
          <stop offset="1" stopColor="#565f6b" />
        </linearGradient>
        <linearGradient id="daciaText" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#b6c0cc" />
          <stop offset="1" stopColor="#69727e" />
        </linearGradient>
      </defs>
      <path
        d="M60 8 C102 28 102 92 60 112 C18 92 18 28 60 8 Z"
        fill="url(#daciaMetal)"
        stroke="#2f343b"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M60 17 C92 34 92 86 60 103 C28 86 28 34 60 17 Z"
        fill="none"
        stroke="#eef2f6"
        strokeWidth="1.4"
        opacity="0.65"
      />
      <text
        x="60"
        y="55"
        textAnchor="middle"
        fontFamily="'Helvetica Neue', Arial, sans-serif"
        fontWeight="800"
        fontSize="21"
        letterSpacing="2.5"
        fill="url(#daciaText)"
        stroke="#3a4049"
        strokeWidth="0.5"
      >
        DACIA
      </text>
      <text
        x="60"
        y="75"
        textAnchor="middle"
        fontFamily="'Helvetica Neue', Arial, sans-serif"
        fontWeight="600"
        fontSize="8.5"
        letterSpacing="4.5"
        fill="#2f343b"
      >
        AUTO
      </text>
    </svg>
  )
}
