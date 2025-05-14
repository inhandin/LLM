import { cn } from "@/lib/utils";

interface BusterystageLogoProps {
  className?: string;
}

export const BusterystageLogo = ({ className }: BusterystageLogoProps) => {
  return (
    <svg
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("fill-current", className)}
    >
      <rect width="40" height="40" rx="8" fill="currentColor" opacity="0.2" />
      <path 
        d="M10 10H18C21.3137 10 24 12.6863 24 16C24 19.3137 21.3137 22 18 22H10V10Z" 
        fill="currentColor" 
      />
      <path 
        d="M10 18H30V26C30 29.3137 27.3137 32 24 32H16C12.6863 32 10 29.3137 10 26V18Z" 
        fill="currentColor" 
        fillOpacity="0.8" 
      />
      <circle cx="28" cy="14" r="4" fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
};