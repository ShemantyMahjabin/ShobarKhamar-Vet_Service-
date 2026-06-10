import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

import { MobileShell } from "./layout/MobileShell";
import { MobileStatusBar } from "./layout/MobileStatusBar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

type AppointmentConfirmationState = {
  vetName?: string;
  visitMode?: string;
};

export function AppointmentConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as AppointmentConfirmationState | null) ?? null;

  return (
    <MobileShell>
      <MobileStatusBar />

      <div className="flex min-h-[844px] flex-col justify-center px-6 pb-10 pt-6 text-slate-800">
        <Card className="rounded-[32px] border-[#d7e3d6] bg-white shadow-none">
          <CardContent className="space-y-6 px-6 py-10 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eaf7ef] text-[#56a774]">
              <CheckCircle2 className="h-11 w-11" />
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Thank you for your appointment
              </h1>
              <p className="text-lg font-medium leading-8 text-slate-500">
                Please wait for the vet to confirm your appointment.
              </p>
            </div>

            {state?.vetName || state?.visitMode ? (
              <div className="rounded-[24px] bg-[#f4f8f7] px-5 py-4 text-left">
                {state?.vetName ? (
                  <p className="text-base font-semibold text-slate-600">
                    Vet: <span className="font-extrabold text-slate-900">{state.vetName}</span>
                  </p>
                ) : null}
                {state?.visitMode ? (
                  <p className="mt-2 text-base font-semibold text-slate-600">
                    Appointment type: <span className="font-extrabold text-slate-900">{state.visitMode}</span>
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="space-y-3">
              <Button
                type="button"
                className="h-16 w-full rounded-[24px] bg-[#56a774] text-[18px] font-extrabold text-white hover:bg-[#4b9968]"
                onClick={() => navigate("/farmer-dashboard")}
              >
                Go to dashboard
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-16 w-full rounded-[24px] border-[#d7e3d6] bg-white text-[18px] font-extrabold text-slate-900"
                onClick={() => navigate("/booking")}
              >
                Book another appointment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileShell>
  );
}
