import { useState } from 'react';
import Icon from '@/components/ui/icon';

const MAP_IMG = 'https://cdn.poehali.dev/projects/3056daaf-9ac7-4923-8d17-8291d5ab8cd2/files/8d3b0a2c-604f-4aa0-8df1-bf12a18bdddd.jpg';

type Tab = 'home' | 'map' | 'orders' | 'support' | 'master';

const categories = [
  { icon: 'Wrench', name: 'Сантехник', color: 'bg-blue-500' },
  { icon: 'Zap', name: 'Электрик', color: 'bg-amber-500' },
  { icon: 'Hammer', name: 'Сборка мебели', color: 'bg-emerald-500' },
  { icon: 'PaintRoller', name: 'Ремонт', color: 'bg-rose-500' },
  { icon: 'Tv', name: 'Техника', color: 'bg-violet-500' },
  { icon: 'Sparkles', name: 'Уборка', color: 'bg-cyan-500' },
];

const masters = [
  { name: 'Алексей Петров', job: 'Сантехник', rating: 4.9, jobs: 312, price: 'от 800 ₽', dist: '1.2 км', online: true, init: 'АП' },
  { name: 'Сергей Иванов', job: 'Электрик', rating: 4.8, jobs: 198, price: 'от 700 ₽', dist: '2.4 км', online: true, init: 'СИ' },
  { name: 'Дмитрий Котов', job: 'Мастер на час', rating: 5.0, jobs: 421, price: 'от 600 ₽', dist: '0.8 км', online: false, init: 'ДК' },
  { name: 'Игорь Соколов', job: 'Сборка мебели', rating: 4.7, jobs: 156, price: 'от 900 ₽', dist: '3.1 км', online: true, init: 'ИС' },
];

const orders = [
  { id: '#1042', service: 'Установка смесителя', master: 'Алексей Петров', status: 'В пути', step: 2, price: '1 200 ₽', time: 'Сегодня, 14:30' },
  { id: '#1038', service: 'Замена розеток (3 шт)', master: 'Сергей Иванов', status: 'Выполнен', step: 4, price: '2 100 ₽', time: 'Вчера, 11:00' },
  { id: '#1031', service: 'Сборка шкафа', master: 'Игорь Соколов', status: 'Выполнен', step: 4, price: '1 800 ₽', time: '12 июня' },
];

const statusFlow = ['Принят', 'Выехал', 'В пути', 'Работает', 'Выполнен'];

export default function Index() {
  const [tab, setTab] = useState<Tab>('home');

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-md bg-background relative pb-24 min-h-screen overflow-hidden">
        {tab === 'home' && <HomeScreen />}
        {tab === 'map' && <MapScreen />}
        {tab === 'orders' && <OrdersScreen />}
        {tab === 'support' && <SupportScreen />}
        {tab === 'master' && <MasterScreen />}

        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 backdrop-blur-xl border-t border-border px-2 py-2 flex justify-around z-50">
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
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all ${tab === key ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Icon name={icon} size={22} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="px-5 pt-6 pb-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-muted-foreground">Ваш город</p>
        <div className="flex items-center gap-1">
          <Icon name="MapPin" size={16} className="text-accent" />
          <h2 className="font-display font-bold text-lg">Усть-Кут</h2>
        </div>
      </div>
      <button className="relative w-11 h-11 rounded-2xl bg-secondary flex items-center justify-center">
        <Icon name="Bell" size={20} className="text-primary" />
        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-accent rounded-full ring-2 ring-secondary" />
      </button>
    </div>
  );
}

