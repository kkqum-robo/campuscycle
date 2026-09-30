import { useState, useMemo, useEffect, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MessageCircle,
  MapPin,
  Star,
  ShoppingBag,
  Store,
  ShieldCheck,
  Music,
  PlusCircle,
  ArrowUpDown,
  Heart,
  Check,
  Camera,
  Trash2,
} from 'lucide-react';

type Product = {
  id: number;
  cat: string;
  name: string;
  price: number;
  hostel: string;
  quality: string;
  desc: string;
  img: string;
  phone?: string;
  mine?: boolean;
};

// AGH & PGH = girls hostels, KBH = boys hostel
const HOSTEL_GENDER: Record<string, string> = {
  AGH: 'girls',
  PGH: 'girls',
  KBH: 'boys',
};

const IMG = {
  bucket: 'https://i.ibb.co/Jj3tBBS6/1000197800.jpg',
  labCoat: 'https://i.ibb.co/Sw2zJCyx/1000197802.jpg',
  calc: 'https://i.ibb.co/TDfw84nq/1000197798.jpg',
  curtains: 'https://i.ibb.co/Kpf8p6wG/1000197790.jpg',
  geometry: 'https://i.ibb.co/5WZQ5Rkw/1000197816.jpg',
  uniform: 'https://i.ibb.co/b5VHpzTT/1000197806.jpg',
  broom: 'https://i.ibb.co/Fb4S7Kbd/1000197794.jpg',
  mattress: 'https://i.ibb.co/jknJHpdc/Screenshot-2026-09-30-102721.png',
  sheetHolder: 'https://i.ibb.co/MyJptqdN/1000197745.jpg',
  extension: 'https://i.ibb.co/4nKK8hYM/1000197810.jpg',
  dustpan: 'https://i.ibb.co/gFz0SKG9/1000197796.jpg',
  roller: 'https://i.ibb.co/kRhmqG1/1000197814.jpg',
  clips: 'https://i.ibb.co/N6GHg9P1/1000197792.jpg',
};

const ALL_PRODUCTS: Product[] = [
  // ACADEMIC
  { id: 1, cat: 'academic', name: 'Lab Coat', price: 150, hostel: 'AGH', quality: 'Like New', desc: 'Clean white lab coat, perfectly maintained.', img: IMG.labCoat },
  { id: 101, cat: 'academic', name: 'Lab Coat', price: 100, hostel: 'KBH', quality: 'Good', desc: 'Slightly used, great condition.', img: IMG.labCoat },
  { id: 2, cat: 'academic', name: 'Workshop Uniform', price: 300, hostel: 'KBH', quality: 'Good', desc: 'Khaki workshop uniform, durable and clean.', img: IMG.uniform },
  { id: 6, cat: 'academic', name: 'Deli Scientific Calc', price: 500, hostel: 'PGH', quality: 'Brand New', desc: 'D552PR model, includes box.', img: IMG.calc },
  { id: 8, cat: 'academic', name: 'Camlin Geometry Box', price: 150, hostel: 'KBH', quality: 'Like New', desc: 'Complete set with compass.', img: IMG.geometry },
  { id: 9, cat: 'academic', name: 'Draftsman Clips', price: 50, hostel: 'PGH', quality: 'New', desc: 'Plastic clips for drawing.', img: IMG.clips },
  { id: 13, cat: 'academic', name: 'Drawing Sheet Holder', price: 200, hostel: 'KBH', quality: 'Good', desc: 'Tube-style sheet holder with shoulder strap.', img: IMG.sheetHolder },
  { id: 10, cat: 'academic', name: 'Roller Scale', price: 50, hostel: 'AGH', quality: 'Good', desc: '30cm roll-n-draw ruler.', img: IMG.roller },

  // HOSTEL ESSENTIALS
  { id: 3, cat: 'hostel', name: 'Bucket & Mug', price: 100, hostel: 'KBH', quality: 'Used', desc: 'Essential bathing set, no cracks.', img: IMG.bucket },
  { id: 4, cat: 'hostel', name: 'Broom', price: 0, hostel: 'AGH', quality: 'Fair', desc: 'Giving away for free!', img: IMG.broom },
  { id: 5, cat: 'hostel', name: 'Dustpan', price: 0, hostel: 'AGH', quality: 'Fair', desc: 'Giving away for free!', img: IMG.dustpan },
  { id: 7, cat: 'hostel', name: 'Extension Board', price: 150, hostel: 'AGH', quality: 'Good', desc: '3-way extension reel, 5 meters long.', img: IMG.extension },
  { id: 11, cat: 'hostel', name: 'Curtains', price: 200, hostel: 'PGH', quality: 'Good', desc: 'Beautiful blue curtains.', img: IMG.curtains },
  { id: 12, cat: 'hostel', name: 'Comfort Mattress', price: 800, hostel: 'PGH', quality: 'Good', desc: 'High-quality striped mattress.', img: IMG.mattress },
];

