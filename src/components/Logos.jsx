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
      <polygon
        points="60,6 110,34 110,86 60,114 10,86 10,34"
        fill="none"
        stroke="#111827"
        strokeWidth="7"
      />
      <g fill="#111827">
        <rect x="36" y="34" width="9" height="52" rx="3" />
        <path
          d="M45 34 H74 Q92 34 92 60 Q92 86 74 86 H45 Z"
          fill="none"
          stroke="#111827"
          strokeWidth="9"
        />
        <rect x="36" y="55" width="56" height="10" rx="2" />
      </g>
    </svg>
  )
}
