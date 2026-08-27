export default function Logo({ className = 'w-7 h-7' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#logoGradient)" />
      <path
        d="M11 9H18L22 13V22C22 23.1046 21.1046 24 20 24H11C9.89543 24 9 23.1046 9 22V11C9 9.89543 9.89543 9 11 9Z"
        fill="#FFFFFF"
        fillOpacity="0.25"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 16.5L15.5 19L20.5 13.5"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="logoGradient"
          x1="2"
          y1="2"
          x2="30"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0D6E6E" />
          <stop offset="1" stopColor="#148F8F" />
        </linearGradient>
      </defs>
    </svg>
  );
}
