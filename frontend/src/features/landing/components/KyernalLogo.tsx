export default function KyernalLogo({
  size = 28,
  dark = false,
}: {
  size?: number;
  dark?: boolean;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect
        width="32"
        height="32"
        rx="8"
        fill={dark ? '#f5f0eb' : '#141416'}
        stroke={dark ? '#e8e0d5' : '#27272a'}
        strokeWidth="1"
      />
      <path
        d="M12 9V23"
        stroke={dark ? '#1c1917' : '#f4f4f5'}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M21 9L12 16L21 23"
        stroke={dark ? '#1c1917' : '#f4f4f5'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="21" cy="9" r="2.5" fill="#30a46c" />
    </svg>
  );
}
