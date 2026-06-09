import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <MobileShell>
      <MobileStatusBar />

      <div className="flex min-h-[770px] flex-col items-center justify-center px-6 pb-10">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-[#E6F7EF] relative">
            <div className="absolute bottom-6 h-10 w-24 rounded-t-full bg-[#1E9E6F] opacity-95" />
            <div className="absolute top-10 flex gap-8">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
                <div className="h-2 w-2 rounded-full bg-[#17212B]" />
              </div>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
                <div className="h-2 w-2 rounded-full bg-[#17212B]" />
              </div>
            </div>
          </div>
          <div className="mt-4 inline-block rounded-2xl bg-[#EAF3FB] px-6 py-2">
            <span className="text-sm font-extrabold text-[#0F4C81]">livestock</span>
          </div>
        </div>

        <h1 className="mb-2 text-4xl font-black text-[#1E9E6F]">VetCare</h1>
        <p className="mb-10 text-sm font-semibold text-[#6B7785]">Livestock health in one app</p>

        <div className="w-full rounded-[22px] border border-[#DCE7DF] bg-white p-6">
          <h2 className="mb-6 text-[22px] font-extrabold text-[#17212B]">Sign in</h2>

          <input
            type="text"
            placeholder="Email or phone number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-xl border border-[#DCE7DF] px-4 py-3 text-sm text-[#17212B] placeholder:text-[#6B7785] focus:border-[#1E9E6F] focus:outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[#DCE7DF] px-4 py-3 text-sm text-[#17212B] placeholder:text-[#6B7785] focus:border-[#1E9E6F] focus:outline-none"
          />
        </div>

        <button
          onClick={() => navigate('/farmer-dashboard')}
          className="mt-5 h-[52px] w-full rounded-2xl bg-[#1E9E6F] text-sm font-bold text-white"
        >
          Login
        </button>

        <button
          onClick={() => navigate('/vet-registration')}
          className="mt-4 h-12 w-full rounded-2xl bg-[#E6F7EF] text-sm font-bold text-[#1E9E6F]"
        >
          Register as veterinarian
        </button>

        <p className="mt-6 text-center text-xs font-semibold text-[#6B7785]">
          Farmer and veterinarian mobile interface
        </p>
      </div>
    </MobileShell>
  );
}
