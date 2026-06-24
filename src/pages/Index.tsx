import { useState } from 'react';
import Icon from '@/components/ui/icon';

const MAP_IMG = 'https://cdn.poehali.dev/projects/3056daaf-9ac7-4923-8d17-8291d5ab8cd2/files/8d3b0a2c-604f-4aa0-8df1-bf12a18bdddd.jpg';
const LOGO_IMG = 'https://cdn.poehali.dev/projects/3056daaf-9ac7-4923-8d17-8291d5ab8cd2/bucket/01d0c1d5-6c45-4cb0-95fb-1b90edd87102.png';

type Tab = 'home' | 'map' | 'orders' | 'support' | 'master';

const services = [
  { icon: 'Users', name: 'Разнорабочие', desc: 'Любая физическая работа' },
  { icon: 'Truck', name: 'Грузчики', desc: 'Переезд, погрузка, доставка' },
  { icon: 'Hammer', name: 'Сборка мебели', desc: 'Сборка и разборка мебели' },
  { icon: 'Zap', name: 'Электрик', desc: 'Монтаж и ремонт электрики' },
  { icon: 'Wrench', name: 'Сантехник', desc: 'Трубы, краны, унитазы' },
  { icon: 'Sparkles', name: 'Клининг', desc: 'Уборка квартир и офисов' },
  { icon: 'PaintRoller', name: 'Ремонт', desc: 'Отделка и мелкий ремонт' },
  { icon: 'Sofa', name: 'Химчистка', desc: 'Чистка мягкой мебели' },
];

const masters = [
  { name: 'Алексей Петров', job: 'Сантехник', rating: 4.9, jobs: 312, price: 'от 800 ₽/час', dist: '1.2 км', online: true, init: 'АП' },
  { name: 'Сергей Иванов', job: 'Электрик', rating: 4.8, jobs: 198, price: 'от 700 ₽/час', dist: '2.4 км', online: true, init: 'СИ' },
  { name: 'Дмитрий Котов', job: 'Разнорабочий', rating: 5.0, jobs: 421, price: 'от 600 ₽/час', dist: '0.8 км', online: false, init: 'ДК' },
  { name: 'Игорь Соколов', job: 'Сборка мебели', rating: 4.7, jobs: 156, price: 'от 900 ₽/час', dist: '3.1 км', online: true, init: 'ИС' },
];

type Order = { id: string; service: string; master: string; status: string; step: number; price: string; time: string; addr?: string; phone?: string };

const initialOrders: Order[] = [
  { id: '#1042', service: 'Установка смесителя', master: 'Алексей Петров', status: 'В пути', step: 2, price: '1 200 ₽', time: 'Сегодня, 14:30' },
  { id: '#1038', service: 'Замена розеток (3 шт)', master: 'Сергей Иванов', status: 'Выполнен', step: 4, price: '2 100 ₽', time: 'Вчера, 11:00' },
  { id: '#1031', service: 'Сборка шкафа', master: 'Игорь Соколов', status: 'Выполнен', step: 4, price: '1 800 ₽', time: '12 июня' },
];

const statusFlow = ['Принят', 'Выехал', 'В пути', 'Работает', 'Выполнен'];

