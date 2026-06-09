export function MobileStatusBar() {
  return (
    <div className="flex justify-between items-center px-6 py-3">
      <span className="text-xs font-bold text-[#6B7785]">9:41</span>
      <div className="flex gap-1 items-center">
        <div className="h-4 w-4 rounded-full bg-[#6B7785]" />
        <div className="h-2.5 w-5 rounded border border-[#6B7785]" />
      </div>
    </div>
  );
}
