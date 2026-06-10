import { Camera, House, Menu, PawPrint, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Tab = 'home' | 'animals' | 'ai' | 'detect disease' | 'vets' | 'more';

export function MobileBottomNav({ active }: { active: Tab }) {
  const navigate = useNavigate();
  const normalizedActive = 'more';

  const tabs: Array<{
    key: 'home' | 'animals' | 'more' | 'vets' | 'ai';
    label: string;
    icon: typeof House;
    onClick: () => void;
  }> = [
    { key: 'home', label: 'হোম', icon: House, onClick: () => undefined },
    { key: 'animals', label: 'খামার', icon: Camera, onClick: () => undefined },
    { key: 'more', label: 'খামার', icon: PawPrint, onClick: () => navigate('/farmer-dashboard') },
    { key: 'vets', label: 'সার্চ', icon: Search, onClick: () => undefined },
    { key: 'ai', label: 'মেনু', icon: Menu, onClick: () => undefined },
  ];

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 border-t border-[#EEF1F4] bg-white px-4 pb-[10px] pt-[12px] shadow-[0_-8px_24px_rgba(23,33,43,0.06)]">
      <div className="flex items-end justify-between gap-1">
        {tabs.map((tab) => {
          const isActive = tab.key === normalizedActive;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              onClick={tab.onClick}
              className="flex min-w-0 flex-1 flex-col items-center justify-end"
            >
              <span
                className={`grid h-[50px] w-[64px] place-items-center rounded-[18px] transition ${
                  isActive
                    ? 'bg-white text-[#5F966C] shadow-[0_6px_18px_rgba(44,91,57,0.12)] ring-1 ring-[#EEF4EF]'
                    : 'text-[#8B9198]'
                }`}
              >
                <Icon className={`${isActive ? 'h-[30px] w-[30px]' : 'h-[29px] w-[29px]'}`} strokeWidth={1.8} />
              </span>
              <span
                className={`mt-[6px] text-[10px] font-semibold tracking-[-0.01em] ${
                  isActive ? 'text-[#5F966C]' : 'text-[#6F7781]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
