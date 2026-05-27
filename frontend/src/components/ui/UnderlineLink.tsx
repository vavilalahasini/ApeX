import Link from "next/link";
import { type ComponentProps } from "react";

type UnderlineLinkProps = ComponentProps<typeof Link>;

export function UnderlineLink({
  className = "",
  children,
  href,
  ...props
}: UnderlineLinkProps) {
  return (
    <Link
      href={href}
      className={`group relative inline-block ${className}`}
      {...props}
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-full h-px bg-accent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-200 shadow-[0_0_8px_rgba(255,255,255,0.28)]" />
    </Link>
  );
}
