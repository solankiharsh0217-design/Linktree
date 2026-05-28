interface Props {
  label: string;
  delay?: string;
}

export default function ScallopedDivider({ label, delay }: Props) {
  return (
    <div className="relative w-full py-4 animate-fade-in" style={{ animationDelay: delay }}>
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-white/20" />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50">
          {label}
        </span>
        <div className="flex-1 h-px bg-white/20" />
      </div>
    </div>
  );
}
