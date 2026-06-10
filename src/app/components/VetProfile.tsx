import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarDays } from "lucide-react";

import { animals } from "../data/animals";
import { vets } from "../data/vetService";
import { MobileShell } from "./layout/MobileShell";
import { MobileStatusBar } from "./layout/MobileStatusBar";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

type VisitMode = "In Person" | "Video consultation" | "Chat" | "Request vet to visit";

const visitModes: VisitMode[] = [
  "In Person",
  "Video consultation",
  "Chat",
  "Request vet to visit",
];

const visitModePricing: Record<Exclude<VisitMode, "Chat">, { multiplier: number; extraAnimalFee: number; travelFee: number }> = {
  "In Person": { multiplier: 1, extraAnimalFee: 120, travelFee: 0 },
  "Video consultation": { multiplier: 0.75, extraAnimalFee: 90, travelFee: 0 },
  "Request vet to visit": { multiplier: 1.2, extraAnimalFee: 180, travelFee: 200 },
};

const dateOptions = [
  { label: "Sun", day: 7, dateText: "Sun, 7 Jun 2026", appointmentType: "General visit", center: "Badda Vet Center", time: "2:00 PM - 3:00 PM" },
  { label: "Mon", day: 8, dateText: "Mon, 8 Jun 2026", appointmentType: "General visit", center: "Dhanmondi Vet Point", time: "2:00 PM - 3:00 PM" },
  { label: "Tue", day: 9, dateText: "Tue, 9 Jun 2026", appointmentType: "General visit", center: "Badda Livestock Care", time: "11:30 AM - 12:30 PM" },
  { label: "Wed", day: 10, dateText: "Wed, 10 Jun 2026", appointmentType: "General visit", center: "Savar Field Clinic", time: "2:00 PM - 3:00 PM" },
  { label: "Thu", day: 11, dateText: "Thu, 11 Jun 2026", appointmentType: "General visit", center: "Keraniganj Vet Hub", time: "4:00 PM - 5:00 PM" },
  { label: "Fri", day: 12, dateText: "Fri, 12 Jun 2026", appointmentType: "General visit", center: "Dhanmondi Vet Point", time: "10:00 AM - 11:00 AM" },
  { label: "Sat", day: 13, dateText: "Sat, 13 Jun 2026", appointmentType: "General visit", center: "Badda Vet Center", time: "2:30 PM - 3:30 PM" },
];

const slotOptions: Record<Exclude<VisitMode, "Chat">, string[]> = {
  "In Person": ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"],
  "Video consultation": ["9:30 AM", "12:00 PM", "3:00 PM", "8:00 PM"],
  "Request vet to visit": ["8:00 AM", "10:30 AM", "1:30 PM", "5:00 PM"],
};

const existingAppointments = [
  {
    dateText: "Tue, 9 Jun 2026",
    time: "11:30 AM - 12:30 PM",
    label: "11:30 AM",
  },
];

function getVetInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getAnimalInitials(id: string) {
  return id
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function VetProfile() {
  const navigate = useNavigate();
  const { vetId } = useParams();
  const schedulingSectionRef = useRef<HTMLDivElement | null>(null);

  const vet = vets.find((item) => String(item.id) === vetId) ?? vets[0];
  const isVideoOnline = vet.onlineStatus === "online";

  const [selectedVisitMode, setSelectedVisitMode] = useState<Exclude<VisitMode, "Chat">>("In Person");
  const [selectedDate, setSelectedDate] = useState(9);
  const [selectedSlot, setSelectedSlot] = useState(slotOptions["In Person"][1]);
  const [selectedAnimalIds, setSelectedAnimalIds] = useState<string[]>([animals[0]?.id ?? ""]);
  const [showConflictWarning, setShowConflictWarning] = useState(false);
  const [symptoms, setSymptoms] = useState(
    "High fever, low appetite, watery eyes, standing separately from herd.",
  );
  const [additionalCharge] = useState(() => {
    const charge = localStorage.getItem('rescheduleCharge');
    if (charge) {
      localStorage.removeItem('rescheduleCharge');
      return parseInt(charge, 10);
    }
    return 0;
  });

  const selectedAnimals = useMemo(
    () => animals.filter((animal) => selectedAnimalIds.includes(animal.id)),
    [selectedAnimalIds],
  );

  const pricing = visitModePricing[selectedVisitMode];
  const basePrice = Math.round(vet.price * pricing.multiplier);
  const extraAnimalCount = Math.max(selectedAnimals.length - 1, 0);
  const extraAnimalCharge = extraAnimalCount * pricing.extraAnimalFee;
  const totalPrice = basePrice + extraAnimalCharge + pricing.travelFee + additionalCharge;
  const selectedSchedule = dateOptions.find((option) => option.day === selectedDate) ?? dateOptions[0];
  const shouldShowVideoImmediateCall = selectedVisitMode === "Video consultation" && isVideoOnline;
  const selectedTimeLabel =
    selectedVisitMode === "In Person" ? selectedSchedule.time : selectedSlot;
  const hasAppointmentConflict = existingAppointments.some((appointment) =>
    appointment.dateText === selectedSchedule.dateText &&
    (selectedVisitMode === "In Person"
      ? appointment.time === selectedSchedule.time
      : appointment.label === selectedSlot),
  );

  function handleVisitModeChange(mode: VisitMode) {
    if (mode === "Chat") {
      navigate(`/booking/${vet.id}/chat`);
      return;
    }

    setSelectedVisitMode(mode);
    setSelectedSlot(slotOptions[mode][0]);
    setShowConflictWarning(false);
  }

  function toggleAnimal(animalId: string) {
    setSelectedAnimalIds((current) => {
      if (current.includes(animalId)) {
        if (current.length === 1) {
          return current;
        }
        return current.filter((id) => id !== animalId);
      }
      return [...current, animalId];
    });
  }

  function handleSubmit() {
    if (!shouldShowVideoImmediateCall && hasAppointmentConflict) {
      setShowConflictWarning(true);
      schedulingSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    navigate("/booking-confirmation", {
      state: {
        vetName: vet.name,
        visitMode: selectedVisitMode,
      },
    });
  }

  return (
    <MobileShell>
      <MobileStatusBar />

      <div className="flex min-h-[844px] flex-col px-6 pb-10 pt-2 text-slate-800">
        <Button
          type="button"
          variant="outline"
          className="mb-8 h-14 w-fit rounded-full border-[#d7e3d6] bg-white px-8 text-[18px] font-semibold text-slate-900"
          onClick={() => navigate("/booking")}
        >
          Back
        </Button>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Book Appointment</h1>
        </div>

        <Card className="mt-8 rounded-[32px] border-[#d7e3d6] bg-white shadow-none">
          <CardContent className="flex items-center gap-4 p-5">
            <Avatar className="h-16 w-16 bg-[#e6f1ff]">
              <AvatarFallback className="bg-[#dbeafe] text-2xl font-bold text-[#4a72a8]">
                {getVetInitials(vet.name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-[18px] font-extrabold text-slate-900">{vet.name}</h2>
              <p className="text-base font-semibold text-slate-500">
                {vet.specialty} • {vet.location}
              </p>
              <p
                className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] ${
                  isVideoOnline ? "bg-[#E6F7EF] text-[#1E9E6F]" : "bg-[#F5F7F6] text-[#6B7785]"
                }`}
              >
                {isVideoOnline ? "Online now" : "Offline"}
              </p>
            </div>
          </CardContent>
        </Card>

        <div ref={schedulingSectionRef} className="mt-8 space-y-4">
          <h3 className="text-2xl font-extrabold text-slate-900">Consultation option</h3>
          <div className="grid grid-cols-2 gap-4">
            {visitModes.map((mode) => {
              const isSelected = mode === selectedVisitMode;

              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => handleVisitModeChange(mode)}
                  className={`rounded-[24px] border px-4 py-5 text-center text-[17px] font-extrabold transition ${
                    isSelected
                      ? "border-[#74b487] bg-[#74b487] text-white"
                      : "border-[#d7e3d6] bg-white text-slate-500"
                  }`}
                >
                  {mode}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-2xl font-extrabold text-slate-900">
            {selectedVisitMode === "In Person"
              ? "Weekly time schedule"
              : shouldShowVideoImmediateCall
                ? "Video consultation"
                : "Select date"}
          </h3>

          {selectedVisitMode === "In Person" ? (
            <Card className="overflow-hidden rounded-[26px] border-[#d7e3d6] bg-white shadow-none">
              <CardContent className="p-0">
                <div className="border-b border-[#d7e3d6] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-[#ecf7ef] p-3 text-[#56a774]">
                      <CalendarDays className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Selected day</p>
                      <p className="text-[18px] font-extrabold text-slate-900">{selectedSchedule.dateText}</p>
                      <p className="text-sm font-semibold text-[#56a774]">{selectedSchedule.center}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-[1.2fr_0.75fr_1fr_1fr] border-b border-[#d7e3d6] bg-[#f7faf8] text-[13px] font-extrabold text-slate-500">
                  <div className="border-r border-[#d7e3d6] px-5 py-3">Appointment</div>
                  <div className="border-r border-[#d7e3d6] px-5 py-3">Day</div>
                  <div className="border-r border-[#d7e3d6] px-5 py-3">Center</div>
                  <div className="px-5 py-3">Schedule time</div>
                </div>

                <div>
                  {dateOptions.map((option) => {
                    const isSelected = option.day === selectedDate;

                    return (
                      <button
                        key={option.day}
                        type="button"
                        onClick={() => {
                          setSelectedDate(option.day);
                          setShowConflictWarning(false);
                          const matchingSlot = slotOptions["In Person"].find((slot) => option.time.includes(slot));
                          if (matchingSlot) {
                            setSelectedSlot(matchingSlot);
                          }
                        }}
                        className={`grid w-full grid-cols-[1.2fr_0.75fr_1fr_1fr] text-left transition ${
                          isSelected ? "bg-[#eef8f1]" : "bg-white"
                        }`}
                      >
                        <div className="border-r border-t border-[#d7e3d6] px-5 py-4 text-sm font-semibold text-slate-700">
                          {option.appointmentType}
                        </div>
                        <div className="border-r border-t border-[#d7e3d6] px-5 py-4 text-sm font-extrabold text-slate-900">
                          {option.label}
                        </div>
                        <div className="border-r border-t border-[#d7e3d6] px-5 py-4 text-sm font-semibold text-slate-700">
                          {option.center}
                        </div>
                        <div className="border-t border-[#d7e3d6] px-5 py-4 text-sm font-semibold text-slate-700">
                          {option.time}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ) : shouldShowVideoImmediateCall ? (
            <Card className="rounded-[26px] border-[#d7e3d6] bg-white shadow-none">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[#ecf7ef] p-3 text-[#56a774]">
                    <CalendarDays className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Video status</p>
                    <p className="text-[18px] font-extrabold text-slate-900">Doctor is online now</p>
                  </div>
                </div>
                <p className="text-base font-medium text-slate-500">
                  Start the consultation immediately without booking a future date or time.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="rounded-[26px] border-[#d7e3d6] bg-white shadow-none">
                <CardContent className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-[#ecf7ef] p-3 text-[#56a774]">
                      <CalendarDays className="h-6 w-6" />
                    </div>
                    <span className="text-[18px] font-bold text-slate-900">{selectedSchedule.dateText}</span>
                  </div>
                  <button type="button" className="text-lg font-bold text-[#56a774]">
                    Change
                  </button>
                </CardContent>
              </Card>

              <Card className="rounded-[26px] border-[#d7e3d6] bg-white shadow-none">
                <CardContent className="flex gap-3 overflow-x-auto p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {dateOptions.map((option) => {
                    const isSelected = option.day === selectedDate;
                    const isAccent = option.day === 12;

                    return (
                      <button
                        key={option.day}
                        type="button"
                        onClick={() => {
                          setSelectedDate(option.day);
                          setShowConflictWarning(false);
                        }}
                        className={`min-w-[58px] rounded-3xl px-3 py-3 text-center transition ${
                          isSelected
                            ? "bg-[#56a774] text-white"
                            : isAccent
                              ? "bg-[#fff4d8] text-[#d69a20]"
                              : "bg-[#f6f8f7] text-slate-500"
                        }`}
                      >
                        <div className="text-sm font-bold">{option.label}</div>
                        <div className="text-[20px] font-extrabold leading-tight">{option.day}</div>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {selectedVisitMode !== "In Person" && !shouldShowVideoImmediateCall ? (
          <div className="mt-8 space-y-4">
            <h3 className="text-2xl font-extrabold text-slate-900">Available time</h3>
            <div className="grid grid-cols-2 gap-4">
              {slotOptions[selectedVisitMode].map((slot) => {
                const isSelected = slot === selectedSlot;

                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      setSelectedSlot(slot);
                      setShowConflictWarning(false);
                    }}
                    className={`rounded-[22px] border px-4 py-5 text-center text-[18px] font-extrabold transition ${
                      isSelected
                        ? "border-[#56a774] bg-[#56a774] text-white"
                        : "border-[#d7e3d6] bg-white text-slate-900"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-2xl font-extrabold text-slate-900">Farm animals</h3>
            <p className="text-sm font-bold text-[#56a774]">{selectedAnimals.length} selected</p>
          </div>

          <div className="space-y-3">
            {animals.map((animal) => {
              const isSelected = selectedAnimalIds.includes(animal.id);

              return (
                <button
                  key={animal.id}
                  type="button"
                  onClick={() => toggleAnimal(animal.id)}
                  className={`w-full rounded-[24px] border p-4 text-left transition ${
                    isSelected
                      ? "border-[#56a774] bg-[#eef8f1]"
                      : "border-[#d7e3d6] bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border border-[#d7e3d6] bg-[#e6f7ef]">
                      <AvatarFallback className="bg-[#e6f7ef] text-sm font-extrabold text-[#1E9E6F]">
                        {getAnimalInitials(animal.id)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-[17px] font-extrabold text-slate-900">{animal.id}</p>
                      <p className="text-sm font-medium text-slate-500">
                        {animal.name} • {animal.breed}
                      </p>
                    </div>
                    <div
                      className={`rounded-full px-3 py-2 text-xs font-extrabold ${
                        isSelected ? "bg-[#56a774] text-white" : "bg-[#f5f7f6] text-slate-500"
                      }`}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Label className="text-2xl font-extrabold text-slate-900">Symptoms</Label>
          <Textarea
            value={symptoms}
            onChange={(event) => setSymptoms(event.target.value)}
            className="min-h-[120px] rounded-[24px] border-[#d7e3d6] bg-white px-6 py-5 text-[18px] text-slate-500 placeholder:text-slate-400"
            placeholder="Describe the symptoms"
          />
        </div>

        <Card className="mt-8 rounded-[28px] border-none bg-[#f4f8f7] shadow-none">
          <CardContent className="space-y-4 p-6">
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-slate-500">Payment summary</p>
            <div className="space-y-2 text-base font-semibold text-slate-600">
              <div className="flex items-center justify-between gap-3">
                <span>{selectedVisitMode}</span>
                <span>BDT {basePrice}</span>
              </div>
              {extraAnimalCharge > 0 ? (
                <div className="flex items-center justify-between gap-3">
                  <span>Extra animals ({extraAnimalCount})</span>
                  <span>BDT {extraAnimalCharge}</span>
                </div>
              ) : null}
              {pricing.travelFee > 0 ? (
                <div className="flex items-center justify-between gap-3">
                  <span>Travel charge</span>
                  <span>BDT {pricing.travelFee}</span>
                </div>
              ) : null}
              {additionalCharge > 0 ? (
                <div className="flex items-center justify-between gap-3">
                  <span>Reschedule/Cancellation fee</span>
                  <span>BDT {additionalCharge}</span>
                </div>
              ) : null}
              <div className="flex items-center justify-between gap-3 border-t border-[#d7e3d6] pt-3 text-[20px] font-extrabold text-slate-900">
                <span>Total payment</span>
                <span className="text-[#56a774]">BDT {totalPrice}</span>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              {shouldShowVideoImmediateCall
                ? "Video consultation can start immediately."
                : selectedAnimals.length > 0
                  ? `For ${selectedAnimals.map((animal) => animal.id).join(", ")}`
                  : "Select at least one animal to continue."}
            </p>
          </CardContent>
        </Card>

        {showConflictWarning ? (
          <Card className="mt-5 rounded-[24px] border-[#f2d7a6] bg-[#fff7e8] shadow-none">
            <CardContent className="space-y-4 p-5">
              <div className="space-y-2">
                <p className="text-[18px] font-extrabold text-slate-900">
                  You already have an appointment at that time.
                </p>
                <p className="text-base font-medium leading-7 text-slate-600">
                  Do you want to choose another time slot?
                </p>
                <p className="text-sm font-semibold text-[#b7791f]">
                  {selectedSchedule.dateText} • {selectedTimeLabel}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-14 w-full rounded-[20px] border-[#e7c98d] bg-white text-[16px] font-extrabold text-slate-900"
                onClick={() => schedulingSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
              >
                Choose another time slot
              </Button>
            </CardContent>
          </Card>
        ) : null}

        <Button
          type="button"
          className="mt-8 h-20 rounded-[28px] bg-[#56a774] text-[20px] font-extrabold text-white hover:bg-[#4b9968]"
          onClick={() => (shouldShowVideoImmediateCall ? navigate("/diagnosis-report") : handleSubmit())}
        >
          {shouldShowVideoImmediateCall ? "Call now" : "Submit request"}
        </Button>
      </div>
    </MobileShell>
  );
}
