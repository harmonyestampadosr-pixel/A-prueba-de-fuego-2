import React from 'react';
import { useApp, TabType } from '../../context/AppContext';
import { 
  Home, 
  Compass, 
  Flame, 
  Calendar, 
  User as UserIcon,
  MessageCircle
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, conversations } = useApp();

  const totalUnreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const navItems: { tab: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { tab: 'inicio', label: 'Inicio', icon: Home },
    { tab: 'descubrir', label: 'Descubrir', icon: Compass },
    { tab: 'retos', label: 'Retos', icon: Flame },
    { tab: 'eventos', label: 'Eventos', icon: Calendar },
    { tab: 'perfil', label: 'Perfil', icon: UserIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800/80 bg-slate-950/92 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2 pb-safe">
        {navItems.map((item) => {
          const isActive = activeTab === item.tab;
          const IconComponent = item.icon;

          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`relative flex min-h-[48px] min-w-[56px] flex-col items-center justify-center transition-all ${
                isActive 
                  ? 'text-amber-400 scale-105' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <IconComponent className={`h-5 w-5 transition-transform ${isActive ? 'stroke-[2.5px] fill-amber-500/20' : 'stroke-[1.8px]'}`} />
                {item.tab === 'retos' && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-1 font-medium ${isActive ? 'font-bold text-amber-400' : 'text-slate-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-1 h-0.5 w-6 rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
