import { useState, useEffect, useRef } from "react";
import logo from "./logo.png";
import { motion, AnimatePresence, useInView, useScroll, useSpring } from "framer-motion";
import {
  Phone, MessageCircle, Plane, TrainFront, Mountain, Car, PartyPopper, Stethoscope,
  Briefcase, Clock, ShieldCheck, MapPin, Users, Luggage, Snowflake, ChevronDown,
  Menu, X, Star, Camera, ChevronLeft, ChevronRight, ArrowRight, CalendarCheck, BadgeCheck, Route,
} from "lucide-react";

/* ═══════ 1. EDIT YOUR BUSINESS DETAILS ═══════ */
const CONFIG = {
  brand: "Puttur Taxi Service",
  phone: "+91 94484 28266",
  phoneRaw: "919448428266", // first WhatsApp number (used for plain links)
  email: "ranjithputtur66@gmail.com",
  address: "Main Road, Puttur, Dakshina Kannada, Karnataka 574201",
  hours: "Open 24 hours",
};
const NUMBERS = [
  { label: "94484 28266", raw: "919448428266" },
  { label: "86602 73535", raw: "918660273535" },
];
const wa = (t = "Hi, I need a taxi.") => `https://wa.me/${CONFIG.phoneRaw}?text=${encodeURIComponent(t)}`;

/* ═══════ 2. PHOTOS: put your images in /public/images with these names ═══════
   If a file is missing, a green gradient shows instead, so the page never looks broken. */
// OPTIONAL real photos. Put files in public/images. If a file is missing, a maroon design shows instead.
const HERO_PHOTO = null; // e.g. "/images/hero.jpg" to replace the temple illustration
const WM = (f) => `https://commons.wikimedia.org/wiki/Special:FilePath/${f}?width=1000`; // Wikimedia Commons photos
const IMG = { sedan: "/images/sedan.jpg", suv: "/images/suv.jpg", tempo: "/images/tempo.jpg", dharmasthala: WM("Dharmasthala_Temple.jpg"), tirupati: WM("Tirumala_Anand_nilayam4653.jpg"), subramanya: WM("Subramanya_temple.jpg"), coorg: WM("Tadiandamol_Valley,_Western_Ghats.jpg"), udupi: WM("Shiva_Statue_Murdeshwara_Temple.jpg"), airport: WM("Mangalore_Airport_New_Terminal.jpg"), wayanad: WM("Waynad_Bamboo_Road.jpg") };
const TONES = ["from-[#1B5B42] to-[#09231A]", "from-[#2a7556] to-[#0d3a2b]", "from-[#0f4a35] to-[#3b8a66]", "from-[#164f39] to-[#09231A]"];
const POS = ["20% 40%", "80% 30%", "50% 70%", "10% 60%", "90% 70%", "40% 20%"]; // different crops of the same photo

/* ═══════ 3. CONTENT ═══════ */
const ROUTES = [
  { to: "Mangaluru Airport", note: "Airport transfer", fare: "₹ —" },
  { to: "Dharmasthala", note: "Temple trip", fare: "₹ —" },
  { to: "Kukke Subramanya", note: "Temple trip", fare: "₹ —" },
  { to: "Madikeri (Coorg)", note: "Outstation", fare: "₹ —" },
  { to: "Bengaluru", note: "Outstation", fare: "₹ —" },
];
const SERVICES = [
  { icon: Plane, t: "Airport transfer", d: "Pickup and drop at Mangaluru airport, timed to your flight." },
  { icon: TrainFront, t: "Railway pickup", d: "Puttur, Subramanya Road and Mangaluru stations." },
  { icon: Mountain, t: "Temple trips", d: "Dharmasthala, Subramanya, Udupi, Tirupati and more." },
  { icon: Route, t: "Outstation", d: "Coorg, Chikmagaluru, Bengaluru, Mysuru and Wayanad." },
  { icon: PartyPopper, t: "Weddings and events", d: "Decorated cars and group vehicles for guests." },
  { icon: Stethoscope, t: "Hospital service", d: "Patient pickup and drop to Puttur and Mangaluru hospitals." },
  { icon: Briefcase, t: "Corporate and college", d: "Monthly cars and regular pickups on a fixed plan." },
  { icon: Clock, t: "Local rental", d: "Hire by the hour or by the day around Puttur." },
];
const FLEET = [
  { name: "Sedan", model: "Swift Dzire or similar", seats: "4", bags: "2 large", desc: "Comfortable and economical for city rides, airport transfers and small families.", tag: "City and airport", img: IMG.sedan, photos: ["/images/sedan-1.jpeg", "/images/sedan-2.jpeg", "/images/sedan-3.jpeg"], featured: 2 },
  { name: "SUV", model: "Innova or similar", seats: "6–7", bags: "4 large", desc: "Roomy seating and luggage space for family trips and temple tours.", tag: "Family trips", img: IMG.suv, photos: ["/images/suv-3.jpeg", "/images/suv-4.jpeg", "/images/suv-5.jpeg"] },
  { name: "Tempo Traveller", model: "12 to 17 seater", seats: "12+", bags: "Roof carrier", desc: "Room for the whole group. Ideal for weddings, tours and pilgrimages.", tag: "Groups and weddings", img: IMG.tempo, photos: ["/images/tt-1.jpeg", "/images/tt-2.jpeg"] },
];
const DEST = [
  { t: "Tirupati", s: "Venkateswara temple, Tirumala", img: IMG.tirupati, big: true },
  { t: "Coorg", s: "Hill station, Western Ghats", img: IMG.coorg },
  { t: "Dharmasthala", s: "Temple trip", img: IMG.dharmasthala },
  { t: "Murudeshwar", s: "Shiva statue by the sea", img: IMG.udupi },
  { t: "Mangaluru Airport", s: "Airport transfer", img: IMG.airport },
  { t: "Wayanad", s: "Kerala border", img: IMG.wayanad, big: true },
];
const STEPS = [
  { icon: MessageCircle, t: "Send your trip", d: "Call or WhatsApp with pickup, drop and date." },
  { icon: BadgeCheck, t: "Get the fare", d: "We confirm the car and quote before you travel." },
  { icon: CalendarCheck, t: "Ride", d: "Your driver arrives on time. Pay as agreed." },
];
// SAMPLE TEXT: replace these with real customer reviews (with their permission) before the site goes live.
const REVIEWS = [
  { n: "Vasanth", p: "Booked an early morning drop to Mangaluru airport. The car came on time, the driver knew the route well, and the fare was told before we started.", c: "Puttur · Airport drop" },
  { n: "Gokul", p: "We took the family to Dharmasthala and Subramanya in one day. Clean car, comfortable ride, and the driver waited patiently at each temple.", c: "Mangaluru · Temple trip" },
  { n: "Prakash", p: "Hired a Tempo Traveller for a wedding in the family. Everyone reached on time and the booking was easy on WhatsApp.", c: "Sullia · Wedding trip" },
];
const FAQS = [
  { q: "How do I book a taxi in Puttur?", a: "Call or WhatsApp us with your pickup, drop, date and time, or use the quote form at the top of this page. We confirm the vehicle and fare before you travel." },
  { q: "How is the fare decided?", a: "By route, vehicle and waiting time. You get the quote before the trip starts, so ask us about tolls, parking or night charges to avoid surprises." },
  { q: "Do you offer airport pickup from Mangaluru?", a: "Yes. Share your flight number and arrival time and we plan the pickup around it." },
  { q: "Can I book a one-day temple trip?", a: "Yes. Dharmasthala and Kukke Subramanya can be done in one day. We also plan Udupi, Murudeshwar and longer trips such as Tirupati." },
  { q: "Are night and early-morning trips available?", a: "Yes, bookings are open day and night. Please book early for pickups before 5 AM." },
  { q: "Do you offer hospital service?", a: "Yes. Tell us the pickup place and the hospital and we arrange a vehicle. We are a taxi service, not an ambulance, so for a medical emergency call 108." },
];

