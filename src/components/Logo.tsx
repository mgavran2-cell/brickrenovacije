import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo = ({ className, size = 40 }: LogoProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 400 400"
    width={size}
    height={size}
    className={cn("flex-shrink-0", className)}
    role="img"
    aria-label="Brick"
  >
    <rect x="104" y="80" width="52" height="240" fill="currentColor" className="text-foreground" />
    <g fill="none" strokeWidth="52" strokeLinecap="butt" className="stroke-primary">
      <path d="M164 106 H206 A47 47 0 0 1 206 200 H164" />
      <path d="M164 200 H222 A47 47 0 0 1 222 294 H164" />
    </g>
  </svg>
);

export default Logo;