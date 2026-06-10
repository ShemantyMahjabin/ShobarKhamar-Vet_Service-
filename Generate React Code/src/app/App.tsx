import {
  ArrowLeft,
  CalendarDays,
  Camera,
  ChevronRight,
  Heart,
  Home,
  Menu,
  MoreHorizontal,
  Package,
  PawPrint,
  Search,
  Share2,
  ShieldPlus,
  Syringe,
} from "lucide-react";

const stats = [
  { icon: PawPrint, title: "My Animals", subtitle: "Manage animals", tone: "bg-emerald-50 text-emerald-700" },
  { icon: ShieldPlus, title: "Book Vet", subtitle: "Book a vet visit", tone: "bg-amber-50 text-amber-600" },
  { icon: Syringe, title: "Pending Vaccine", subtitle: "1 due", tone: "bg-violet-50 text-violet-700", badge: "1" },
  { icon: CalendarDays, title: "Appointments", subtitle: "4 upcoming", tone: "bg-blue-50 text-blue-600" },
];

const products = [
  {
    name: "Deshi Cow",
    detail: "Healthy & Well Trained",
    price: "45,000",
    image: "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=520&h=300&fit=crop&auto=format",
  },
  {
    name: "Friesian Cow",
    detail: "High Milk Production",
    price: "38,000",
    image: "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=520&h=300&fit=crop&auto=format",
  },
];

const nav = [
  { icon: Home, label: "হোম" },
  { icon: Camera, label: "প্রাণী" },
  { icon: PawPrint, label: "খামার", active: true },
  { icon: Search, label: "সার্চ" },
  { icon: Menu, label: "মেনু" },
];

