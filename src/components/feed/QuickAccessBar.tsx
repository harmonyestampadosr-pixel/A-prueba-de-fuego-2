import React from 'react';
import { useApp, TabType } from '../../context/AppContext';
import { 
  MessageCircle, 
  HeartHandshake, 
  Gamepad2, 
  Tv, 
  Trophy, 
  Church as ChurchIcon,
  ShieldCheck,
  Building2,
  Film,
  Lightbulb,
  BookOpen,
  MapPin
} from 'lucide-react';

export const QuickAccessBar: React.FC = () => {
  const { setActiveTab, currentUser, conversations } = useApp();
  const unreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const shortcuts: { tab: TabType; title: string; subtitle: string; icon: React.FC<{ className?: string }>; color: string; badge?: number }[] = [
    { 
      tab: 'eventos', 
      title: 'Buenaventura', 
      subtitle: 'Radar de Eventos', 
      icon: MapPin, 
      color: 'from-amber-500 to-orange-600' 
    },
    { 
      tab: 'cine', 
      title: 'Cine Cristiano', 
      subtitle: 'Películas Adventistas', 
      icon: Film, 
      color: 'from-rose-600 to-red-600' 
    },
    { 
      tab: 'actividades', 
      title: 'Ideas JA', 
      subtitle: 'Dinámicas & Fondos', 
      icon: Lightbulb, 
      color: 'from-amber-600 to-yellow-600' 
    },
    { 
      tab: 'materiales', 
      title: 'Materiales', 
      subtitle: 'Himnarios & Guías', 
      icon: BookOpen, 
      color: 'from-blue-600 to-cyan-600' 
    },
    { 
      tab: 'chat', 
      title: 'Chat JA', 
      subtitle: 'Grupos y Directos', 
      icon: MessageCircle, 
      color: 'from-cyan-600 to-blue-600',
      badge: unreadMessages > 0 ? unreadMessages : undefined 
    },
    { 
      tab: 'oracion', 
      title: 'Oración', 
      subtitle: 'Muro de Clamor', 
      icon: HeartHandshake, 
      color: 'from-purple-600 to-pink-600' 
    },
    { 
      tab: 'juegos', 
      title: 'Juegos', 
      subtitle: 'Trivia & Puntos', 
      icon: Gamepad2, 
      color: 'from-orange-500 to-amber-600' 
    },
    { 
      tab: 'ranking', 
      title: 'Ranking', 
      subtitle: 'Top Jóvenes', 
      icon: Trophy, 
      color: 'from-yellow-500 to-amber-600' 
    },
    { 
      tab: 'canales', 
      title: 'Canales', 
      subtitle: 'Música & Estudio', 
      icon: Tv, 
      color: 'from-red-600 to-rose-600' 
    },
    { 
      tab: 'oficial', 
      title: 'Oficial IASD', 
      subtitle: 'Fuentes & Noticias', 
      icon: ChurchIcon, 
      color: 'from-emerald-600 to-teal-600' 
    },
    { 
      tab: 'iglesias', 
      title: 'Directorio', 
      subtitle: 'Iglesias Locales', 
      icon: Building2, 
      color: 'from-indigo-600 to-purple-600' 
    },
  ];

  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Comunidad & Herramientas
        </span>
        <span className="text-[11px] text-amber-500 font-medium">
          Acceso rápido
        </span>
      </div>

      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {shortcuts.map((sc) => {
          const Icon = sc.icon;
          return (
            <button
              key={sc.tab}
              onClick={() => setActiveTab(sc.tab)}
              className="group relative flex min-w-[105px] flex-col items-center rounded-2xl bg-slate-900/80 p-2.5 text-center border border-slate-800 hover:border-slate-700 hover:bg-slate-850 transition-all shrink-0 active:scale-95"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${sc.color} text-white shadow-sm mb-1.5 group-hover:scale-105 transition-transform`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-slate-100 group-hover:text-amber-400 transition-colors truncate max-w-full">
                {sc.title}
              </span>
              <span className="text-[10px] text-slate-400 truncate max-w-full">
                {sc.subtitle}
              </span>

              {sc.badge && (
                <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">
                  {sc.badge}
                </span>
              )}
            </button>
          );
        })}

        {(currentUser.role === 'superadmin' || currentUser.role === 'admin') && (
          <button
            onClick={() => setActiveTab('admin')}
            className="group relative flex min-w-[105px] flex-col items-center rounded-2xl bg-amber-500/10 p-2.5 text-center border border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/20 transition-all shrink-0 active:scale-95"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-red-600 text-white shadow-sm mb-1.5">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-amber-300 truncate max-w-full">
              Admin
            </span>
            <span className="text-[10px] text-amber-400/80 truncate max-w-full">
              Panel Control
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
