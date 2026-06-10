import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  ChevronRight,
  Heart,
  Menu,
  Package,
  PawPrint,
  Search,
  Share2,
  ShieldPlus,
  Syringe,
} from 'lucide-react';
import { animals } from '../data/animals';
import { getVaccinationRecords } from '../data/vaccinationRecords';
import { MobileBottomNav } from './layout/MobileBottomNav';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';

const profileStats = [
  {
    title: 'My Animals',
    subtitle: 'Manage animals',
    tone: 'bg-emerald-50 text-emerald-700',
    icon: PawPrint,
  },
  {
    title: 'Book Vet',
    subtitle: 'Book a vet visit',
    tone: 'bg-amber-50 text-amber-600',
    icon: ShieldPlus,
  },
  {
    title: 'Calendar',
    subtitle: 'Schedule overview',
    tone: 'bg-blue-50 text-blue-600',
    icon: CalendarDays,
  },
] as const;

const showcaseProducts = [
  {
    name: 'Deshi Cow',
    detail: 'Healthy & Well Trained',
    price: '45,000',
    image:
      'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=520&h=300&fit=crop&auto=format',
  },
  {
    name: 'Friesian Cow',
    detail: 'High Milk Production',
    price: '38,000',
    image:
      'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=520&h=300&fit=crop&auto=format',
  },
] as const;

