import Image from "next/image";
import { ChevronDown } from "lucide-react";
import type { Link as LinkType } from "@/lib/types";

interface Props {
  link: LinkType;
}

export default function CloudButton({ link }: Props) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group w-full rounded-full border border-indigo-600/25 bg-white text-indigo-600 pl-3 pr-4 py-2.5 sm:py-3 flex items-center gap-3 sm:gap-3.5 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-soft-lg hover:scale-[1.015] active:scale-[0.985] transition-all duration-300 ease-out"
    >
      {link.thumbnail_url && (
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 bg-indigo-100/60 border border-indigo-200/50 shadow-sm">
          <Image
            src={link.thumbnail_url}
            alt={`${link.label} thumbnail`}
            width={44}
            height={44}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <span className="flex-1 text-center text-label-lg text-[0.8125rem] sm:text-[0.875rem]">
        {link.label}
      </span>
      <ChevronDown className="w-4 h-4 flex-shrink-0 opacity-40 group-hover:opacity-90 -rotate-90 group-hover:rotate-0 transition-all duration-300" />
    </a>
  );
}
