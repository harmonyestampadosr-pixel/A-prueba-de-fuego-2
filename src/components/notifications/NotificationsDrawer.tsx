import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Flame, 
  Heart, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  MessageCircle
} from 'lucide-react';

interface NotificationsDrawerProps {
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ onClose }) => {
  const { notifications, markAllNotificationsRead } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'challenge_approved':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case 'reaction':
        return <Heart className="h-4 w-4 text-rose-400" />;
      case 'prayer':
        return <span className="text-sm">🙏</span>;
      case 'event':
        return <Calendar className="h-4 w-4 text-amber-400" />;
      case 'badge_earned':
        return <Sparkles className="h-4 w-4 text-yellow-400" />;
      default:
        return <Flame className="h-4 w-4 text-orange-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-400" />
            <h2 className="text-sm font-bold text-white font-heading">Notificaciones</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-[11px] text-amber-400 hover:underline font-semibold"
            >
              Marcar leídas
            </button>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No tienes notificaciones en este momento.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-2xl mb-1.5 transition-colors ${
                  notif.read ? 'bg-slate-900/40 opacity-70' : 'bg-slate-950 border border-slate-800'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-xs font-bold text-white truncate">{notif.title}</h3>
                      <span className="text-[10px] text-slate-400 shrink-0">{notif.createdAt}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{notif.message}</p>
                    {notif.pointsAwarded && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/30">
                        +{notif.pointsAwarded} PUNTOS ACREDITADOS
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
