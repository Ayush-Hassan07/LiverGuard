type LiverMarkProps = { className?: string };

export default function LiverMark({ className }: LiverMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      role="img"
      aria-label="LiverGuard liver mark"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5.3 7.4c4.8-2.4 11.1-2.3 16.2-.8 3.6 1 5.3 3.1 5.2 5.6-.1 2.7-2.5 3.5-5.4 4.2-2.6.6-3.9 1.6-5.4 4-1.6 2.5-3.8 4.1-6.6 3.8-3.8-.4-6.3-3.1-6.3-7.1 0-3.8.7-7.8 2.3-9.7Z" fill="currentColor" />
      <path d="M6.8 9.5c4.2 1.2 8.2 1.5 12.3 1.1 2.2-.2 4.5-.8 6.2-1.7" fill="none" stroke="rgba(255,255,255,.72)" strokeLinecap="round" strokeWidth="1.4" />
    </svg>
  );
}
