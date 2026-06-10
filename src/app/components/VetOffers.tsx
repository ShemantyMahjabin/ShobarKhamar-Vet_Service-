import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';

type OfferType = 'in-person' | 'vet-visit';

type VetOffer = {
  id: number;
  type: OfferType;
  farmer: string;
  animal: string;
  issue: string;
  time: string;
  location: string;
  fee: string;
  distance: string;
  note: string;
  status: 'New' | 'Seen';
};

const offers: VetOffer[] = [
  {
    id: 1,
    type: 'in-person',
    farmer: 'Rahim Uddin',
    animal: 'Cow A12',
    issue: 'High fever and low appetite',
    time: 'Today, 11:30 AM',
    location: 'Badda livestock zone',
    fee: '৳ 700',
    distance: '1.8 km away',
    note: 'Farmer can bring the animal to the chamber.',
    status: 'New',
  },
  {
    id: 2,
    type: 'vet-visit',
    farmer: 'Sadia Begum',
    animal: 'Goat G08',
    issue: 'Sudden swelling after medicine',
    time: 'Today, 4:00 PM',
    location: 'Keraniganj village farm',
    fee: '৳ 1,100',
    distance: '4.5 km away',
    note: 'Needs farm visit because the animal is weak and cannot travel.',
    status: 'New',
  },
  {
    id: 3,
    type: 'in-person',
    farmer: 'Karim Sheikh',
    animal: 'Calf C03',
    issue: 'Follow-up check after vaccination',
    time: 'Tomorrow, 10:00 AM',
    location: 'Savar field point',
    fee: '৳ 500',
    distance: '3.0 km away',
    note: 'Routine in-person chamber follow-up.',
    status: 'Seen',
  },
  {
    id: 4,
    type: 'vet-visit',
    farmer: 'Momena Khatun',
    animal: 'Cow B04',
    issue: 'Post-calving weakness and bleeding concern',
    time: 'Tomorrow, 2:30 PM',
    location: 'Demra dairy lane',
    fee: '৳ 1,350',
    distance: '6.2 km away',
    note: 'Farmer requested home visit urgently.',
    status: 'Seen',
  },
];

const offerTabs: Array<{ key: OfferType; label: string }> = [
  { key: 'in-person', label: 'In Person' },
  { key: 'vet-visit', label: 'Vet Visit' },
];

export function VetOffers() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<OfferType>('in-person');

  const visibleOffers = useMemo(
    () => offers.filter((offer) => offer.type === activeTab),
    [activeTab],
  );

  return (
    <MobileShell>
      <MobileStatusBar />

      <div className="px-6 pt-4 pb-6">
        <button
          onClick={() => navigate('/vet-dashboard')}
          className="mb-4 rounded-full border border-[#DCE7DF] bg-white px-4 py-2 text-sm font-bold text-[#17212B]"
        >
          Back
        </button>

        <h1 className="text-2xl font-extrabold text-[#17212B]">Offers</h1>
        <p className="mt-1 text-sm font-medium text-[#6B7785]">
          Review consultation offers for chamber visits and farm visits.
        </p>
      </div>

      <div className="px-6">
        <div className="grid grid-cols-2 gap-3 rounded-[22px] border border-[#DCE7DF] bg-white p-3">
          {offerTabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-[18px] px-4 py-3 text-sm font-extrabold transition-colors ${
                  isActive ? 'bg-[#1E9E6F] text-white' : 'bg-[#F8FCFA] text-[#6B7785]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 space-y-4">
          {visibleOffers.map((offer) => (
            <section
              key={offer.id}
              className="rounded-[24px] border border-[#DCE7DF] bg-white p-5 shadow-[0_14px_34px_rgba(23,33,43,0.06)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-extrabold text-[#17212B]">{offer.farmer}</p>
                  <p className="mt-1 text-sm font-semibold text-[#6B7785]">
                    {offer.animal} • {offer.issue}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                    offer.status === 'New'
                      ? 'bg-[#E6F7EF] text-[#1E9E6F]'
                      : 'bg-[#F8FCFA] text-[#6B7785]'
                  }`}
                >
                  {offer.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-[18px] bg-[#F8FCFA] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B7785]">Time</p>
                  <p className="mt-1 text-sm font-extrabold text-[#17212B]">{offer.time}</p>
                </div>
                <div className="rounded-[18px] bg-[#F8FCFA] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B7785]">Offer Fee</p>
                  <p className="mt-1 text-sm font-extrabold text-[#17212B]">{offer.fee}</p>
                </div>
              </div>

              <div className="mt-3 rounded-[18px] bg-[#F8FCFA] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B7785]">Location</p>
                <p className="mt-1 text-sm font-semibold text-[#17212B]">{offer.location}</p>
                <p className="mt-2 text-xs font-medium text-[#1E9E6F]">{offer.distance}</p>
              </div>

              <div className="mt-3 rounded-[18px] bg-[#F8FCFA] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B7785]">Farmer Note</p>
                <p className="mt-1 text-sm font-medium text-[#17212B]">{offer.note}</p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button className="rounded-2xl border border-[#DCE7DF] bg-white px-4 py-3 text-sm font-bold text-[#17212B]">
                  Decline
                </button>
                <button className="rounded-2xl bg-[#1E9E6F] px-4 py-3 text-sm font-bold text-white">
                  Accept
                </button>
              </div>
            </section>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}