/* ═══════ HELPERS ═══════ */
// Image that falls back to a gradient if the file is missing
const Photo = ({ src, className = "", pos = "center", tone = 0, children }) => {
  const [ok, setOk] = useState(true);
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${TONES[tone % TONES.length]} ${className}`}>
      {ok && <img src={src} alt="" loading="lazy" style={{ objectPosition: pos }} onError={() => setOk(false)}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" />}
      {children}
    </div>
  );
};
const Reveal = ({ children, delay = 0, className = "" }) => (
  <motion.div className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay }}>{children}</motion.div>
);
const Counter = ({ to, suffix = "" }) => {
  const ref = useRef(null); const inView = useInView(ref, { once: true }); const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return; let i = 0;
    const id = setInterval(() => { i++; setN(Math.round((to * i) / 30)); if (i >= 30) clearInterval(id); }, 35);
    return () => clearInterval(id);
  }, [inView, to]);
  return <span ref={ref}>{n}{suffix}</span>;
};
const Btn = ({ href, onClick, children, variant = "rose", className = "" }) => {
  const v = { rose: "bg-gradient-to-r from-[#F4D36B] via-rose to-[#C8921F] text-ink", outline: "border-2 border-ink/20 text-ink hover:border-ink hover:bg-mist", ghost: "border border-white/40 text-white backdrop-blur hover:bg-white hover:text-ink", dark: "bg-ink text-white hover:bg-brand", wa: "bg-[#25a244] text-white" }[variant];
  return (
    <a href={href} onClick={onClick} className={`shine relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-[15px] font-semibold transition duration-300 hover:-translate-y-px hover:shadow-lg active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose ${v} ${className}`}>
      {children}
    </a>
  );
};
const Heading = ({ eyebrow, title, sub, light }) => (
  <div className="max-w-2xl">
    <p className={`mb-3 text-sm font-semibold uppercase tracking-[.18em] ${light ? "text-rose" : "text-brand"}`}>{eyebrow}</p>
    <h2 className={`font-display text-3xl font-bold tracking-tight sm:text-5xl ${light ? "text-white" : "text-ink"}`}>{title}</h2>
    {sub && <p className={`mt-4 text-lg ${light ? "text-white/70" : "text-ink/65"}`}>{sub}</p>}
  </div>
);


/* ═══════ TAXI + INTERACTION HELPERS ═══════ */
const openBook = (d = {}) => window.dispatchEvent(new CustomEvent("book", { detail: d }));

const Taxi = ({ size = 70, body = "#E5B13A", className = "" }) => (
  <svg viewBox="0 0 130 64" width={size} className={className} aria-hidden="true">
    <polygon points="116,44 190,30 190,58" fill="#E5B13A" opacity=".18" />
    <path d="M8 44 L14 30 Q18 22 30 22 H46 L54 10 H84 L94 22 H106 Q120 24 120 38 V46 H8Z" fill={body} />
    <path d="M52 22 L58 13 H82 L90 22Z" fill="#09231A" opacity=".85" />
    <rect x="62" y="3" width="20" height="8" rx="2" fill="#1B5B42" /><rect x="66" y="5.5" width="12" height="3" rx="1" fill="#fff" opacity=".85" />
    <rect x="112" y="32" width="8" height="6" rx="2" fill="#fff" />
    {[32, 96].map((cx) => (
      <g key={cx}><circle cx={cx} cy="46" r="10" fill="#06150f" />
        <g className="wheel"><circle cx={cx} cy="46" r="5" fill="#E5B13A" /><line x1={cx - 5} y1="46" x2={cx + 5} y2="46" stroke="#06150f" strokeWidth="2" /></g></g>
    ))}
  </svg>
);

const ClickBurst = () => {
  const [b, setB] = useState([]);
  useEffect(() => {
    const h = (e) => { const id = Math.random(); setB((p) => [...p, { id, x: e.clientX, y: e.clientY }]); setTimeout(() => setB((p) => p.filter((i) => i.id !== id)), 700); };
    window.addEventListener("click", h); return () => window.removeEventListener("click", h);
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-[80]">
      {b.map(({ id, x, y }) => (
        <div key={id} style={{ left: x, top: y }} className="absolute">
          {[...Array(8)].map((_, i) => (
            <motion.span key={i} className="absolute h-2 w-2 rounded-full" style={{ background: i % 2 ? "#E5B13A" : "#1B5B42" }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }} animate={{ x: Math.cos((i * Math.PI) / 4) * 36, y: Math.sin((i * Math.PI) / 4) * 36, opacity: 0, scale: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }} />
          ))}
        </div>
      ))}
    </div>
  );
};

const Tilt = ({ children, className = "" }) => {
  const r = useRef(null);
  const mv = (e) => { const b = r.current.getBoundingClientRect(); const x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
    r.current.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`; };
  return <div ref={r} onMouseMove={mv} onMouseLeave={() => (r.current.style.transform = "")} className={`transition-transform duration-200 ${className}`}>{children}</div>;
};

