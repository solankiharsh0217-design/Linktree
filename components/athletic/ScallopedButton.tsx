import { ArrowRight } from "lucide-react";
import type { Link as LinkType } from "@/lib/types";

interface Props {
  link: LinkType;
  icon?: React.ReactNode;
  delay?: string;
  subtitle?: string;
}

const SCALLOP_MASK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'%3E%3Cpath d='M0 15 Q 2.5 0 5 15 T 10 15 T 15 15 T 20 15 T 25 15 T 30 15 T 35 15 T 40 15 T 45 15 T 50 15 T 55 15 T 60 15 T 65 15 T 70 15 T 75 15 T 80 15 T 85 15 T 90 15 T 95 15 T 100 15 V 85 Q 97.5 100 95 85 T 90 85 T 85 85 T 80 85 T 75 85 T 70 85 T 65 85 T 60 85 T 55 85 T 50 85 T 45 85 T 40 85 T 35 85 T 30 85 T 25 85 T 20 85 T 15 85 T 10 85 T 5 85 T 0 85 Z' fill='black'/%3E%3C/svg%3E";

export default function ScallopedButton({ link, icon, delay, subtitle }: Props) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative w-full h-[7rem] bg-white text-black shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-fade-in-up flex items-center px-8"
      style={{
        animationDelay: delay,
        maskImage: `url("${SCALLOP_MASK}")`,
        maskSize: "100% 100%",
        WebkitMaskImage: `url("${SCALLOP_MASK}")`,
        WebkitMaskSize: "100% 100%",
      }}
    >
      <div className="flex items-center gap-5 w-full">
        {icon && (
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center group-hover:bg-black/10 transition-colors duration-300">
            {icon}
          </div>
        )}
        <div className="flex-1 text-left flex flex-col">
          <span className="font-extrabold text-lg leading-tight tracking-tight uppercase">
            {link.label}
          </span>
          {subtitle && (
            <span className="text-xs font-medium text-black/50 tracking-wider uppercase mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
        <ArrowRight className="w-5 h-5 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </div>
    </a>
  );
}
