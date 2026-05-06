import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "ghost" | "accent";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base =
  "inline-flex items-center justify-center font-sans uppercase tracking-wider-2 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed";

const sizeClasses: Record<Size, string> = {
  sm: "text-[10px] px-3 py-2",
  md: "text-xs px-5 py-3",
  lg: "text-sm px-7 py-4",
};

const variantClasses: Record<Variant, string> = {
  primary: "bg-ink text-sand hover:bg-sea",
  ghost: "bg-transparent text-ink border border-ink hover:bg-ink hover:text-sand",
  accent: "bg-terracotta text-sand hover:brightness-95",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={`${base} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    />
  ),
);

Button.displayName = "Button";
