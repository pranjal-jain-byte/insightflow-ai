interface Props {
  size?: number;
  className?: string;
  variant?: "brand" | "mono" | "white";
}

export function InsightFlowIcon({ size = 24, className = "", variant = "brand" }: Props) {
  if (variant === "white") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden
      >
        <path d="M 12 36 C 12 21 21 12 36 12" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M 14 38 C 28 38 38 28 38 14" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeOpacity="0.5" />
        <circle cx="12" cy="36" r="3.5" fill="#FFFFFF" />
        <circle cx="36" cy="12" r="4" fill="#FFFFFF" />
        <path d="M 24 18 L 30 24 L 24 30 L 18 24 Z" fill="#FFFFFF" />
        <circle cx="24" cy="24" r="1.5" fill="#172554" />
      </svg>
    );
  }

  if (variant === "mono") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden
      >
        <path d="M 12 36 C 12 21 21 12 36 12" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M 14 38 C 28 38 38 28 38 14" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeOpacity="0.5" />
        <circle cx="12" cy="36" r="3.5" fill="currentColor" />
        <circle cx="36" cy="12" r="4" fill="currentColor" />
        <path d="M 24 18 L 30 24 L 24 30 L 18 24 Z" fill="currentColor" />
        <circle cx="24" cy="24" r="1.5" fill="var(--background, #FFFFFF)" />
      </svg>
    );
  }

  const gradId = `if-grad-${size}`;
  const sparkId = `if-spark-${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="8" y1="40" x2="40" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#172554" />
          <stop offset="50%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
        <linearGradient id={sparkId} x1="18" y1="18" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
      {/* Base geometry: Flow wave & Insight Spark */}
      <path d="M 12 36 C 12 21 21 12 36 12" stroke={`url(#${gradId})`} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M 14 38 C 28 38 38 28 38 14" stroke="#4F46E5" strokeWidth="3.5" strokeLinecap="round" strokeOpacity="0.4" />
      {/* Data points in flow */}
      <circle cx="12" cy="36" r="3.5" fill="#172554" />
      <circle cx="36" cy="12" r="4" fill="#38BDF8" />
      {/* Central insight diamond */}
      <path d="M 24 18 L 30 24 L 24 30 L 18 24 Z" fill={`url(#${sparkId})`} />
      <circle cx="24" cy="24" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}
