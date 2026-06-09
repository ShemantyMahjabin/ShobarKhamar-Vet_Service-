import { useNavigate } from 'react-router-dom';

type Tab = 'home' | 'animals' | 'ai' | 'vets' | 'more';

export function MobileBottomNav({ active }: { active: Tab }) {
  const navigate = useNavigate();

  const tabs: Array<{ key: Tab; label: string; icon: string; onClick: () => void }> = [
    { key: 'home', label: 'Home', icon: 'H', onClick: () => navigate('/farmer-dashboard') },
    { key: 'animals', label: 'Animals', icon: 'A', onClick: () => navigate('/farm-management') },
    { key: 'ai', label: 'Detect disease', icon: 'DD', onClick: () => navigate('/ai-detection') },
    { key: 'vets', label: 'Vets', icon: 'V', onClick: () => navigate('/booking') },
    { key: 'more', label: 'Vaccine', icon: 'VC', onClick: () => navigate('/vaccination-management') },
  ];

  return (
    <div className="sticky bottom-0 mt-6 border-t border-[#DCE7DF] bg-white/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between">
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button key={tab.key} onClick={tab.onClick} className="flex w-14 flex-col items-center">
              <span
                className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-[10px] font-extrabold ${
                  isActive ? 'bg-[#E6F7EF] text-[#1E9E6F]' : 'text-[#6B7785]'
                }`}
              >
                {tab.icon}
              </span>
              <span className={`mt-1 text-[10px] font-bold ${isActive ? 'text-[#1E9E6F]' : 'text-[#6B7785]'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