function HomeScreen() {
  return (
    <div className="animate-fade-in">
      <Header />

      <div className="px-5">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground">
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-accent/30 blur-2xl" />
          <div className="absolute -right-4 bottom-0 opacity-20 animate-float">
            <Icon name="Wrench" size={90} />
          </div>
          <h1 className="font-display font-extrabold text-2xl leading-tight relative">Мастер на час<br />за 15 минут</h1>
          <p className="text-sm text-primary-foreground/80 mt-2 relative max-w-[70%]">Проверенные специалисты Усть-Кута. Оплата после работы.</p>
          <button className="mt-4 bg-accent text-accent-foreground font-semibold text-sm px-5 py-2.5 rounded-xl relative hover:opacity-90 transition">
            Вызвать мастера
          </button>
        </div>
      </div>

      <div className="px-5 mt-6">
        <h3 className="font-display font-bold text-base mb-3">Услуги</h3>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((c, i) => (
            <button key={c.name} style={{ animationDelay: `${i * 60}ms` }} className="animate-scale-in opacity-0 bg-card border border-border rounded-2xl p-3 flex flex-col items-center gap-2 hover:border-primary transition">
              <span className={`${c.color} w-11 h-11 rounded-xl flex items-center justify-center text-white`}>
                <Icon name={c.icon} size={20} />
              </span>
              <span className="text-xs font-medium text-center leading-tight">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-base">Мастера рядом</h3>
          <span className="text-xs text-primary font-medium">Все</span>
        </div>
        <div className="space-y-3">
          {masters.map((m) => <MasterCard key={m.name} m={m} />)}
        </div>
      </div>
    </div>
  );
}

function MasterCard({ m }: { m: typeof masters[0] }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-3 flex items-center gap-3">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-display font-bold">
          {m.init}
        </div>
        {m.online && <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-card" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h4 className="font-semibold text-sm truncate">{m.name}</h4>
          <span className="flex items-center gap-0.5 text-xs text-amber-500 font-medium">
            <Icon name="Star" size={12} className="fill-amber-400 text-amber-400" />{m.rating}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{m.job} · {m.jobs} заказов</p>
        <div className="flex items-center gap-3 mt-1 text-xs">
          <span className="font-semibold text-primary">{m.price}</span>
          <span className="text-muted-foreground flex items-center gap-0.5"><Icon name="MapPin" size={11} />{m.dist}</span>
        </div>
      </div>
      <button className="bg-secondary text-secondary-foreground rounded-xl px-3 py-2 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition">
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
        <div className="relative rounded-3xl overflow-hidden border border-border h-[460px]">
          <img src={MAP_IMG} alt="Карта Усть-Кута" className="w-full h-full object-cover" />
          {[
            { top: '28%', left: '32%', name: 'Алексей', online: true },
            { top: '52%', left: '60%', name: 'Сергей', online: true },
            { top: '40%', left: '48%', name: 'Дмитрий', online: false },
            { top: '68%', left: '38%', name: 'Игорь', online: true },
          ].map((p, i) => (
            <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: p.top, left: p.left }}>
              {p.online && <span className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-accent/40 animate-ping-slow" />}
              <div className={`relative w-9 h-9 rounded-full ${p.online ? 'bg-accent' : 'bg-muted-foreground'} flex items-center justify-center text-white shadow-lg ring-2 ring-white`}>
                <Icon name="Wrench" size={16} />
              </div>
            </div>
          ))}
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-2xl p-3 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white"><Icon name="Wrench" size={18} /></span>
            <div className="flex-1">
              <p className="text-sm font-semibold">3 мастера онлайн рядом</p>
              <p className="text-xs text-muted-foreground">Ближайший в 0.8 км от вас</p>
            </div>
            <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersScreen() {
  return (
    <div className="animate-fade-in">
      <div className="px-5 pt-6 pb-2">
        <h2 className="font-display font-extrabold text-2xl">Мои заказы</h2>
      </div>
      <div className="px-5 space-y-4 mt-2">
        {orders.map((o) => (
          <div key={o.id} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">{o.service}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{o.master} · {o.id}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${o.status === 'Выполнен' ? 'bg-emerald-100 text-emerald-700' : 'bg-secondary text-primary'}`}>
                {o.status}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-4">
              {statusFlow.map((s, i) => (
                <div key={s} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`h-1.5 w-full rounded-full ${i <= o.step ? 'bg-primary' : 'bg-muted'}`} />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Icon name="Clock" size={12} />{o.time}</span>
              <span className="font-display font-bold text-sm">{o.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SupportScreen() {
  const items = [
    { icon: 'MessageCircle', title: 'Чат с поддержкой', sub: 'Ответим за 2 минуты', color: 'bg-primary' },
    { icon: 'Phone', title: 'Позвонить нам', sub: '+7 (3955) 00-00-00', color: 'bg-emerald-500' },
    { icon: 'CircleHelp', title: 'Частые вопросы', sub: 'Оплата, гарантии, отмена', color: 'bg-amber-500' },
    { icon: 'Shield', title: 'Гарантия качества', sub: 'Все мастера проверены', color: 'bg-violet-500' },
  ];
  return (
    <div className="animate-fade-in">
      <div className="px-5 pt-6 pb-2">
        <h2 className="font-display font-extrabold text-2xl">Поддержка</h2>
        <p className="text-sm text-muted-foreground mt-1">Мы на связи 24/7</p>
      </div>
      <div className="px-5 space-y-3 mt-3">
        {items.map((it) => (
          <button key={it.title} className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:border-primary transition">
            <span className={`${it.color} w-12 h-12 rounded-xl flex items-center justify-center text-white`}>
              <Icon name={it.icon} size={22} />
            </span>
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm">{it.title}</p>
              <p className="text-xs text-muted-foreground">{it.sub}</p>
            </div>
            <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
          </button>
        ))}
      </div>
      <div className="px-5 mt-5">
        <div className="bg-secondary rounded-2xl p-4 flex items-center gap-3">
          <Icon name="MapPin" size={20} className="text-primary" />
          <p className="text-xs text-secondary-foreground">г. Усть-Кут, ул. Кирова, 12 · ежедневно 8:00–22:00</p>
        </div>
      </div>
    </div>
  );
}

function MasterScreen() {
  const stats = [
    { label: 'Заказов сегодня', value: '4', icon: 'ClipboardCheck' },
    { label: 'Заработано', value: '5 400 ₽', icon: 'Wallet' },
    { label: 'Рейтинг', value: '4.9', icon: 'Star' },
  ];
  return (
    <div className="animate-fade-in">
      <div className="px-5 pt-6">
        <div className="bg-primary rounded-3xl p-5 text-primary-foreground relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-accent/30 blur-2xl" />
          <div className="flex items-center gap-3 relative">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center font-display font-bold text-lg">АП</div>
            <div>
              <p className="font-display font-bold text-lg">Алексей Петров</p>
              <p className="text-xs text-primary-foreground/80">Сантехник · онлайн</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-5 relative">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                <p className="font-display font-bold text-lg">{s.value}</p>
                <p className="text-[10px] text-primary-foreground/70 leading-tight mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 mt-5">
        <div className="flex items-center justify-between bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600"><Icon name="Power" size={20} /></span>
            <div>
              <p className="font-semibold text-sm">Приём заказов</p>
              <p className="text-xs text-muted-foreground">Вы получаете уведомления</p>
            </div>
          </div>
          <div className="w-12 h-7 rounded-full bg-emerald-500 flex items-center px-1 justify-end">
            <span className="w-5 h-5 rounded-full bg-white" />
          </div>
        </div>
      </div>

      <div className="px-5 mt-5">
        <h3 className="font-display font-bold text-base mb-3">Новые заявки</h3>
        <div className="space-y-3">
          {[
            { s: 'Течёт кран на кухне', addr: 'ул. Речников, 8', price: '900 ₽', dist: '1.1 км' },
            { s: 'Установить унитаз', addr: 'мкр. Лена, 22', price: '1 500 ₽', dist: '2.6 км' },
          ].map((r) => (
            <div key={r.s} className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">{r.s}</p>
                <span className="font-display font-bold text-sm text-primary">{r.price}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Icon name="MapPin" size={12} />{r.addr} · {r.dist}</p>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 bg-primary text-primary-foreground rounded-xl py-2 text-xs font-semibold hover:opacity-90 transition">Принять</button>
                <button className="flex-1 bg-secondary text-secondary-foreground rounded-xl py-2 text-xs font-semibold">Отклонить</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