// Booking pop-up, opened from service cards, fleet, routes and destinations
function BookingModal() {
  const [open, setOpen] = useState(false); const [done, setDone] = useState(false);
  const [f, setF] = useState({ pickup: "Puttur", drop: "", date: "", vehicle: "Sedan" });
  useEffect(() => {
    const h = (e) => { const d = e.detail || {}; setF((p) => ({ ...p, pickup: "Puttur", drop: d.drop || "", vehicle: d.vehicle || p.vehicle })); setDone(false); setOpen(true); };
    const k = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("book", h); window.addEventListener("keydown", k);
    return () => { window.removeEventListener("book", h); window.removeEventListener("keydown", k); };
  }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => { e.preventDefault(); setOpen(false);
    window.dispatchEvent(new CustomEvent("choose", { detail: { mode: "wa", text: `Hi, I'd like to book a taxi.\nPickup: ${f.pickup}\nDrop: ${f.drop}\nDate: ${f.date}\nVehicle: ${f.vehicle}` } })); };
  const fld = "mt-1 w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15";
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] grid place-items-center bg-ink/70 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
          <motion.div onClick={(e) => e.stopPropagation()} initial={{ scale: 0.88, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.92, y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }} className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white text-ink shadow-2xl">
            <div className="relative h-16 overflow-hidden bg-[#05150f]">
              <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-rose/50" />
              <div className="absolute top-1/2 -translate-y-[78%] animate-[drive_4s_linear_infinite]"><Taxi size={74} /></div>
              <button aria-label="Close" onClick={() => setOpen(false)} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white hover:bg-white/30"><X size={18} /></button>
            </div>
            {!done ? (
              <form onSubmit={submit} className="p-6 sm:p-7">
                <h3 className="font-display text-2xl font-bold">Book your ride</h3>
                <p className="mt-1 text-sm text-ink/60">We reply on WhatsApp with the car and fare.</p>
                <div className="mt-5 grid gap-3.5">
                  <label className="text-sm font-medium">Pickup<input className={fld} value={f.pickup} onChange={set("pickup")} required /></label>
                  <label className="text-sm font-medium">Drop<input className={fld} placeholder="e.g. Mangaluru Airport" value={f.drop} onChange={set("drop")} required /></label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-sm font-medium">Date<input type="date" className={fld} value={f.date} onChange={set("date")} required /></label>
                    <label className="text-sm font-medium">Vehicle<select className={fld} value={f.vehicle} onChange={set("vehicle")}>{FLEET.map((v) => <option key={v.name}>{v.name}</option>)}</select></label>
                  </div>
                </div>
                <button type="submit" className="shine relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[#25a244] py-3.5 font-semibold text-white transition hover:bg-[#1e8a39] active:scale-95"><MessageCircle size={18} /> Send on WhatsApp</button>
              </form>
            ) : (
              <div className="p-9 text-center">
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 14 }} className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand text-white"><BadgeCheck size={34} /></motion.span>
                <h3 className="mt-5 font-display text-2xl font-bold">Request sent</h3>
                <p className="mt-1 text-ink/65">WhatsApp has opened with your trip details. We will reply shortly.</p>
                <button onClick={() => setOpen(false)} className="mt-6 rounded-full bg-ink px-6 py-3 font-semibold text-white hover:bg-brand">Done</button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


/* ═══════ SOFT THEME BACKGROUNDS (ghats, temple, palms, routes) for light sections ═══════ */
const Palm = ({ className }) => (
  <svg className={className} viewBox="-130 -420 260 440" aria-hidden="true">
    <g stroke="#1B5B42" strokeOpacity=".16" fill="none" strokeLinecap="round">
      <path d="M0 0 C6 -120 -4 -240 2 -330" strokeWidth="9" />
      <path strokeWidth="5" d="M2 -330 C-50 -350 -90 -330 -120 -290 M2 -330 C50 -350 90 -330 120 -290 M2 -330 C-30 -380 -60 -390 -90 -380 M2 -330 C30 -380 60 -390 90 -380 M2 -330 C0 -370 0 -390 4 -410" />
    </g>
  </svg>
);
const Deco = ({ v }) => (
  <div aria-hidden="true" className="deco pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
    <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-rose/30 blur-3xl" />
    {v === "routes" && (
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
        <path className="dash" d="M-20 620 C260 420 420 760 720 520 S1180 300 1460 460" fill="none" stroke="#1B5B42" strokeOpacity=".22" strokeWidth="3" strokeDasharray="4 12" strokeLinecap="round" />
        {[[180, 540], [720, 520], [1210, 330]].map(([x, y]) => (
          <g key={x} transform={`translate(${x} ${y})`} fill="#1B5B42" fillOpacity=".25"><circle r="18" fillOpacity=".12" /><path d="M0 -26 a12 12 0 0 1 12 12 c0 10 -12 24 -12 24 s-12 -14 -12 -24 a12 12 0 0 1 12 -12z" /></g>
        ))}
      </svg>
    )}
    {(v === "ghats" || v === "temple") && (
      <svg className="absolute inset-x-0 bottom-0 h-56 w-full" viewBox="0 0 1440 300" preserveAspectRatio="none">
        <path fill="#1B5B42" fillOpacity=".08" d="M0 300V190l140-70 160 80 170-110 190 100 170-80 190 90 170-70 250 70v200z" />
        <path fill="#1B5B42" fillOpacity=".07" d="M0 300V240l200-60 200 50 220-70 220 70 200-50 200 60 200-40v140z" />
      </svg>
    )}
    {v === "temple" && (
      <svg className="absolute bottom-0 right-8 hidden h-64 w-auto md:block" viewBox="0 -20 400 320" fill="#1B5B42" fillOpacity=".1">
        <rect x="40" y="270" width="320" height="30" /><rect x="80" y="190" width="240" height="80" />
        <polygon points="50,194 350,194 290,140 110,140" /><rect x="140" y="100" width="120" height="40" />
        <polygon points="120,102 280,102 240,50 160,50" /><polygon points="170,52 230,52 200,16" />
        <rect x="196" y="-4" width="8" height="20" /><circle cx="200" cy="-8" r="7" />
      </svg>
    )}
    {v !== "routes" && <Palm className="absolute bottom-0 left-2 hidden h-72 w-auto md:block" />}
    {v === "routes" && <Palm className="absolute bottom-0 right-4 hidden h-64 w-auto md:block" />}
    {[["8%", "18%", 0], ["88%", "30%", 1.5], ["60%", "78%", 0.8]].map(([l, t, d], i) => (
      <MapPin key={i} size={34} style={{ left: l, top: t, animationDelay: `${d}s` }} className="absolute animate-[bob_6s_ease-in-out_infinite] text-brand/15" />
    ))}
  </div>
);


const Vehicle = ({ kind = 0, className = "", still = false }) => {
  const shapes = [
    { body: "M14 62 L22 44 Q28 34 44 34 H70 L86 18 H122 L142 34 H164 Q186 36 186 54 V64 H14Z", win: "M76 34 L90 22 H118 L134 34Z", wheels: [52, 150] },
    { body: "M12 64 V44 Q12 34 24 32 L48 30 L64 14 H138 Q150 16 156 30 L176 36 Q190 40 190 54 V64 H12Z", win: "M70 30 L80 18 H108 V30Z M114 30 V18 H136 L146 30Z", wheels: [54, 152] },
    { body: "M10 64 V28 Q10 18 22 18 H134 Q144 18 152 28 L180 44 Q192 50 192 58 V64 H10Z", win: "M22 26h26v18H22z M54 26h26v18H54z M86 26h26v18H86z M118 26h20v18h-20z M146 30 L170 44 H146z", wheels: [50, 152] },
  ][kind];
  return (
    <svg viewBox="0 0 200 90" className={className} aria-hidden="true">
      <ellipse cx="100" cy="82" rx="84" ry="5" fill="#000" opacity=".25" />
      <path d={shapes.body} fill="#E5B13A" /><path d={shapes.win} fill="#09231A" opacity=".85" />
      <rect x="14" y="52" width="172" height="4" fill="#09231A" opacity=".8" /><rect x="180" y="46" width="8" height="6" rx="2" fill="#fff" />
      {shapes.wheels.map((cx) => (<g key={cx}><circle cx={cx} cy="66" r="13" fill="#06150f" /><g className={still ? "" : "wheel"}><circle cx={cx} cy="66" r="6" fill="#E5B13A" /><line x1={cx - 6} y1="66" x2={cx + 6} y2="66" stroke="#06150f" strokeWidth="2" /></g></g>))}
    </svg>
  );
};

const Checker = () => <div className="checker" aria-hidden="true" />;


/* ═══════ CONTACT CHOOSER: every WhatsApp / Call button asks which number ═══════ */
function ContactChooser() {
  const [st, setSt] = useState(null);
  useEffect(() => {
    const click = (e) => {
      const a = e.target.closest && e.target.closest("a");
      if (!a || a.dataset.direct) return;
      const h = a.getAttribute("href") || "";
      if (h.startsWith("https://wa.me/")) { e.preventDefault(); let t = ""; try { t = new URL(h).searchParams.get("text") || ""; } catch {} setSt({ mode: "wa", text: t }); }
      else if (h.startsWith("tel:")) { e.preventDefault(); setSt({ mode: "call" }); }
    };
    const ev = (e) => setSt(e.detail); const k = (e) => e.key === "Escape" && setSt(null);
    document.addEventListener("click", click); window.addEventListener("choose", ev); window.addEventListener("keydown", k);
    return () => { document.removeEventListener("click", click); window.removeEventListener("choose", ev); window.removeEventListener("keydown", k); };
  }, []);
  const wa_ = st?.mode === "wa";
  return (
    <AnimatePresence>
      {st && (
        <motion.div className="fixed inset-0 z-[95] grid place-items-center bg-ink/70 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSt(null)}>
          <motion.div onClick={(e) => e.stopPropagation()} initial={{ scale: 0.9, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }} className="relative w-full max-w-sm rounded-3xl bg-white p-7 text-ink shadow-2xl">
            <button aria-label="Close" onClick={() => setSt(null)} className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-mist hover:bg-rose"><X size={18} /></button>
            <span className={`grid h-14 w-14 place-items-center rounded-full text-white ${wa_ ? "bg-[#25a244]" : "bg-brand"}`}>{wa_ ? <MessageCircle size={26} /> : <Phone size={26} />}</span>
            <h3 className="mt-4 font-display text-2xl font-bold">{wa_ ? "Chat on WhatsApp" : "Call us"}</h3>
            <p className="mt-1 text-sm text-ink/60">Choose a number</p>
            <div className="mt-5 grid gap-3">
              {NUMBERS.map((n) => (
                <a key={n.raw} data-direct="1" onClick={() => setSt(null)} target={wa_ ? "_blank" : undefined} rel="noreferrer"
                  href={wa_ ? `https://wa.me/${n.raw}?text=${encodeURIComponent(st.text || "Hi, I need a taxi.")}` : `tel:+${n.raw}`}
                  className={`flex items-center justify-between rounded-2xl px-5 py-4 font-semibold transition hover:-translate-y-0.5 hover:shadow-lg ${wa_ ? "bg-[#25a244] text-white" : "bg-ink text-white"}`}>
                  <span>+91 {n.label}</span><ArrowRight size={18} />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const BRANDS = ["Shri Devi Tours And Travels", "Bhoomi Tours And Travels"];
function BrandSlider() {
  const [i, setI] = useState(0);
  useEffect(() => { const id = setInterval(() => setI((p) => (p + 1) % BRANDS.length), 3800); return () => clearInterval(id); }, []);
  return (
    <div className="mt-6">
      <div className="relative h-20 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p key={i} initial={{ y: 44, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -44, opacity: 0 }} transition={{ duration: 0.55, ease: "easeOut" }}
            className="absolute inset-0 bg-gradient-to-r from-[#FFE27A] via-rose to-[#B8860B] bg-clip-text font-display text-3xl font-extrabold leading-tight tracking-tight text-transparent sm:text-4xl lg:text-5xl">{BRANDS[i]}</motion.p>
        </AnimatePresence>
      </div>
      <div className="mt-1 flex gap-2">{BRANDS.map((_, k) => <span key={k} className={`h-1.5 rounded-full transition-all duration-500 ${k === i ? "w-8 bg-rose" : "w-3 bg-white/30"}`} />)}</div>
    </div>
  );
}


/* ═══════ NAV ═══════ */
function Nav() {
  const [open, setOpen] = useState(false); const [solid, setSolid] = useState(false);
  useEffect(() => { const f = () => setSolid(window.scrollY > 40); f(); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);
  const links = [["Services", "#services"], ["Fleet", "#fleet"], ["Tirupati", "#tirupati"], ["Destinations", "#destinations"], ["FAQ", "#faq"]];
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${solid ? "bg-ink/95 shadow-lg backdrop-blur" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <a href="#top" className="flex items-center gap-2.5 font-display text-lg font-bold text-white">
          <img src={logo} alt="" className="h-11 w-auto drop-shadow-[0_2px_8px_rgba(255,194,26,.35)]" />{CONFIG.brand}
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map(([l, h]) => <a key={l} href={h} className="link-u text-sm text-white/85 hover:text-white">{l}</a>)}
          <Btn href={`tel:+${CONFIG.phoneRaw}`} className="!py-2 !text-sm"><Phone size={16} /> Call now</Btn>
        </nav>
        <button aria-label="Menu" className="text-white md:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="flex flex-col bg-ink px-5 pb-4 md:hidden">{links.map(([l, h]) => <a key={l} href={h} onClick={() => setOpen(false)} className="py-2.5 text-white/85">{l}</a>)}</div>}
    </header>
  );
}


/* ═══════ HERO ART: Tulunadu temple, Western Ghats, areca palms ═══════ */
const HeroArt = () => (
  <div className="absolute inset-0 transition-transform duration-300 ease-out" style={{ transform: "translate(calc(var(--mx, 0) * -18px), calc(var(--my, 0) * -10px)) scale(1.05)" }}>
    <svg className="h-full w-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#06180f" /><stop offset=".55" stopColor="#235a45" /><stop offset="1" stopColor="#e8b923" /></linearGradient>
        <radialGradient id="sun"><stop offset="0" stopColor="#fff3bf" stopOpacity=".95" /><stop offset="1" stopColor="#fff3bf" stopOpacity="0" /></radialGradient>
        <g id="palm"><path d="M0 0 C6 -120 -4 -240 2 -330" stroke="#06150f" strokeWidth="9" fill="none" strokeLinecap="round" />
          <g stroke="#06150f" strokeWidth="5" fill="none" strokeLinecap="round"><path d="M2 -330 C-50 -350 -90 -330 -120 -290" /><path d="M2 -330 C50 -350 90 -330 120 -290" /><path d="M2 -330 C-30 -380 -60 -390 -90 -380" /><path d="M2 -330 C30 -380 60 -390 90 -380" /><path d="M2 -330 C0 -370 0 -390 4 -410" /></g></g>
      </defs>
      <rect width="1600" height="900" fill="url(#sky)" />
      <circle className="glow" cx="900" cy="560" r="260" fill="url(#sun)" />
      <circle cx="900" cy="560" r="70" fill="#ffe27a" opacity=".9" />
      <g className="cloud" fill="#cfe0d6" opacity=".28"><ellipse cx="300" cy="230" rx="140" ry="22" /><ellipse cx="380" cy="212" rx="90" ry="20" /></g>
      <g className="cloud2" fill="#cfe0d6" opacity=".22"><ellipse cx="1200" cy="150" rx="150" ry="20" /><ellipse cx="1280" cy="134" rx="80" ry="16" /></g>
      <path d="M0 640 L140 520 L260 600 L420 470 L560 590 L720 500 L880 610 L1040 480 L1200 590 L1360 500 L1500 580 L1600 520 V900 H0Z" fill="#3f6f5a" opacity=".55" />
      <path d="M0 700 L180 590 L330 670 L500 560 L680 680 L860 600 L1040 690 L1220 590 L1400 680 L1600 610 V900 H0Z" fill="#123f30" />
      {/* temple */}
      <g fill="#04100b">
        <rect x="740" y="738" width="340" height="26" /><rect x="720" y="760" width="380" height="20" />
        <rect x="770" y="660" width="280" height="80" />
        <polygon points="740,664 1080,664 1010,600 810,600" />
        <rect x="830" y="560" width="160" height="42" />
        <polygon points="810,562 1010,562 960,490 860,490" />
        <polygon points="870,492 950,492 910,448" />
        <rect x="905" y="418" width="10" height="32" /><circle cx="910" cy="414" r="8" />
      </g>
      <path d="M895 738 V700 a15 15 0 0 1 30 0 V738Z" fill="#E5B13A" opacity=".85" />
      <rect x="790" y="690" width="22" height="36" fill="#E5B13A" opacity=".35" /><rect x="1008" y="690" width="22" height="36" fill="#E5B13A" opacity=".35" />
      <circle cx="910" cy="414" r="8" fill="#E5B13A" />
      {/* palms */}
      <use href="#palm" x="300" y="860" transform="translate(0 0)" /><use href="#palm" x="1220" y="860" /><use href="#palm" x="1420" y="880" transform="translate(0 -30) scale(.9)" /><use href="#palm" x="140" y="900" />
      <path d="M0 800 C300 760 600 830 900 800 S1400 770 1600 810 V900 H0Z" fill="#06150f" />
    </svg>
    <p className="absolute bottom-20 left-1/2 hidden -translate-x-1/2 rounded-full border border-white/20 bg-black/20 px-4 py-1.5 text-xs tracking-widest text-white/80 backdrop-blur md:block">PUTTUR · DAKSHINA KANNADA</p>
  </div>
);

const ScrollBar = () => {
  const { scrollYProgress } = useScroll(); const x = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return <motion.div style={{ scaleX: x }} className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-rose" />;
};

/* ═══════ HERO ═══════ */
function Hero() {
  const [f, setF] = useState({ pickup: "Puttur", drop: "", date: "", vehicle: "Sedan" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const send = (e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("choose", { detail: { mode: "wa", text: `Hi, I'd like a taxi quote.\nPickup: ${f.pickup}\nDrop: ${f.drop}\nDate: ${f.date}\nVehicle: ${f.vehicle}` } })); };
  const fld = "w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15";
  return (
    <section id="top" onMouseMove={(e) => { const b = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--mx", ((e.clientX - b.left) / b.width - 0.5).toFixed(3)); e.currentTarget.style.setProperty("--my", ((e.clientY - b.top) / b.height - 0.5).toFixed(3)); }} className="relative overflow-hidden bg-ink text-white">
      <HeroArt />
      {HERO_PHOTO && <Photo src={HERO_PHOTO} className="!absolute inset-0"><span /></Photo>}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pb-40 pt-32 lg:grid-cols-[1.1fr_.9fr] lg:pt-40">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm backdrop-blur">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose opacity-75" /><span className="relative h-2 w-2 rounded-full bg-rose" /></span>
            {CONFIG.hours} · Puttur, Dakshina Kannada
          </p>
          <BrandSlider />
          <h1 className="mt-3 font-display text-[2.7rem] font-extrabold leading-[1.03] tracking-tight sm:text-7xl">
            Your ride from Puttur, <span className="bg-gradient-to-r from-[#FFE27A] via-rose to-[#B8860B] bg-clip-text text-transparent">on time</span>, every time.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/80">Airport transfers, temple trips and outstation journeys in clean AC cars with local drivers and a fare agreed before you start.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn href={`tel:+${CONFIG.phoneRaw}`}><Phone size={18} /> Call now</Btn>
            <Btn href={wa()} variant="ghost"><MessageCircle size={18} /> WhatsApp us</Btn>
          </div>
        </motion.div>
        <motion.form onSubmit={send} initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="self-start rounded-3xl bg-white p-6 text-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,.6)] sm:p-8">
          <h2 className="font-display text-2xl font-bold">Get a quote on WhatsApp</h2>
          <p className="mt-1 text-sm text-ink/60">Takes 20 seconds. We reply with car and fare.</p>
          <div className="mt-5 grid gap-3.5">
            <label className="text-sm font-medium">Pickup<input className={`${fld} mt-1`} value={f.pickup} onChange={set("pickup")} required /></label>
            <label className="text-sm font-medium">Drop<input className={`${fld} mt-1`} placeholder="e.g. Mangaluru Airport" value={f.drop} onChange={set("drop")} required /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm font-medium">Date<input type="date" className={`${fld} mt-1`} value={f.date} onChange={set("date")} required /></label>
              <label className="text-sm font-medium">Vehicle<select className={`${fld} mt-1`} value={f.vehicle} onChange={set("vehicle")}>{FLEET.map((v) => <option key={v.name}>{v.name}</option>)}</select></label>
            </div>
          </div>
          <button type="submit" className="shine relative mt-5 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[#25a244] py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1e8a39] hover:shadow-xl">
            <MessageCircle size={18} /> Send on WhatsApp
          </button>
        </motion.form>
      </div>
    
      <div className="absolute inset-x-0 bottom-0 h-20 overflow-hidden bg-[#05150f]" aria-hidden="true">
        <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-rose/60" />
        <div className="absolute top-1/2 -translate-y-[78%] animate-[drive_14s_linear_infinite]"><Taxi size={88} /></div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-24 hidden md:block" aria-hidden="true">
        {[["Dharmasthala", "6%", 0], ["Mangaluru Airport", "26%", 1.2], ["Kukke Subramanya", "50%", 0.6], ["Coorg", "70%", 1.8], ["Murudeshwar", "84%", 0.9]].map(([t, l, d]) => (
          <span key={t} style={{ left: l, animationDelay: `${d}s` }} className="absolute bottom-0 flex animate-[bob_5s_ease-in-out_infinite] items-center gap-1.5 rounded-full border border-white/25 bg-black/25 px-3.5 py-1.5 text-xs text-white/90 backdrop-blur"><MapPin size={13} />{t}</span>
        ))}
      </div>
    </section>
  );
}

/* ═══════ MARQUEE ═══════ */
const Marquee = () => {
  const items = ["Mangaluru Airport", "Dharmasthala", "Kukke Subramanya", "Udupi", "Murudeshwar", "Madikeri", "Chikmagaluru", "Bengaluru", "Mysuru", "Wayanad", "Sringeri", "Kateel"];
  return (
    <div className="overflow-hidden bg-rose py-3.5">
      <div className="flex w-max animate-[marquee_60s_linear_infinite] gap-10 whitespace-nowrap font-display text-lg font-bold text-ink">
        {[...items, ...items].map((x, i) => <span key={i} className="flex items-center gap-10">{x}<MapPin size={16} /></span>)}
      </div>
    </div>
  );
};

/* ═══════ SECTIONS ═══════ */
const Stats = () => (
  <section className="bg-ink py-14 text-white"><div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 text-center md:grid-cols-4">
    {[["24/7", null, "Bookings open"], [3, "", "Vehicle types"], [8, "", "Services"], ["Upfront", null, "Fare quote"]].map(([n, s, l]) => (
      <Reveal key={l}><div className="rounded-xl border border-rose/25 bg-black/30 py-6 shadow-[inset_0_0_30px_rgba(0,0,0,.4)]"><p className="font-mono text-4xl font-bold text-rose [text-shadow:0_0_18px_rgba(229,177,58,.7)] sm:text-5xl">{typeof n === "number" ? <Counter to={n} suffix={s} /> : n}</p><p className="mt-1 text-white/70">{l}</p></div></Reveal>
    ))}
  </div></section>
);

const Services = () => (
  <section id="services" className="has-deco relative overflow-hidden bg-mist py-24"><Deco v="ghats" /><div className="mx-auto max-w-6xl px-5">
    <Reveal><Heading eyebrow="What we do" title="One taxi service for every trip from Puttur" sub="Flight, temple visit or family wedding, book it with one call." /></Reveal>
    <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {SERVICES.map(({ icon: I, t, d }, i) => (
        <Reveal key={t} delay={(i % 4) * 0.08}>
          <div role="button" tabIndex={0} onClick={() => openBook({ drop: "" })} onKeyDown={(e) => e.key === "Enter" && openBook()} className="group h-full cursor-pointer rounded-2xl bg-white p-4 sm:p-6 ring-1 ring-ink/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-brand/40">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-brand transition duration-300 group-hover:bg-rose group-hover:text-ink"><I size={24} /></span>
            <h3 className="mt-5 font-display text-lg font-bold">{t}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink/65 sm:text-[15px]">{d}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand opacity-0 transition group-hover:opacity-100">Book now <ArrowRight size={14} /></span>
          </div>
        </Reveal>
      ))}
    </div>
  </div></section>
);

const How = () => (
  <section className="has-deco relative overflow-hidden bg-white py-24"><Deco v="routes" /><div className="mx-auto max-w-6xl px-5">
    <Reveal><Heading eyebrow="How it works" title="Booked in three steps" /></Reveal>
    <div className="relative mt-14 grid gap-8 md:grid-cols-3">
      <div className="absolute left-[16%] right-[16%] top-8 hidden md:block"><div className="border-t-2 border-dashed border-brand/40" /><div className="absolute -top-[38px] animate-[drive_9s_linear_infinite]"><Taxi size={62} /></div></div>
      {STEPS.map(({ icon: I, t, d }, i) => (
        <Reveal key={t} delay={i * 0.12} className="relative text-center">
          <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand text-white shadow-lg"><I size={26} /><b className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-rose text-xs text-ink">{i + 1}</b></span>
          <h3 className="mt-5 font-display text-xl font-bold">{t}</h3><p className="mx-auto mt-1 max-w-xs text-ink/65">{d}</p>
        </Reveal>
      ))}
    </div>
  </div></section>
);

const FleetRow = ({ v, i }) => {
  const [parked, setParked] = useState(false);
  const right = i % 2 === 1;
  const fi = v.featured ?? 0;               // highlighted photo
  const [active, setActive] = useState(fi); // photo currently shown big
  const thumbs = v.photos.map((p, k) => ({ p, k })).filter(({ k }) => k !== active);
  return (
    <div>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <motion.div initial={{ x: right ? 160 : -160, skewX: right ? 8 : -8, opacity: 0 }} whileInView={{ x: 0, skewX: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }} transition={{ type: "spring", stiffness: 60, damping: 15 }}
          className={right ? "lg:order-2" : ""}>
          {/* main photo */}
          <div className="group relative">
            <Photo src={v.photos[active]} tone={i} className="aspect-[4/3] rounded-3xl shadow-2xl ring-4 ring-rose" />
            <span className="absolute left-4 top-4 rounded-full bg-rose px-3 py-1 text-xs font-bold text-ink shadow">{v.tag}</span>
            {v.featured !== undefined && active === fi && (
              <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-ink px-3 py-1 text-xs font-bold text-rose shadow"><Star size={12} fill="currentColor" /> Featured</span>
            )}
          </div>
          {/* other photos: equal size, fully visible, click to swap */}
          <div className="mt-3 grid gap-3" style={{ gridTemplateColumns: `repeat(${thumbs.length}, minmax(0, 1fr))` }}>
            {thumbs.map(({ p, k }) => (
              <button key={p} type="button" onClick={() => setActive(k)} aria-label="Show this photo"
                className="group overflow-hidden rounded-2xl shadow-lg ring-2 ring-white transition duration-300 hover:-translate-y-1 hover:ring-rose">
                <Photo src={p} tone={i + k + 1} className={`w-full rounded-2xl ${thumbs.length === 1 ? "aspect-[21/9]" : "aspect-[16/10]"}`} />
              </button>
            ))}
          </div>
        </motion.div>
        <Reveal delay={0.15}>
          <span className="font-display text-7xl font-extrabold leading-none text-brand/15">0{i + 1}</span>
          <h3 className="-mt-2 font-display text-4xl font-bold sm:text-5xl">{v.name}</h3>
          <p className="mt-1 text-ink/55">{v.model}</p>
          <p className="mt-4 max-w-md text-lg text-ink/75">{v.desc}</p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <span className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm ring-1 ring-ink/10"><Users size={16} />{v.seats} seats</span>
            <span className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm ring-1 ring-ink/10"><Luggage size={16} />{v.bags}</span>
            <span className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm ring-1 ring-ink/10"><Snowflake size={16} />AC</span>
          </div>
          <Btn href="#" onClick={(e) => { e.preventDefault(); openBook({ vehicle: v.name }); }} variant="dark" className="mt-7">Book {v.name} <ArrowRight size={16} /></Btn>
        </Reveal>
      </div>
      <div className="relative mt-6 h-16 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-x-0 bottom-3 border-t-2 border-dashed border-ink/25" />
        <motion.div initial={{ left: "-20%" }} whileInView={{ left: "70%" }} viewport={{ once: true }} transition={{ duration: 2.6, ease: [0.22, 0.8, 0.3, 1] }}
          onAnimationComplete={() => setParked(true)} className="absolute bottom-1.5"><Vehicle kind={i} still={parked} className="w-32" /></motion.div>
      </div>
    </div>
  );
};

const Fleet = () => (
  <section id="fleet" className="has-deco relative overflow-hidden bg-mist py-24"><Deco v="routes" />
    <div className="mx-auto max-w-6xl px-5">
      <Reveal><Heading eyebrow="Our fleet" title="Pick the car that fits your group" /></Reveal>
      <div className="mt-16 grid gap-16">{FLEET.map((v, i) => <FleetRow key={v.name} v={v} i={i} />)}</div>
    </div>
  </section>
);


const TirupatiPackage = () => (
  <section id="tirupati" className="has-deco relative overflow-hidden bg-white py-24"><Deco v="temple" />
    <div className="mx-auto max-w-6xl px-5">
      <Reveal><Heading eyebrow="Tour package" title="Tirupati Tour Package" sub="A comfortable trip from Puttur to the Tirumala Venkateswara temple and back." /></Reveal>
      <Reveal delay={0.1}>
        <div className="mt-12 grid overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-ink/10 lg:grid-cols-[1.05fr_.95fr]">
          <div className="group relative min-h-[280px]">
            <Photo src={IMG.tirupati} className="!absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute left-5 top-5 rounded-full bg-rose px-3.5 py-1 text-xs font-bold text-ink">Pilgrimage package</span>
              <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-6 text-white">
                <span className="font-display text-xl font-bold">Puttur</span>
                <span className="relative h-0.5 flex-1 border-t-2 border-dashed border-white/60"><MapPin className="absolute -top-3 left-1/2 -translate-x-1/2 text-rose" size={22} fill="currentColor" /></span>
                <span className="font-display text-xl font-bold">Tirupati</span>
              </div>
            </Photo>
          </div>
          <div className="p-7 sm:p-10">
            <h3 className="font-display text-2xl font-bold sm:text-3xl">Darshan trip, planned around you</h3>
            <p className="mt-3 text-ink/70">Tell us your dates and how many are travelling. We suggest the right vehicle and send the fare before you start.</p>
            <ul className="mt-6 grid gap-3">
              {["Sedan, SUV or Tempo Traveller to suit your group", "Clean AC vehicle with an experienced driver", "Stops and timings planned with you", "Fare quoted before you travel"].map((t) => (
                <li key={t} className="flex items-start gap-3"><BadgeCheck className="mt-0.5 shrink-0 text-brand" size={22} /><span>{t}</span></li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Btn href="#" onClick={(e) => { e.preventDefault(); openBook({ drop: "Tirupati" }); }}>Get Tirupati quote <ArrowRight size={16} /></Btn>
              <Btn href={`tel:+${CONFIG.phoneRaw}`} variant="outline"><Phone size={16} /> Call us</Btn>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

const Destinations = () => (
  <section id="destinations" className="bg-ink py-24 text-white"><div className="mx-auto max-w-6xl px-5">
    <Reveal><Heading light eyebrow="Destinations" title="Where we take you" sub="Car, driver and fuel in fixed plans. Tell us your dates and we adjust the stops." /></Reveal>
    <div className="mt-14 grid auto-rows-[220px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {DEST.map((d, i) => (
        <Reveal key={d.t} delay={(i % 3) * 0.08} className={d.big ? "sm:col-span-2" : ""}>
          <a href={wa(`Hi, I'm interested in a trip to ${d.t}.`)} onClick={(e) => { e.preventDefault(); openBook({ drop: d.t }); }} className="group block h-full rounded-2xl">
            <Photo src={d.img} tone={i} pos={POS[i % POS.length]} className="h-full rounded-2xl"><MapPin className="absolute right-4 top-4 text-white/15" size={84} strokeWidth={1.2} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-xl font-bold">{d.t}</h3>
                <p className="text-sm text-white/75">{d.s}</p>
                <span className="mt-2 inline-flex translate-y-3 items-center gap-1 text-sm font-semibold text-rose opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">Book this trip <ArrowRight size={14} /></span>
              </div>
            </Photo>
          </a>
        </Reveal>
      ))}
    </div>
  </div></section>
);

const Why = () => (
  <section className="has-deco relative overflow-hidden bg-white py-24"><Deco v="ghats" /><div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2">
    <Reveal><Heading eyebrow="Why us" title="Local drivers. Clean cars. No surprises." sub="We are based in Puttur and drive these roads every week." /></Reveal>
    <div className="grid gap-4 sm:grid-cols-2">
      {[[ShieldCheck, "Quote before you travel", "The fare is agreed up front."], [Clock, "Day and night bookings", "Early flights and late arrivals covered."],
        [MapPin, "Know the route", "Drivers used to ghat and temple roads."], [Snowflake, "Clean AC vehicles", "Cleaned and checked before every trip."]].map(([I, t, d], i) => (
        <Reveal key={t} delay={i * 0.08}><div className="rounded-2xl bg-mist p-5 transition hover:-translate-y-1 hover:shadow-lg"><I className="text-brand" size={26} /><h3 className="mt-3 font-semibold">{t}</h3><p className="text-[15px] text-ink/65">{d}</p></div></Reveal>
      ))}
    </div>
  </div></section>
);

const Reviews = () => (
  <section className="has-deco relative overflow-hidden bg-mist py-24"><Deco v="temple" /><div className="mx-auto max-w-6xl px-5">
    <Reveal><Heading eyebrow="Reviews" title="What customers say" /></Reveal>
    <div className="mt-12 grid gap-6 md:grid-cols-3">
      {REVIEWS.map((r, i) => (
        <Reveal key={i} delay={i * 0.1}><Tilt className="h-full"><figure className="h-full rounded-2xl bg-white p-7 ring-1 ring-ink/10 transition hover:shadow-xl">
          <div className="flex gap-0.5 text-[#f0b400]">{[...Array(5)].map((_, k) => <Star key={k} size={17} fill="currentColor" />)}</div>
          <blockquote className="mt-4 leading-relaxed text-ink/80">{r.p}</blockquote>
          <figcaption className="mt-5 text-sm"><b>{r.n}</b> · {r.c}</figcaption></figure></Tilt></Reveal>
      ))}
    </div>
  </div></section>
);

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="has-deco relative overflow-hidden bg-white py-24"><Deco v="routes" />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <Heading eyebrow="FAQ" title="Questions before you book" sub="Quick answers about booking, fares and trips." />
          <div className="mt-8 rounded-3xl bg-ink p-6 text-white">
            <p className="font-display text-xl font-bold">Still have a question?</p>
            <p className="mt-1 text-white/70">Talk to us directly. We reply fast.</p>
            <div className="mt-5 flex flex-wrap gap-3"><Btn href={`tel:+${CONFIG.phoneRaw}`}><Phone size={16} /> Call us</Btn><Btn href={wa()} variant="wa"><MessageCircle size={16} /> WhatsApp</Btn></div>
          </div>
        </Reveal>
        <div className="grid gap-3">
          {FAQS.map((f, i) => (
            <div key={f.q} className={`rounded-2xl bg-white ring-1 transition ${open === i ? "shadow-lg ring-brand/40" : "ring-ink/10"}`}>
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center gap-4 px-5 py-4 text-left font-semibold">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm transition ${open === i ? "bg-rose text-ink" : "bg-mist text-brand"}`}>{i + 1}</span>
                <span className="flex-1">{f.q}</span>
                <ChevronDown className={`shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} size={20} />
              </button>
              <AnimatePresence initial={false}>{open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="px-5 pb-5 pl-[4.25rem] text-ink/70">{f.a}</p></motion.div>)}</AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const CTA = () => (
  <section className="relative overflow-hidden bg-rose py-20"><span aria-hidden="true" className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2">{[0, 1, 2].map((i) => <span key={i} className="absolute -left-28 -top-28 h-56 w-56 animate-[ring_5s_ease-out_infinite] rounded-full border border-ink/20" style={{ animationDelay: `${i * 1.6}s` }} />)}<MapPin className="relative text-ink/20" size={64} /></span>
    <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-5 md:flex-row md:items-center">
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-8 overflow-hidden"><div className="absolute bottom-1 animate-[drive_12s_linear_infinite]"><Taxi size={64} body="#09231A" /></div></div>
      <h2 className="max-w-xl font-display text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">Tell us where you are going. We will send the fare.</h2>
      <div className="flex flex-wrap gap-3"><Btn href={`tel:+${CONFIG.phoneRaw}`} variant="dark"><Phone size={18} /> Call now</Btn><Btn href={wa()} variant="wa"><MessageCircle size={18} /> WhatsApp</Btn></div>
    </div></section>
);

const Footer = () => (
  <footer className="bg-ink pb-24 pt-16 text-white/75 md:pb-14"><div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-3">
    <div><img src={logo} alt="" className="h-14 w-auto" /><p className="mt-3 font-display text-xl font-bold text-white">{CONFIG.brand}</p><p className="mt-2 text-[15px] text-rose">Shri Devi Tours And Travels<br />Bhoomi Tours And Travels</p><p className="mt-3 max-w-xs text-[15px]">Taxi service for airport transfers, pilgrimages and outstation trips from Puttur.</p></div>
    <div className="text-[15px]"><p className="font-semibold text-white">Contact</p><p className="mt-3">+91 94484 28266</p><p>+91 86602 73535</p><p><a href={`mailto:${CONFIG.email}`} className="hover:text-rose">{CONFIG.email}</a></p><p className="mt-2">{CONFIG.address}</p><p className="mt-2">{CONFIG.hours}</p></div>
    <div className="overflow-hidden rounded-2xl ring-1 ring-white/10"><iframe title="Map" className="h-44 w-full" loading="lazy" src="https://www.google.com/maps?q=Puttur,+Karnataka&output=embed" /></div>
  </div><p className="mx-auto mt-10 max-w-6xl px-5 text-sm text-white/45">© {new Date().getFullYear()} {CONFIG.brand} · Place photos from Wikimedia Commons</p></footer>
);

const Floating = () => (
  <>
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 md:hidden">
      <a href={`tel:+${CONFIG.phoneRaw}`} className="flex items-center justify-center gap-2 bg-rose py-3.5 font-semibold text-ink"><Phone size={18} /> Call</a>
      <a href={wa()} className="flex items-center justify-center gap-2 bg-[#25a244] py-3.5 font-semibold text-white"><MessageCircle size={18} /> WhatsApp</a>
    </div>
    <a href={wa()} aria-label="WhatsApp" className="fixed bottom-6 right-6 z-50 hidden h-14 w-14 place-items-center rounded-full bg-[#25a244] text-white shadow-xl transition hover:scale-110 md:grid">
      <MessageCircle className="relative" size={26} />
    </a>
  </>
);

export default function App() {
  return (
    <div className="font-body text-char antialiased">
      <ScrollBar /><ClickBurst /><BookingModal /><ContactChooser /><Nav /><Hero /><Checker /><Marquee /><Checker /><Stats /><Services /><How /><Fleet /><TirupatiPackage /><Destinations /><Why /><Reviews /><FAQ /><Checker /><CTA /><Footer /><Floating />
    </div>
  );
}