const MOODS = [
  { word: 'BAD', bg: '#f7937a', fg: '#6e2114', rx: 22, ry: 22, y: 78, mouth: 'M 82 152 Q 120 118 158 152' },
  { word: 'NOT BAD', bg: '#f7c650', fg: '#5e410a', rx: 32, ry: 13, y: 90, mouth: 'M 88 148 Q 120 132 152 148' },
  { word: 'GOOD', bg: '#cfe86a', fg: '#24400d', rx: 34, ry: 34, y: 66, mouth: 'M 82 138 Q 120 178 158 138' },
];

function Feedback({ order, onClose }: { order: Product; onClose: () => void }) {
  const [mood, setMood] = useState(2);
  const [note, setNote] = useState('');
  const [rated, setRated] = useState(false);
  const [phase, setPhase] = useState<'processing' | 'placed' | 'rate'>('processing');
  useEffect(() => {
    const a = setTimeout(() => setPhase('placed'), 1800);
    const b = setTimeout(() => setPhase('rate'), 3400);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);
  const m = MOODS[mood];
  const tone =
    phase === 'processing'
      ? { bg: '#172f63', fg: '#ffebcc' }
      : phase === 'placed'
      ? { bg: '#f7c650', fg: '#5e410a' }
      : m;
  const spring = { type: 'spring' as const, stiffness: 260, damping: 22 };
  return (
    <motion.div
      initial={{ opacity: 0, backgroundColor: '#172f63', color: '#ffebcc' }}
      animate={{ opacity: 1, backgroundColor: tone.bg, color: tone.fg }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex flex-col items-center px-6 pt-6 pb-8 overflow-y-auto"
    >
      <div className="w-full max-w-sm flex items-center justify-between">
        <button onClick={onClose} className="p-2 rounded-full bg-black/10">
          <X size={22} />
        </button>
        <span className="text-xs font-bold bg-black/10 px-3 py-1.5 rounded-full">
          {phase === 'processing' ? 'Processing' : 'Order placed'} • {order.name}
        </span>
      </div>

      {phase !== 'rate' ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {phase === 'processing' ? (
            <>
              <motion.div
                className="w-20 h-20 rounded-full border-8 border-current border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
              />
              <p className="mt-8 text-3xl font-black tracking-tighter">Placing your order…</p>
              <p className="mt-2 opacity-70">{order.name}</p>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="w-24 h-24 rounded-full bg-current flex items-center justify-center"
              >
                <Check size={48} strokeWidth={4} style={{ color: '#f7c650' }} />
              </motion.div>
              <p className="mt-8 text-4xl font-black tracking-tighter">Order placed!</p>
              <p className="mt-2 opacity-70">Now, how was it?</p>
            </>
          )}
        </div>
      ) : rated ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xs">
          <p className="text-5xl font-black tracking-tighter">Thanks!</p>
          <p className="mt-3">Chat with the seller to pick a meeting spot on campus.</p>
          <button
            onClick={onClose}
            className="mt-8 px-8 py-4 rounded-full text-white font-bold"
            style={{ background: m.fg }}
          >
            Back to marketplace
          </button>
        </div>
      ) : (
        <div className="flex-1 w-full max-w-sm flex flex-col items-center">
          <h2 className="mt-8 text-center font-semibold text-lg max-w-[14rem] leading-snug">
            How was your shopping experience?
          </h2>
          <svg viewBox="0 0 240 200" className="w-64 mt-6">
            {[70, 170].map((cx) => (
              <motion.ellipse
                key={cx}
                cx={cx}
                fill="currentColor"
                initial={{ cy: MOODS[2].y, rx: MOODS[2].rx, ry: MOODS[2].ry }}
                animate={{ cy: m.y, rx: m.rx, ry: m.ry }}
                transition={spring}
              />
            ))}
            <motion.path
              fill="none"
              stroke="currentColor"
              strokeWidth={10}
              strokeLinecap="round"
              initial={{ d: MOODS[2].mouth }}
              animate={{ d: m.mouth }}
              transition={spring}
            />
          </svg>
          <motion.p
            key={m.word}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 0.55 }}
            className="mt-4 text-6xl font-black tracking-tighter self-start"
          >
            {m.word}
          </motion.p>
          <input
            type="range"
            min={0}
            max={2}
            step={1}
            value={mood}
            onChange={(e) => setMood(+e.target.value)}
            className="w-full mt-8"
            style={{ accentColor: m.fg }}
          />
          <div className="w-full flex justify-between text-xs font-bold mt-2 opacity-70">
            <span>Bad</span>
            <span>Not bad</span>
            <span>Good</span>
          </div>
          <div className="w-full mt-8 flex gap-3">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add note"
              className="flex-1 min-w-0 px-4 py-3 rounded-full bg-black/10 outline-none placeholder:text-black/40"
            />
            <button
              onClick={() => setRated(true)}
              className="px-6 py-3 rounded-full text-white font-bold"
              style={{ background: m.fg }}
            >
              Submit →
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

const SELLER_PHONE = '919999999999'; // replace with a real number: country code + number, no + or spaces
const openWhatsApp = (item: Product) =>
  window.open(
    `https://wa.me/${item.phone ?? SELLER_PHONE}?text=${encodeURIComponent(
      `Hi! I'm interested in your ${item.name} (₹${item.price}) on CampusCycle. Is it still available?`
    )}`,
    '_blank'
  );

const STEP_ORDER = ['onboarding', 'verify', 'profile', 'role'];
const STEP_MOOD: Record<string, number> = { onboarding: 0, verify: 1, profile: 1, role: 2 };
const COPY: Record<string, string[]> = {
  onboarding: ['Got stuff piling up in your hostel?', 'Sell it, swap it or grab it free from verified students on campus.'],
  verify: ['First, prove you are a student', 'Only verified students can trade here.'],
  profile: ['Tell us who you are', 'Buyers and sellers see this on your listings.'],
  role: ['How will you use CampusCycle?', 'You can always do both later.'],
};

function Face({ mood }: { mood: number }) {
  const m = MOODS[mood];
  const spring = { type: 'spring' as const, stiffness: 260, damping: 22 };
  return (
    <motion.svg
      viewBox="0 0 240 200"
      className="w-52"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {[70, 170].map((cx) => (
        <motion.ellipse
          key={cx}
          cx={cx}
          fill="currentColor"
          initial={false}
          animate={{ cy: m.y, rx: m.rx, ry: m.ry }}
          transition={spring}
        />
      ))}
      <motion.path
        fill="none"
        stroke="currentColor"
        strokeWidth={10}
        strokeLinecap="round"
        initial={false}
        animate={{ d: m.mouth }}
        transition={spring}
      />
    </motion.svg>
  );
}

type Prof = { name: string; year: string; hostel: string };

function Onboarding(props: {
  step: string;
  setStep: (s: string) => void;
  collegeId: string;
  setCollegeId: (v: string) => void;
  profile: Prof;
  setProfile: (p: Prof) => void;
  setRole: (r: string) => void;
}) {
  const { step, setStep, collegeId, setCollegeId, profile, setProfile, setRole } = props;
  const idx = STEP_ORDER.indexOf(step);
  const m = MOODS[STEP_MOOD[step]];
  const field = 'w-full px-5 py-4 rounded-full bg-black/10 outline-none placeholder:text-black/40 font-medium';
  const cta = 'mt-8 px-8 py-4 rounded-full text-white font-bold text-lg disabled:opacity-40 transition-all active:scale-95';
  const roles = [
    { k: 'buyer', label: 'I want to buy', Icon: ShoppingBag },
    { k: 'seller', label: 'I want to sell', Icon: Store },
  ];
  return (
    <motion.div
      initial={false}
      animate={{ backgroundColor: m.bg, color: m.fg }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0 }}
      className="relative z-10 min-h-screen flex flex-col items-center px-6 pt-8 pb-10"
    >
      <div className="flex gap-2">
        {STEP_ORDER.map((st, i) => (
          <span
            key={st}
            className="h-2 rounded-full bg-current transition-all"
            style={{ width: i === idx ? 32 : 8, opacity: i <= idx ? 1 : 0.25 }}
          />
        ))}
      </div>
      <div className="mt-6">
        <Face mood={STEP_MOOD[step]} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-sm flex flex-col items-center text-center"
        >
          <h1 className="mt-6 text-4xl font-black tracking-tighter leading-[0.95]">{COPY[step][0]}</h1>
          <p className="mt-3 opacity-70 max-w-xs">{COPY[step][1]}</p>

          {step === 'onboarding' && (
            <button className={cta} style={{ background: m.fg }} onClick={() => setStep('verify')}>
              Let's fix that →
            </button>
          )}
          {step === 'verify' && (
            <>
              <input
                value={collegeId}
                onChange={(e) => setCollegeId(e.target.value)}
                placeholder="College ID"
                className={`${field} mt-8 text-center`}
              />
              <button disabled={!collegeId} className={cta} style={{ background: m.fg }} onClick={() => setStep('profile')}>
                Verify →
              </button>
            </>
          )}
          {step === 'profile' && (
            <>
              <div className="w-full mt-8 space-y-3">
                <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Full name" className={field} />
                <input value={profile.year} onChange={(e) => setProfile({ ...profile, year: e.target.value })} placeholder="Year & department" className={field} />
                <input value={profile.hostel} onChange={(e) => setProfile({ ...profile, hostel: e.target.value })} placeholder="Hostel block" className={field} />
              </div>
              <button disabled={!profile.name} className={cta} style={{ background: m.fg }} onClick={() => setStep('role')}>
                Continue →
              </button>
            </>
          )}
          {step === 'role' && (
            <div className="w-full mt-8 flex flex-col gap-3">
              {roles.map(({ k, label, Icon }) => (
                <button
                  key={k}
                  onClick={() => {
                    setRole(k);
                    setStep('market');
                  }}
                  className="w-full flex items-center justify-center gap-3 py-5 rounded-full text-white font-bold text-lg active:scale-95 transition-all"
                  style={{ background: m.fg }}
                >
                  <Icon size={22} /> {label}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

const STORE_KEY = 'campuscycle-listings-v1';
const EMPTY_FORM = { name: '', price: '', cat: 'academic', quality: 'Good', hostel: 'AGH', desc: '', phone: '', img: '' };
const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#fdebb0"/><text x="100" y="120" font-size="72" text-anchor="middle">📦</text></svg>'
  );

const loadListings = (): Product[] => {
  try {
    const saved = localStorage.getItem(STORE_KEY);
    return saved ? [...(JSON.parse(saved) as Product[]), ...ALL_PRODUCTS] : ALL_PRODUCTS;
  } catch {
    return ALL_PRODUCTS;
  }
};

const resizeImage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, 800 / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext('2d')?.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.8));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });

export default function CampusCycle() {
  const [step, setStep] = useState('onboarding');
  const [, setRole] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [profile, setProfile] = useState({ name: '', year: '', hostel: '' });
  const [activeTab, setActiveTab] = useState('academic');
  const [filterGender, setFilterGender] = useState('all');
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [saved, setSaved] = useState<number[]>([]);
  const [order, setOrder] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(loadListings);
  const [form, setForm] = useState(EMPTY_FORM);
  const [toast, setToast] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(products.filter((p) => p.mine)));
    } catch {
      /* storage full: listings just won't persist */
    }
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.cat === activeTab &&
        (filterGender === 'all' || HOSTEL_GENDER[p.hostel] === filterGender)
    );
  }, [products, activeTab, filterGender]);

  const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
  const modalInput =
    'w-full px-4 py-3.5 rounded-2xl bg-[#fdf3d0] outline-none focus:ring-2 focus:ring-[#172f63] placeholder:text-[#5e410a]/50';
  const set =
    (k: keyof typeof EMPTY_FORM) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((v) => ({ ...v, [k]: e.target.value }));
  const canPost =
    form.name.trim() !== '' && form.price !== '' && form.phone.replace(/\D/g, '').length >= 10;
  const postListing = () => {
    const digits = form.phone.replace(/\D/g, '');
    const item: Product = {
      id: Date.now(),
      cat: form.cat,
      name: form.name.trim(),
      price: Number(form.price) || 0,
      hostel: form.hostel,
      quality: form.quality,
      desc: form.desc.trim() || 'Listed by a fellow student.',
      img: form.img || PLACEHOLDER,
      phone: digits.length === 10 ? '91' + digits : digits,
      mine: true,
    };
    setProducts((prev) => [item, ...prev]);
    setActiveTab(item.cat);
    setFilterGender('all');
    setIsSellModalOpen(false);
    setForm(EMPTY_FORM);
    setToast('Listed! Your item is live 🎉');
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div
      className="min-h-screen bg-[#f7c650] text-slate-800 relative overflow-hidden"
      style={{ fontFamily: "'Poppins', ui-sans-serif, system-ui, sans-serif" }}
    >
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');"}</style>
      {/* BACKGROUND ELEMENTS */}

      <AnimatePresence mode="wait">
{step !== 'market' && (
          <Onboarding
            key="onboarding-flow"
            step={step}
            setStep={setStep}
            collegeId={collegeId}
            setCollegeId={setCollegeId}
            profile={profile}
            setProfile={setProfile}
            setRole={setRole}
          />
        )}

        {step === 'market' && (
          <motion.div
            key="market"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pb-24"
          >
            {/* HEADER */}
            <div className="sticky top-0 z-40 bg-[#f7c650]/90 backdrop-blur-lg p-6 border-b border-[#172f63]/10">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <svg viewBox="0 0 40 40" className="w-9 h-9">
                    <rect width="40" height="40" rx="12" fill="#172f63" />
                    <circle cx="14" cy="17" r="4" fill="#f7c650" />
                    <circle cx="26" cy="17" r="4" fill="#f7c650" />
                    <path d="M12 26 Q20 33 28 26" stroke="#f7c650" strokeWidth="3" strokeLinecap="round" fill="none" />
                  </svg>
                  <h1 className="text-2xl font-extrabold text-[#172f63] tracking-tight">CampusCycle</h1>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsSellModalOpen(true)}
                    className="flex items-center gap-2 bg-[#172f63] text-[#f7c650] px-4 py-2 rounded-full text-sm font-bold hover:bg-[#0b1730] transition-all"
                  >
                    <PlusCircle size={18} /> Sell Item
                  </button>
                  <div className="w-10 h-10 bg-[#172f63] rounded-full flex items-center justify-center text-[#f7c650] font-bold">
                    {profile.name[0]?.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 mt-8">
              <h2 className="text-4xl font-black tracking-tighter leading-[0.95] text-[#172f63]">
                Hey {profile.name.split(' ')[0]},<br />what are you trading today?
              </h2>
            </div>

            {/* DAILY VIBE */}
            <div className="max-w-4xl mx-auto px-6 my-8">
              <div className="bg-[#172f63] p-6 rounded-[32px] text-white relative overflow-hidden">
                <div className="relative z-10 flex items-start gap-4">
                  <div className="p-3 bg-[#f7c650] text-[#172f63] rounded-2xl">
                    <Music size={24} />
                  </div>
                  <div>
                    <p className="text-[#ffebcc] text-sm font-medium">Today's Vibe 🎵</p>
                    <h3 className="text-xl font-bold">"Taylor Swift - Campus Edition"</h3>
                    <p className="text-[#ffebcc] text-xs italic mt-1">
                      "Shake it off, trade it on."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CATEGORIES & FILTERS */}
            <div className="max-w-4xl mx-auto px-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                <div className="flex gap-3 p-1.5 bg-[#172f63]/10 rounded-full w-fit">
                  {[
                    ['academic', 'Academic'],
                    ['hostel', 'Hostel Essentials'],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`px-6 py-2 rounded-full transition-all font-bold text-sm ${
                        activeTab === key
                          ? 'bg-[#172f63] text-[#f7c650]'
                          : 'text-[#172f63]/70'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <select
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                    className="px-4 py-2 rounded-full bg-white border border-[#dce6f6] text-sm font-medium outline-none focus:border-[#2f5aa0] transition-all"
                  >
                    <option value="all">All Hostels</option>
                    <option value="boys">Boys Hostel</option>
                    <option value="girls">Girls Hostel</option>
                  </select>
                  <button className="p-2 bg-white border border-[#dce6f6] rounded-full text-[#1e3f80] hover:bg-[#eef3fb] transition-all">
                    <ArrowUpDown size={20} />
                  </button>
                </div>
              </div>

              {/* PRODUCT GRID */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedItem(item)}
                    className="bg-white rounded-[32px] p-3 border-2 border-transparent hover:border-[#172f63] cursor-pointer transition-all group"
                  >
                    <div className="aspect-square rounded-[24px] bg-[#eef3fb] overflow-hidden mb-4 border border-[#dce6f6]">
                      <img
                        src={item.img}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        alt={item.name}
                      />
                    </div>
                    <h3 className="font-bold text-slate-800 truncate px-1">{item.name}</h3>
                    <div className="flex items-center justify-between mt-2 px-1">
                      <span className="text-[#172f63] font-black">₹{item.price}</span>
                      <span className="text-[10px] bg-[#fdebb0] px-2 py-1 rounded-lg text-[#5e410a] font-bold uppercase">
                        {item.hostel}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SELL ITEM MODAL */}
      <AnimatePresence>
        {isSellModalOpen && (
          <motion.div
            {...fade}
            className="fixed inset-0 bg-[#0b1730]/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center sm:p-6"
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-t-[36px] sm:rounded-[36px] p-6 relative max-h-[92vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsSellModalOpen(false)}
                className="absolute top-5 right-5 p-2 bg-slate-100 rounded-full"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-black tracking-tight text-[#172f63] mb-5">List an item</h2>
              <div className="space-y-3">
                <label className="flex flex-col items-center justify-center h-40 rounded-2xl border-2 border-dashed border-[#172f63]/30 bg-[#fdf3d0] cursor-pointer overflow-hidden">
                  {form.img ? (
                    <img src={form.img} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Camera size={28} className="text-[#172f63]" />
                      <span className="mt-2 text-sm font-semibold text-[#172f63]">Add a photo</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      try {
                        const img = await resizeImage(f);
                        setForm((v) => ({ ...v, img }));
                      } catch {
                        /* unreadable file: ignore */
                      }
                    }}
                  />
                </label>
                <input value={form.name} onChange={set('name')} placeholder="Item name" className={modalInput} />
                <div className="flex gap-3">
                  <input
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={set('price')}
                    placeholder="Price (0 = free)"
                    className={`${modalInput} w-1/2`}
                  />
                  <select value={form.cat} onChange={set('cat')} className={`${modalInput} w-1/2`}>
                    <option value="academic">Academic</option>
                    <option value="hostel">Hostel essentials</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <select value={form.quality} onChange={set('quality')} className={`${modalInput} w-1/2`}>
                    {['Brand New', 'Like New', 'Good', 'Fair', 'Used'].map((q) => (
                      <option key={q}>{q}</option>
                    ))}
                  </select>
                  <select value={form.hostel} onChange={set('hostel')} className={`${modalInput} w-1/2`}>
                    <option value="AGH">AGH (Girls)</option>
                    <option value="PGH">PGH (Girls)</option>
                    <option value="KBH">KBH (Boys)</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  value={form.desc}
                  onChange={set('desc')}
                  placeholder="Short description (optional)"
                  className={`${modalInput} resize-none`}
                />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="Your WhatsApp number"
                  className={modalInput}
                />
                <p
                  className={`text-xs px-1 ${
                    form.phone && form.phone.replace(/\D/g, '').length < 10 ? 'text-red-600 font-semibold' : 'text-slate-500'
                  }`}
                >
                  {form.phone && form.phone.replace(/\D/g, '').length < 10
                    ? 'Enter a valid 10-digit WhatsApp number'
                    : 'Buyers will message you on this number.'}
                </p>
                <button
                  disabled={!canPost}
                  onClick={postListing}
                  className="w-full py-4 bg-[#172f63] text-[#f7c650] rounded-2xl font-bold text-lg disabled:opacity-40 active:scale-95 transition-all"
                >
                  Post listing
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[130] bg-[#172f63] text-[#f7c650] font-bold px-6 py-3 rounded-full shadow-xl whitespace-nowrap"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {order && <Feedback key="feedback" order={order} onClose={() => setOrder(null)} />}
      </AnimatePresence>

      {/* PRODUCT DETAIL CARD */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              {...fade}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-[#0b1730]/60 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed bottom-0 left-0 right-0 z-[70] max-w-lg mx-auto bg-white rounded-t-[36px] overflow-hidden shadow-[0_-20px_60px_rgba(11,23,48,0.35)] flex flex-col max-h-[92vh]"
            >
              {/* HERO IMAGE */}
              <div className="relative h-72 shrink-0 overflow-hidden bg-[#eef3fb]">
                <img
                  src={selectedItem.img}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-60"
                />
                <img
                  src={selectedItem.img}
                  alt={selectedItem.name}
                  className="relative w-full h-full object-contain p-5 drop-shadow-2xl"
                />
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/80 rounded-full" />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-5 right-5 p-2.5 bg-white/90 backdrop-blur rounded-full shadow-md hover:bg-white transition-all"
                >
                  <X size={20} className="text-[#172f63]" />
                </button>
                <div className="absolute bottom-4 left-5 flex gap-2">
                  <span className="flex items-center gap-1.5 bg-white/95 text-[#172f63] text-xs font-bold px-3 py-1.5 rounded-full shadow">
                    <Star size={14} className="text-[#f7ae55] fill-[#f7ae55]" />
                    {selectedItem.quality}
                  </span>
                  <span className="flex items-center gap-1.5 bg-[#1e3f80] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                    <MapPin size={14} />
                    {selectedItem.hostel}
                  </span>
                </div>
              </div>

              {/* DETAILS */}
              <div className="px-6 pt-6 pb-4 overflow-y-auto">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-[#172f63] leading-tight">
                      {selectedItem.name}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      {HOSTEL_GENDER[selectedItem.hostel] === 'girls'
                        ? 'Girls hostel'
                        : 'Boys hostel'}{' '}
                      • {selectedItem.cat === 'academic' ? 'Academic' : 'Hostel essentials'}
                    </p>
                  </div>
                  {selectedItem.price === 0 ? (
                    <span className="px-4 py-1.5 rounded-full bg-[#ffebcc] text-[#b06a12] text-lg font-black">
                      Free
                    </span>
                  ) : (
                    <span className="text-3xl font-black text-[#d9861a]">
                      ₹{selectedItem.price}
                    </span>
                  )}
                </div>

                <p className="text-slate-600 leading-relaxed mt-4">{selectedItem.desc}</p>

                <div className="flex items-center gap-3 mt-5 p-3 rounded-2xl bg-[#eef3fb] border border-[#dce6f6]">
                  <div className="w-11 h-11 rounded-full bg-[#1e3f80] text-white flex items-center justify-center font-bold">
                    {selectedItem.hostel[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#172f63] text-sm">
                      Seller from {selectedItem.hostel}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-bold text-[#1e3f80]">
                    <ShieldCheck size={16} /> Verified
                  </span>
                </div>
              </div>

              {/* ACTION BAR */}
              <div className="flex gap-3 p-4 border-t border-[#eef3fb] bg-white">
                {selectedItem.mine && (
                  <button
                    aria-label="Remove my listing"
                    onClick={() => {
                      setProducts((prev) => prev.filter((x) => x.id !== selectedItem.id));
                      setSelectedItem(null);
                    }}
                    className="w-14 h-14 rounded-2xl border-2 border-red-200 flex items-center justify-center hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={22} className="text-red-500" />
                  </button>
                )}
                <button
                  onClick={() =>
                    setSaved((s) =>
                      s.includes(selectedItem.id)
                        ? s.filter((id) => id !== selectedItem.id)
                        : [...s, selectedItem.id]
                    )
                  }
                  className="w-14 h-14 rounded-2xl border-2 border-[#dce6f6] flex items-center justify-center hover:bg-[#eef3fb] transition-all"
                >
                  <Heart
                    size={22}
                    className={
                      saved.includes(selectedItem.id)
                        ? 'text-[#d9861a] fill-[#d9861a]'
                        : 'text-[#1e3f80]'
                    }
                  />
                </button>
                <button onClick={() => openWhatsApp(selectedItem)} className="h-14 px-5 rounded-2xl border-2 border-[#1e3f80] text-[#1e3f80] font-bold flex items-center gap-2 hover:bg-[#eef3fb] transition-all">
                  <MessageCircle size={20} /> Chat
                </button>
                <button
                  onClick={() => {
                    setOrder(selectedItem);
                    setSelectedItem(null);
                  }}
                  className="flex-1 h-14 bg-[#1e3f80] text-white rounded-2xl font-bold text-lg shadow-lg shadow-[#b9cdec] hover:bg-[#172f63] transition-all"
                >
                  Buy now{selectedItem.price ? ` · ₹${selectedItem.price}` : ' · Free'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}