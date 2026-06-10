import { useNavigate } from 'react-router-dom';
import { serviceCategories } from '../data/vetService';

const appointments = [
  { time: '10:00', farmer: 'Rahim', animal: 'Cow A12', issue: 'Fever and low appetite', status: 'Pending' },
  { time: '11:30', farmer: 'Sadia', animal: 'Goat G08', issue: 'Skin rash follow-up', status: 'Accepted' },
  { time: '15:00', farmer: 'Karim', animal: 'Poultry P04', issue: 'Remote symptom review', status: 'Video' },
];

export function VetDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FCFA] pb-24">
      <div className="flex justify-between items-center px-6 py-3">
        <span className="text-xs font-bold text-[#6B7785]">9:41</span>
        <div className="flex gap-1 items-center">
          <div className="w-4 h-4 rounded-full bg-[#6B7785]" />
          <div className="w-5 h-2.5 border border-[#6B7785] rounded" />
        </div>
      </div>

      <div className="px-6 pt-4 pb-6">
        <button
          onClick={() => navigate('/')}
          className="mb-4 rounded-full border border-[#DCE7DF] bg-white px-4 py-2 text-sm font-bold text-[#17212B]"
        >
          Back to login
        </button>

        <h1 className="text-2xl font-extrabold text-[#17212B] mb-1">Vet Dashboard</h1>
      </div>

      <div className="px-6 mb-6">
        <div className="bg-[#E6F7EF] rounded-[20px] p-4">
          <p className="text-lg font-extrabold text-[#17212B] mb-1">3 appointment requests</p>
          <p className="text-xs font-medium text-[#6B7785]">2 farm visits • 1 video consultation</p>
          <button className="mt-3 px-4 py-2 bg-[#1E9E6F] rounded-2xl text-xs font-bold text-white">
            Review
          </button>
        </div>
      </div>

      <div className="px-6 mb-6">
        <h2 className="text-lg font-extrabold text-[#17212B] mb-4">Today</h2>
        <div className="space-y-3">
          {appointments.map((apt) => (
            <div key={`${apt.time}-${apt.animal}`} className="bg-white border border-[#DCE7DF] rounded-[20px] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[#17212B]">{apt.time}</p>
                  <p className="text-sm font-bold text-[#17212B] mt-1">
                    {apt.farmer} • {apt.animal}
                  </p>
                  <p className="text-xs font-medium text-[#6B7785] mt-1">{apt.issue}</p>
                </div>
                <span className="rounded-full bg-[#F8FCFA] px-3 py-1 text-[10px] font-bold text-[#17212B]">
                  {apt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 mb-6">
        <h2 className="text-lg font-extrabold text-[#17212B] mb-4">Services you can deliver</h2>
        <div className="flex flex-wrap gap-2">
          {serviceCategories.map((service) => (
            <span
              key={service}
              className="rounded-full bg-white border border-[#DCE7DF] px-3 py-2 text-xs font-semibold text-[#17212B]"
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      <div className="px-6 mb-6">
        <h2 className="text-lg font-extrabold text-[#17212B] mb-4">Quick clinical action</h2>
        <div className="bg-white border border-[#DCE7DF] rounded-[20px] p-4 mb-3">
          <p className="text-xs font-medium text-[#6B7785]">
            Submit diagnosis, severity, prescription, follow-up, and vaccination advice after consultation.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 h-12 bg-[#1E9E6F] rounded-2xl text-sm font-bold text-white">
            Start consult
          </button>
          <button className="flex-1 h-12 bg-[#E6F7EF] rounded-2xl text-sm font-bold text-[#1E9E6F]">
            Write Rx
          </button>
        </div>
      </div>
    </div>
  );
}