export function FarmerDashboard() {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [records, setRecords] = useState(getVaccinationRecords());
  const [activeProductTab, setActiveProductTab] = useState<'products' | 'favourites'>('products');

  const pendingRecord = useMemo(
    () => records.find((record) => record.status === 'pending') ?? records[0] ?? null,
    [records],
  );

  const dueAnimalId = pendingRecord?.eligibleAnimalIds[0] ?? pendingRecord?.animalIds[0] ?? animals[0]?.id ?? '-';
  const dueAnimal =
    animals.find((animal) => animal.id === dueAnimalId) ??
    animals.find((animal) => pendingRecord?.animalIds.includes(animal.id)) ??
    animals[0];

  function openProfilePanel() {
    setRecords(getVaccinationRecords());
    setIsProfileOpen(true);
  }

  function openVaccinationRecordsPage() {
    setIsProfileOpen(false);
    navigate('/vaccination-records');
  }

  function openVaccinationSchedulePage() {
    setIsProfileOpen(false);
    navigate('/vaccination-schedule');
  }

  const statActions = [
    () => navigate('/farm-management'),
    () => navigate('/booking'),
    () => navigate('/vaccination-schedule'),
  ];

  return (
    <MobileShell>
      <MobileStatusBar />

      <div className="relative min-h-[844px] bg-[#f7faf7] pb-28">
        <div className="h-full overflow-y-auto pb-24 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="px-4 pt-3">
            <div className="relative h-[132px] overflow-hidden rounded-[26px] bg-emerald-100 shadow-[0_14px_32px_rgba(29,74,44,0.12)]">
              <img
                src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=900&h=340&fit=crop&auto=format"
                alt="Farm banner"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={openProfilePanel}
                className="absolute left-4 top-4 rounded-[10px] bg-[#242424]/72 px-3 py-2 text-sm font-bold text-white backdrop-blur"
              >
                Preview
              </button>
            </div>
          </div>

          <div className="relative -mt-[82px] flex flex-col items-center px-5">
            <div className="relative rounded-[26px] border-[4px] border-white bg-white p-1 shadow-[0_18px_36px_rgba(39,78,49,0.18)]">
              <img
                src="https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=180&h=180&fit=crop&auto=format"
                alt="Farmer profile"
                className="h-[112px] w-[112px] rounded-[22px] object-cover"
              />
              <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#7bbb86] px-4 py-2 text-sm font-black text-white shadow-[0_12px_24px_rgba(54,113,67,0.28)]">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-white/25">✓</span>
                Active Seller
              </div>
            </div>

            <h1 className="mt-8 text-[34px] font-black tracking-[-0.05em] text-[#202720]">Gazi Farm</h1>
            <div className="mt-2 flex items-center gap-2 text-[12px] font-black text-[#717872]">
              <span className="text-[24px] leading-none text-amber-400">★</span>
              <span>2 Reviews</span>
            </div>
            <p className="mt-4 text-center text-[14px] font-black text-[#8a908a]">
              @ Gazi Farm, Dhamondi, 1209
            </p>

            <button
              type="button"
              onClick={openProfilePanel}
              className="mt-7 flex h-14 w-full max-w-[314px] items-center justify-center gap-3 rounded-[16px] border-[3px] border-[#98b7a4] bg-white text-[17px] font-black text-[#4e9564] shadow-[0_5px_0_rgba(67,110,84,0.08)]"
            >
              <Share2 className="h-5 w-5" />
              Share Profile
            </button>
          </div>

          <div className="mx-4 mt-8 rounded-[28px] border border-[#dce5de] bg-white p-4 shadow-[0_10px_28px_rgba(38,70,45,0.08)]">
            <div className="grid grid-cols-3 gap-3">
              {profileStats.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={statActions[index]}
                  className={`${item.tone} relative min-h-[126px] rounded-[22px] px-2 py-4 text-center transition active:scale-[0.98]`}
                >
                  {item.badge ? (
                    <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-red-500 text-xs font-black text-white">
                      {item.badge}
                    </span>
                  ) : null}
                  <item.icon className="mx-auto h-10 w-10" strokeWidth={2.2} />
                  <p className="mt-4 text-[12px] font-black leading-tight text-[#202720]">{item.title}</p>
                  <p className="mt-1 text-[9px] font-bold leading-tight text-[#6a726c]">{item.subtitle}</p>
                </button>
              ))}
            </div>
          </div>

          <section className="mx-4 mt-8 rounded-[28px] border-[3px] border-[#8ab09c] bg-white p-5 shadow-[0_8px_24px_rgba(40,74,47,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <Syringe className="mt-1 h-14 w-14 rotate-[-28deg] text-[#5d9b73]" strokeWidth={2.1} />
                <div>
                  <h2 className="text-[22px] font-black leading-tight text-[#242a24]">Vaccination</h2>
                  <p className="mt-1 text-[13px] font-bold text-[#6b746d]">Keep your animals healthy</p>
                  <p className="mt-3 text-[15px] font-black text-[#3f9362]">
                    {pendingRecord ? '1 vaccine is due' : 'No vaccine due now'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/vaccination-management')}
                className="rounded-[16px] bg-[#3d7f52] px-6 py-4 text-[13px] font-black text-white shadow-sm"
              >
                View All
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigate('/vaccination-records')}
              className="mt-6 flex w-full items-center rounded-[18px] border border-[#e2e9e4] bg-white p-3 text-left shadow-[0_5px_18px_rgba(39,58,44,0.07)]"
            >
              <img
                src="https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=80&h=80&fit=crop&auto=format"
                alt="Animal vaccine card"
                className="h-16 w-16 rounded-[14px] object-cover"
              />
              <div className="ml-4 min-w-0 flex-1">
                <p className="text-[16px] font-black text-[#242a24]">
                  {dueAnimal?.name ?? 'Deshi Cow'} • {dueAnimalId}
                </p>
                <p className="mt-1 text-[13px] font-bold text-[#6d756f]">
                  {pendingRecord?.vaccineName ?? 'FMD Vaccine'} {pendingRecord ? '(1st Dose)' : ''}
                </p>
              </div>
              <span className="rounded-full bg-red-50 px-3 py-2 text-[11px] font-black text-red-500">
                Due Tomorrow
              </span>
              <ChevronRight className="ml-3 h-5 w-5 text-[#8b938d]" />
            </button>
          </section>

          <div className="mx-auto mt-6 w-[88%] overflow-hidden rounded-[18px] border border-[#e7ece8] bg-[#f7f8f7] p-1 shadow-[0_5px_20px_rgba(42,72,48,0.06)]">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setActiveProductTab('products')}
                className={`flex items-center justify-center gap-3 rounded-[14px] py-4 text-[18px] font-black ${
                  activeProductTab === 'products'
                    ? 'bg-white text-[#4a9462] shadow-[0_6px_18px_rgba(42,72,48,0.1)]'
                    : 'text-[#98a19a]'
                }`}
              >
                <Package className="h-5 w-5" />
                My Products
              </button>
              <button
                type="button"
                onClick={() => setActiveProductTab('favourites')}
                className={`flex items-center justify-center gap-3 rounded-[14px] py-4 text-[18px] font-black ${
                  activeProductTab === 'favourites'
                    ? 'bg-white text-[#4a9462] shadow-[0_6px_18px_rgba(42,72,48,0.1)]'
                    : 'text-[#98a19a]'
                }`}
              >
                <Heart className="h-5 w-5" />
                Favourite Products
              </button>
            </div>
          </div>

          <div className="mx-4 mt-4 grid grid-cols-2 gap-3">
            {showcaseProducts.map((product) => (
              <article
                key={product.name}
                className="overflow-hidden rounded-[18px] border border-[#e3e9e5] bg-white shadow-[0_8px_18px_rgba(42,72,48,0.08)]"
              >
                <div className="relative h-[110px] bg-emerald-100">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  <button className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/80 text-white backdrop-blur">
                    <Heart className="h-5 w-5 fill-transparent stroke-white drop-shadow" />
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="text-[14px] font-black leading-tight text-[#202720]">{product.name}</h3>
                  <p className="mt-1 text-[11px] font-bold text-[#6f7771]">{product.detail}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-[15px] font-black text-[#4b9463]">৳ {product.price}</p>
                    <span className="rounded bg-emerald-50 px-2 py-1 text-[9px] font-black text-[#529864]">
                      In Stock
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {isProfileOpen ? (
        <div className="absolute inset-0 z-40 bg-[#17212B]/20">
          <button type="button" className="absolute inset-0 h-full w-full cursor-default" onClick={() => setIsProfileOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-[58%] min-w-[230px] max-w-[250px] overflow-y-auto border-l border-[#DCE7DF] bg-white p-4 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-[#17212B]">Rahim Profile</h2>
                <p className="mt-1 text-xs font-medium text-[#6B7785]">Farm records and vaccine confirmation</p>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileOpen(false)}
                className="rounded-full bg-[#F8FCFA] px-3 py-2 text-xs font-bold text-[#17212B]"
              >
                Close
              </button>
            </div>

            <button
              type="button"
              onClick={openVaccinationRecordsPage}
              className="mt-4 w-full rounded-[20px] border border-[#DCE7DF] bg-[#F8FCFA] p-4 text-left"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold text-[#17212B]">+ Vaccination record</p>
                </div>
                <span className="rounded-full bg-[#E6F7EF] px-3 py-1 text-[10px] font-bold text-[#1E9E6F]">
                  {records.length} records
                </span>
              </div>
            </button>

            <section className="mt-4 rounded-[20px] border border-[#DCE7DF] bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold text-[#17212B]">Appointment schedule</p>
                </div>
                <span className="rounded-full bg-[#E6F7EF] px-3 py-1 text-[10px] font-bold text-[#1E9E6F]">
                  1 accepted
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate('/appointment-schedule')}
                className="mt-3 w-full rounded-2xl bg-[#1E9E6F] px-3 py-2 text-xs font-bold text-white"
              >
                Open appointments
              </button>
            </section>

            <section className="mt-4 rounded-[20px] border border-[#DCE7DF] bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold text-[#17212B]">Vaccination schedule</p>
                </div>
                <span className="rounded-full bg-[#E6F7EF] px-3 py-1 text-[10px] font-bold text-[#1E9E6F]">
                  4 reminders
                </span>
              </div>

              <button
                type="button"
                onClick={openVaccinationSchedulePage}
                className="mt-3 w-full rounded-2xl bg-[#1E9E6F] px-3 py-2 text-xs font-bold text-white"
              >
                Open schedule
              </button>
            </section>
          </aside>
        </div>
      ) : null}

      <div className="absolute right-4 top-11 z-20 flex gap-2 text-[#1f2722]">
        <button
          type="button"
          onClick={openProfilePanel}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/70 shadow-sm backdrop-blur"
        >
          <Search className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={openProfilePanel}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/70 shadow-sm backdrop-blur"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <MobileBottomNav active="home" />
    </MobileShell>
  );
}
