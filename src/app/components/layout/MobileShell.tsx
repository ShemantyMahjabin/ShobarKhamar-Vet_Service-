import type { ReactNode } from 'react';

type MobileShellProps = {
  children: ReactNode;
  className?: string;
};

export function MobileShell({ children, className = '' }: MobileShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#e8f7ef_0%,#f8fcfa_45%,#edf4f0_100%)] px-3 py-4 sm:px-6">
      <div className="mx-auto w-full max-w-[390px] overflow-hidden rounded-[34px] border border-[#CADAD2] bg-[#F8FCFA] shadow-[0_24px_80px_rgba(23,33,43,0.14)]">
        <div className={`relative min-h-[844px] ${className}`}>{children}</div>
      </div>
    </div>
  );
}