export default function App() {
  return (
    <main className="min-h-screen bg-[#eef4ef] text-foreground flex items-center justify-center p-0 sm:p-6 font-[Nunito]">
      <section className="relative h-screen w-full max-w-[430px] overflow-hidden bg-background shadow-2xl sm:h-[860px] sm:rounded-[2rem] sm:ring-8 sm:ring-white/60">
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 pt-5 text-[#1f2722]">
          <ArrowLeft className="size-6" strokeWidth={2.4} />
          <h1 className="text-[21px] font-black tracking-[-0.04em]">Seller Profile</h1>
          <MoreHorizontal className="size-6" strokeWidth={2.8} />
        </div>

        <div className="h-full overflow-y-auto pb-24 pt-[72px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mx-2 h-[132px] overflow-hidden rounded-[14px] bg-emerald-100 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=900&h=340&fit=crop&auto=format"
              alt="Cows grazing near a farm at sunset"
              className="h-full w-full object-cover saturate-[1.08]"
            />
          </div>

          <div className="relative -mt-[82px] flex flex-col items-center">
            <div className="relative rounded-[22px] border-[3px] border-white bg-white p-1 shadow-[0_10px_28px_rgba(35,72,48,0.22)]">
              <img
                src="https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=180&h=180&fit=crop&auto=format"
                alt="Gazi Farm seller portrait"
                className="size-[94px] rounded-[18px] object-cover"
              />
              <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-[#74b585] px-2.5 py-1 text-[10px] font-extrabold text-white shadow-md">
                <span className="grid size-3 place-items-center rounded-full bg-white/25">✓</span>
                Active Seller
              </div>
            </div>
            <h2 className="mt-4 text-[25px] font-black leading-none tracking-[-0.045em] text-[#202720]">Gazi Farm</h2>
            <div className="mt-2 flex items-center gap-1 text-[12px] font-bold text-[#777d78]">
              <span className="text-amber-400">★</span>
              <span>2 Reviews</span>
            </div>
            <p className="mt-2 text-[12px] font-bold text-[#868b86]">⌾ Gazi Farm, Dhamondi, 1209</p>
            <button className="mt-4 flex h-11 w-[258px] items-center justify-center gap-2 rounded-[8px] border-2 border-[#9ab8a7] bg-white text-[14px] font-extrabold text-[#4e9564] shadow-[0_2px_0_rgba(77,116,91,0.08)] transition hover:bg-emerald-50">
              <Share2 className="size-4" />
              Share Profile
            </button>
          </div>

          <div className="mx-5 mt-4 rounded-[18px] border border-border bg-white p-3 shadow-[0_8px_24px_rgba(42,72,48,0.08)]">
            <div className="grid grid-cols-4 gap-2">
              {stats.map((item) => (
                <button key={item.title} className={`${item.tone} relative min-h-[82px] rounded-[13px] p-2 text-center transition hover:-translate-y-0.5`}>
                  {item.badge && <span className="absolute right-3 top-2 grid size-5 place-items-center rounded-full bg-red-500 text-[11px] font-black text-white">{item.badge}</span>}
                  <item.icon className="mx-auto mt-1 size-7" strokeWidth={2.2} />
                  <div className="mt-2 text-[11px] font-black leading-tight text-[#202720]">{item.title}</div>
                  <div className="mt-0.5 text-[9px] font-bold leading-tight text-[#69716b]">{item.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          <section className="mx-5 mt-4 rounded-[15px] border-2 border-[#8ab09c] bg-white p-4 shadow-[0_6px_20px_rgba(50,80,58,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <Syringe className="mt-1 size-12 rotate-[-28deg] text-[#5d9b73]" strokeWidth={2.1} />
                <div>
                  <h3 className="text-[19px] font-black leading-tight text-[#242a24]">Vaccination</h3>
                  <p className="text-[12px] font-bold text-[#6b746d]">Keep your animals healthy</p>
                  <p className="mt-1 text-[12px] font-black text-[#3f9362]">1 vaccine is due</p>
                </div>
              </div>
              <button className="rounded-[8px] bg-[#3d7f52] px-5 py-3 text-[12px] font-black text-white shadow-sm">View All</button>
            </div>
            <div className="mt-4 flex items-center rounded-[10px] border border-[#e2e9e4] bg-white p-2 shadow-[0_4px_14px_rgba(39,58,44,0.07)]">
              <img src="https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=80&h=80&fit=crop&auto=format" alt="Deshi cow" className="size-12 rounded-[8px] object-cover" />
              <div className="ml-3 flex-1">
                <p className="text-[13px] font-black text-[#242a24]">Deshi Cow • A12</p>
                <p className="text-[12px] font-bold text-[#6d756f]">FMD Vaccine (1st Dose)</p>
              </div>
              <span className="rounded-md bg-red-50 px-2 py-1 text-[10px] font-black text-red-500">Due Tomorrow</span>
              <ChevronRight className="ml-2 size-5 text-[#8b938d]" />
            </div>
          </section>

          <div className="mx-5 mt-3 grid grid-cols-2 overflow-hidden rounded-[8px] border border-[#ebefec] bg-[#f7f8f7] p-1 text-[12px] font-black text-[#98a19a]">
            <button className="flex items-center justify-center gap-2 rounded-md bg-white py-2 text-[#4a9462] shadow-sm"><Package className="size-4" />My Products</button>
            <button className="flex items-center justify-center gap-2 py-2"><Heart className="size-4" />Favourite Products</button>
          </div>

          <div className="mx-5 mt-3 grid grid-cols-2 gap-3">
            {products.map((product) => (
              <article key={product.name} className="overflow-hidden rounded-[11px] border border-[#e3e9e5] bg-white shadow-[0_8px_18px_rgba(42,72,48,0.08)]">
                <div className="relative h-[86px] bg-emerald-100">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  <button className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-white/80 text-white backdrop-blur"><Heart className="size-5 fill-transparent stroke-white drop-shadow" /></button>
                </div>
                <div className="p-2.5">
                  <h4 className="text-[13px] font-black leading-tight text-[#202720]">{product.name}</h4>
                  <p className="text-[10px] font-bold text-[#6f7771]">{product.detail}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-[13px] font-black text-[#4b9463]">৳ {product.price}</p>
                    <span className="rounded bg-emerald-50 px-2 py-1 text-[9px] font-black text-[#529864]">In Stock</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <nav className="absolute inset-x-0 bottom-0 z-30 grid h-[74px] grid-cols-5 border-t border-[#e6ebe7] bg-white/95 px-2 pt-2 shadow-[0_-8px_24px_rgba(32,54,39,0.08)] backdrop-blur">
          {nav.map((item) => (
            <button key={item.label} className={`flex flex-col items-center gap-1 text-[10px] font-extrabold ${item.active ? "text-[#4d9462]" : "text-[#7e8781]"}`}>
              <item.icon className={`size-5 ${item.active ? "fill-[#dbeee2]" : ""}`} strokeWidth={2.2} />
              {item.label}
            </button>
          ))}
        </nav>
      </section>
    </main>
  );
}