export default function Index() {
  const [tab, setTab] = useState<Tab>('home');
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [orderTarget, setOrderTarget] = useState<{ master?: typeof masters[0]; service?: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const newRequests = orders.filter((o) => o.status === 'Новая заявка');

  const createOrder = (data: { service: string; addr: string; phone: string; master: string }) => {
    const id = '#' + (1043 + orders.length);
    setOrders((prev) => [
      { id, service: data.service, master: data.master, status: 'Новая заявка', step: -1, price: '—', time: 'Только что', addr: data.addr, phone: data.phone },
      ...prev,
    ]);
    setOrderTarget(null);
    setToast('Заявка отправлена! Мастер скоро откликнется');
    setTimeout(() => setToast(null), 3000);
  };

  const acceptRequest = (id: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: 'Принят', step: 0, price: '1 000 ₽' } : o));
    setToast('Заявка принята');
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#111111] flex justify-center">
      <div className="w-full max-w-md bg-[#111111] relative pb-24 min-h-screen">
        {tab === 'home' && <HomeScreen onOrder={(m) => setOrderTarget({ master: m })} onCategory={(s) => setOrderTarget({ service: s })} onCallMaster={() => setOrderTarget({})} />}
        {tab === 'map' && <MapScreen />}
        {tab === 'orders' && <OrdersScreen orders={orders} onNew={() => setTab('home')} />}
        {tab === 'support' && <SupportScreen />}
        {tab === 'master' && <MasterScreen requests={newRequests} onAccept={acceptRequest} />}

        {orderTarget && (
          <OrderModal target={orderTarget} onClose={() => setOrderTarget(null)} onSubmit={createOrder} />
        )}

        {toast && (
          <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[60] bg-[#FFD600] text-black px-5 py-3 rounded-xl text-sm font-bold shadow-xl animate-scale-in flex items-center gap-2">
            <Icon name="CircleCheck" size={18} />{toast}
          </div>
        )}

        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#1a1a1a] border-t border-[#2a2a2a] px-2 py-2 flex justify-around z-50">
          {([
            ['home', 'House', 'Главная'],
            ['map', 'Map', 'Карта'],
            ['orders', 'ClipboardList', 'Заказы'],
            ['support', 'Headset', 'Помощь'],
            ['master', 'BriefcaseBusiness', 'Мастеру'],
          ] as const).map(([key, icon, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${tab === key ? 'text-[#FFD600]' : 'text-[#555]'}`}
            >
              <Icon name={icon} size={22} />
              <span className="text-[10px] font-semibold tracking-wide">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="px-5 pt-8 pb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl px-3 py-1.5">
          <Icon name="MapPin" size={13} className="text-[#FFD600]" />
          <span className="text-xs font-bold text-white">Усть-Кут</span>
        </div>
        <button className="relative w-10 h-10 rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] flex items-center justify-center">
          <Icon name="Bell" size={18} className="text-white" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FFD600] rounded-full" />
        </button>
      </div>
    </div>
  );
}

function HomeScreen({ onOrder, onCategory, onCallMaster }: { onOrder: (m: typeof masters[0]) => void; onCategory: (s: string) => void; onCallMaster: () => void }) {
  return (
    <div className="animate-fade-in">
      <Header />

      {/* Hero */}
      <div className="px-5 mt-2">
        <div className="relative overflow-hidden rounded-2xl bg-[#FFD600] p-6">
          <div className="absolute right-4 bottom-0 opacity-10">
            <Icon name="Wrench" size={120} className="text-black" />
          </div>
          <div className="relative">
            <img src={LOGO_IMG} alt="МастерОФФ" className="h-16 w-auto object-contain mb-4" />
            <p className="text-black/70 text-sm font-medium">Приедем за 15–30 минут.<br />Оплата после работы.</p>
            <button onClick={onCallMaster} className="mt-4 bg-black text-[#FFD600] font-black text-sm px-6 py-3 rounded-xl uppercase tracking-wide hover:opacity-90 transition flex items-center gap-2">
              <Icon name="Phone" size={16} />Вызвать мастера
            </button>
          </div>
        </div>
      </div>

      {/* Phone strip */}
      <div className="mx-5 mt-3 bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-[#666] text-[10px] font-semibold uppercase tracking-wider">Звоните напрямую</p>
          <p className="text-white font-black text-lg tracking-wide">+7 (950) 099-09-31</p>
        </div>
        <button className="bg-[#FFD600] text-black w-11 h-11 rounded-xl flex items-center justify-center">
          <Icon name="Phone" size={20} />
        </button>
      </div>

      {/* Services */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-black text-white text-xl uppercase tracking-tight">Услуги</h2>
          <span className="text-[#FFD600] text-xs font-bold">8 категорий</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {services.map((s, i) => (
            <button
              key={s.name}
              onClick={() => onCategory(s.name)}
              style={{ animationDelay: `${i * 50}ms` }}
              className="animate-fade-in opacity-0 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#FFD600] rounded-2xl p-4 text-left transition-all group"
            >
              <span className="w-10 h-10 rounded-xl bg-[#FFD600] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Icon name={s.icon} size={20} className="text-black" />
              </span>
              <p className="font-bold text-white text-sm leading-tight">{s.name}</p>
              <p className="text-[#555] text-xs mt-0.5 leading-tight">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Why us */}
      <div className="px-5 mt-6">
        <h2 className="font-display font-black text-white text-xl uppercase tracking-tight mb-4">Почему МастерОФФ?</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: 'Clock', val: '15 мин', label: 'Время приезда' },
            { icon: 'ShieldCheck', val: '100%', label: 'Гарантия' },
            { icon: 'BadgeCheck', val: '24/7', label: 'Работаем' },
          ].map((f) => (
            <div key={f.label} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-3 text-center">
              <Icon name={f.icon} size={22} className="text-[#FFD600] mx-auto mb-2" />
              <p className="font-black text-white text-lg leading-none">{f.val}</p>
              <p className="text-[#555] text-[10px] mt-1 leading-tight">{f.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Masters */}
      <div className="px-5 mt-6 mb-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-black text-white text-xl uppercase tracking-tight">Мастера</h2>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-500 text-xs font-bold">3 онлайн</span>
          </div>
        </div>
        <div className="space-y-3">
          {masters.map((m) => <MasterCard key={m.name} m={m} onOrder={onOrder} />)}
        </div>
      </div>
    </div>
  );
}

function MasterCard({ m, onOrder }: { m: typeof masters[0]; onOrder: (m: typeof masters[0]) => void }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 flex items-center gap-3">
      <div className="relative flex-shrink-0">
        <div className="w-14 h-14 rounded-xl bg-[#FFD600] flex items-center justify-center font-display font-black text-black text-lg">
          {m.init}
        </div>
        {m.online && <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-[#1a1a1a]" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-white text-sm">{m.name}</p>
        <p className="text-[#888] text-xs">{m.job}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="flex items-center gap-0.5 text-[#FFD600] text-xs font-bold">
            <Icon name="Star" size={11} className="fill-[#FFD600] text-[#FFD600]" />{m.rating}
          </span>
          <span className="text-[#555] text-xs">{m.jobs} заказов</span>
          <span className="text-[#555] text-xs flex items-center gap-0.5"><Icon name="MapPin" size={11} />{m.dist}</span>
        </div>
      </div>
      <button onClick={() => onOrder(m)} className="bg-[#FFD600] text-black rounded-xl px-3 py-2 text-xs font-black hover:opacity-90 transition flex-shrink-0">
        Заказать
      </button>
    </div>
  );
}

function MapScreen() {
  return (
    <div className="animate-fade-in">
      <Header />
      <div className="px-5">
        <h2 className="font-display font-black text-white text-xl uppercase tracking-tight mb-4">Карта мастеров</h2>
        <div className="relative rounded-2xl overflow-hidden border border-[#2a2a2a] h-[420px]">
          <img src={MAP_IMG} alt="Карта Усть-Кута" className="w-full h-full object-cover" />
          {[
            { top: '28%', left: '32%', online: true },
            { top: '52%', left: '60%', online: true },
            { top: '40%', left: '48%', online: false },
            { top: '68%', left: '38%', online: true },
          ].map((p, i) => (
            <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: p.top, left: p.left }}>
              {p.online && <span className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-[#FFD600]/40 animate-ping-slow" />}
              <div className={`relative w-9 h-9 rounded-xl ${p.online ? 'bg-[#FFD600]' : 'bg-[#333]'} flex items-center justify-center shadow-lg ring-2 ring-black`}>
                <Icon name="Wrench" size={16} className={p.online ? 'text-black' : 'text-[#666]'} />
              </div>
            </div>
          ))}
          <div className="absolute bottom-4 left-4 right-4 bg-black/90 backdrop-blur rounded-xl p-3 flex items-center gap-3 border border-[#2a2a2a]">
            <span className="w-10 h-10 rounded-xl bg-[#FFD600] flex items-center justify-center flex-shrink-0">
              <Icon name="Wrench" size={18} className="text-black" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">3 мастера онлайн рядом</p>
              <p className="text-xs text-[#666]">Ближайший в 0.8 км от вас</p>
            </div>
            <Icon name="ChevronRight" size={18} className="text-[#555]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersScreen({ orders, onNew }: { orders: Order[]; onNew: () => void }) {
  return (
    <div className="animate-fade-in">
      <div className="px-5 pt-8 pb-4 flex items-center justify-between">
        <h2 className="font-display font-black text-white text-xl uppercase tracking-tight">Мои заказы</h2>
        <button onClick={onNew} className="bg-[#FFD600] text-black rounded-xl px-3 py-2 text-xs font-black flex items-center gap-1 hover:opacity-90 transition">
          <Icon name="Plus" size={14} />Новый
        </button>
      </div>
      <div className="px-5 space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-white text-sm">{o.service}</p>
                <p className="text-[#666] text-xs mt-0.5">{o.master} · {o.id}</p>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg flex-shrink-0 uppercase tracking-wide ${
                o.status === 'Выполнен' ? 'bg-emerald-500/20 text-emerald-400' :
                o.status === 'Новая заявка' ? 'bg-[#FFD600]/20 text-[#FFD600]' :
                'bg-white/10 text-white'
              }`}>
                {o.status}
              </span>
            </div>
            {o.step >= 0 ? (
              <>
                <div className="flex items-center gap-1 mt-4">
                  {statusFlow.map((s, i) => (
                    <div key={s} className="flex-1">
                      <div className={`h-1.5 rounded-full ${i <= o.step ? 'bg-[#FFD600]' : 'bg-[#2a2a2a]'}`} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1.5">
                  {statusFlow.map((s, i) => (
                    <span key={s} className={`text-[8px] font-semibold ${i <= o.step ? 'text-[#FFD600]' : 'text-[#444]'}`}>{s}</span>
                  ))}
                </div>
              </>
            ) : (
              <div className="mt-3 flex items-center gap-2 text-xs text-[#FFD600]">
                <Icon name="LoaderCircle" size={14} className="animate-spin" />Ждём отклика мастера
              </div>
            )}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2a2a2a]">
              <span className="text-xs text-[#555] flex items-center gap-1"><Icon name="Clock" size={11} />{o.time}</span>
              <span className="font-black text-white text-sm">{o.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderModal({ target, onClose, onSubmit }: { target: { master?: typeof masters[0]; service?: string }; onClose: () => void; onSubmit: (d: { service: string; addr: string; phone: string; master: string }) => void }) {
  const [service, setService] = useState(target.service || target.master?.job || '');
  const [addr, setAddr] = useState('');
  const [phone, setPhone] = useState('');
  const masterName = target.master?.name || 'Любой свободный мастер';
  const valid = service.trim() && addr.trim() && phone.trim();

  return (
    <div className="fixed inset-0 z-[55] flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-md bg-[#1a1a1a] rounded-t-3xl p-6 pb-10 border-t border-[#2a2a2a] animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="w-12 h-1 bg-[#333] rounded-full mx-auto mb-5" />
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#FFD600] flex items-center justify-center font-black text-black text-lg">
            {target.master?.init || <Icon name="Wrench" size={22} className="text-black" />}
          </div>
          <div>
            <p className="font-black text-white text-base uppercase">Заказать мастера</p>
            <p className="text-xs text-[#666]">{masterName}</p>
          </div>
        </div>

        <label className="text-[#FFD600] text-[10px] font-black uppercase tracking-widest">Что нужно сделать</label>
        <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Например, починить кран"
          className="w-full mt-1.5 mb-4 bg-[#111] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FFD600] transition placeholder:text-[#444]" />

        <label className="text-[#FFD600] text-[10px] font-black uppercase tracking-widest">Адрес в Усть-Куте</label>
        <input value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="ул. Кирова, 12, кв. 5"
          className="w-full mt-1.5 mb-4 bg-[#111] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FFD600] transition placeholder:text-[#444]" />

        <label className="text-[#FFD600] text-[10px] font-black uppercase tracking-widest">Телефон</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 (___) ___-__-__" inputMode="tel"
          className="w-full mt-1.5 mb-6 bg-[#111] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FFD600] transition placeholder:text-[#444]" />

        <button disabled={!valid} onClick={() => onSubmit({ service, addr, phone, master: masterName })}
          className="w-full bg-[#FFD600] text-black font-black py-4 rounded-xl uppercase tracking-wide disabled:opacity-30 transition hover:opacity-90 text-sm">
          Отправить заявку
        </button>
      </div>
    </div>
  );
}

function SupportScreen() {
  const items = [
    { icon: 'Phone', title: 'Позвонить', sub: '+7 (950) 099-09-31', color: 'bg-[#FFD600] text-black' },
    { icon: 'MessageCircle', title: 'Написать в Telegram', sub: '@masteroff_uk', color: 'bg-[#1e1e1e] text-white border border-[#2a2a2a]' },
    { icon: 'CircleHelp', title: 'Частые вопросы', sub: 'Оплата, гарантии, отмена', color: 'bg-[#1e1e1e] text-white border border-[#2a2a2a]' },
    { icon: 'ShieldCheck', title: 'Гарантия качества', sub: 'Все мастера проверены', color: 'bg-[#1e1e1e] text-white border border-[#2a2a2a]' },
  ];
  return (
    <div className="animate-fade-in">
      <div className="px-5 pt-8 pb-4">
        <h2 className="font-display font-black text-white text-xl uppercase tracking-tight">Поддержка</h2>
        <p className="text-[#666] text-sm mt-1">На связи 24/7</p>
      </div>
      <div className="px-5 space-y-3">
        {items.map((it) => (
          <button key={it.title} className={`w-full ${it.color} rounded-2xl p-4 flex items-center gap-4 hover:opacity-90 transition`}>
            <span className={`w-12 h-12 rounded-xl ${it.icon === 'Phone' ? 'bg-black' : 'bg-[#FFD600]'} flex items-center justify-center flex-shrink-0`}>
              <Icon name={it.icon} size={22} className={it.icon === 'Phone' ? 'text-[#FFD600]' : 'text-black'} />
            </span>
            <div className="flex-1 text-left">
              <p className="font-bold text-sm">{it.title}</p>
              <p className={`text-xs mt-0.5 ${it.icon === 'Phone' ? 'text-black/70' : 'text-[#666]'}`}>{it.sub}</p>
            </div>
            <Icon name="ChevronRight" size={18} className={it.icon === 'Phone' ? 'text-black/40' : 'text-[#444]'} />
          </button>
        ))}
      </div>
      <div className="px-5 mt-5">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
          <p className="text-[#FFD600] text-[10px] font-black uppercase tracking-widest mb-2">Наш адрес</p>
          <p className="text-white text-sm font-medium">г. Усть-Кут</p>
          <p className="text-[#666] text-xs mt-0.5">Ежедневно 8:00 – 22:00</p>
        </div>
      </div>
    </div>
  );
}

function MasterScreen({ requests, onAccept }: { requests: Order[]; onAccept: (id: string) => void }) {
  const stats = [
    { label: 'Заказов', value: '4' },
    { label: 'Заработано', value: '5 400' },
    { label: 'Рейтинг', value: '4.9' },
  ];
  return (
    <div className="animate-fade-in">
      <div className="px-5 pt-8">
        <div className="bg-[#FFD600] rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute right-4 bottom-0 opacity-10">
            <Icon name="BriefcaseBusiness" size={100} className="text-black" />
          </div>
          <img src={LOGO_IMG} alt="МастерОФФ" className="h-6 w-auto object-contain mb-4 relative" />
          <div className="flex items-center gap-3 relative">
            <div className="w-14 h-14 rounded-xl bg-black flex items-center justify-center font-black text-[#FFD600] text-lg">АП</div>
            <div>
              <p className="font-black text-black text-lg uppercase">Алексей Петров</p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-black/70 text-xs font-semibold">Сантехник</p>
                <span className="flex items-center gap-1 bg-black/10 rounded-full px-2 py-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                  <span className="text-[10px] font-bold text-black">онлайн</span>
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 relative">
            {stats.map((s) => (
              <div key={s.label} className="bg-black/10 rounded-xl p-3 text-center">
                <p className="font-black text-black text-xl leading-none">{s.value}</p>
                <p className="text-black/60 text-[10px] mt-1 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="flex items-center justify-between bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Icon name="Power" size={20} />
            </span>
            <div>
              <p className="font-bold text-white text-sm">Приём заказов</p>
              <p className="text-xs text-[#666]">Вы получаете уведомления</p>
            </div>
          </div>
          <div className="w-12 h-6 rounded-full bg-emerald-500 flex items-center px-1 justify-end">
            <span className="w-4 h-4 rounded-full bg-white" />
          </div>
        </div>
      </div>

      <div className="px-5 mt-5">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-display font-black text-white text-lg uppercase tracking-tight">Новые заявки</h3>
          {requests.length > 0 && (
            <span className="bg-[#FFD600] text-black text-[10px] font-black px-2 py-0.5 rounded-full animate-scale-in">{requests.length}</span>
          )}
        </div>
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="bg-[#1a1a1a] border border-[#FFD600]/40 rounded-2xl p-4 animate-fade-in">
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold text-white text-sm">{r.service}</p>
                <span className="text-[10px] font-black text-[#FFD600] flex items-center gap-1 flex-shrink-0">
                  <Icon name="Clock" size={11} />{r.time}
                </span>
              </div>
              {r.addr && <p className="text-xs text-[#666] mt-1 flex items-center gap-1"><Icon name="MapPin" size={12} />{r.addr}</p>}
              {r.phone && <p className="text-xs text-[#666] mt-0.5 flex items-center gap-1"><Icon name="Phone" size={12} />{r.phone}</p>}
              <div className="flex gap-2 mt-3">
                <button onClick={() => onAccept(r.id)} className="flex-1 bg-[#FFD600] text-black rounded-xl py-2.5 text-xs font-black uppercase hover:opacity-90 transition">Принять</button>
                <button className="flex-1 bg-[#111] border border-[#2a2a2a] text-[#666] rounded-xl py-2.5 text-xs font-bold uppercase">Отклонить</button>
              </div>
            </div>
          ))}
          {[
            { id: 'demo1', service: 'Течёт кран на кухне', addr: 'ул. Речников, 8', price: '900 ₽', phone: '+7 950 111-22-33' },
            { id: 'demo2', service: 'Установить унитаз', addr: 'мкр. Лена, 22', price: '1 500 ₽', phone: '+7 950 444-55-66' },
          ].map((r) => (
            <div key={r.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <p className="font-bold text-white text-sm">{r.service}</p>
                <span className="font-black text-[#FFD600] text-sm">{r.price}</span>
              </div>
              <p className="text-xs text-[#666] mt-1 flex items-center gap-1"><Icon name="MapPin" size={12} />{r.addr}</p>
              <p className="text-xs text-[#666] mt-0.5 flex items-center gap-1"><Icon name="Phone" size={12} />{r.phone}</p>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 bg-[#FFD600] text-black rounded-xl py-2.5 text-xs font-black uppercase hover:opacity-90 transition">Принять</button>
                <button className="flex-1 bg-[#111] border border-[#2a2a2a] text-[#666] rounded-xl py-2.5 text-xs font-bold uppercase">Отклонить</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}