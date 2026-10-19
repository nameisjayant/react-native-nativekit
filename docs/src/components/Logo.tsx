import { useId } from "react";

/** NativeKit mark: a native sheet rising from the bottom with a button inside, inlined so it stays crisp. */
export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  const id = useId();
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 72 72" role="img" aria-label="NativeKit logo">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#059669" />
          <stop offset="1" stopColor="#0F766E" />
        </linearGradient>
      </defs>
      <rect width="72" height="72" rx="18" fill={`url(#${id})`} />
      <rect x="18" y="14" width="36" height="10" rx="5" fill="#FFFFFF" fillOpacity="0.35" />
      <path fill="#FFFFFF" d="M12 42a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12v30H12z" />
      <rect x="30" y="35" width="12" height="3" rx="1.5" fill={`url(#${id})`} fillOpacity="0.45" />
      <rect x="20" y="46" width="32" height="12" rx="6" fill={`url(#${id})`} />
    </svg>
  );
}
