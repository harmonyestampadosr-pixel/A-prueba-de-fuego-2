import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Flame, 
  Bell, 
  Sun, 
  Moon, 
  ShieldCheck, 
  UserCheck, 
  Search,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNotifications, onOpenSearch, onOpenAuthModal }) => {
  const { 
    currentUser, 
    allUsers, 
    loginAs, 
    setActiveTab, 
    notifications,
    isDarkMode,
    setIsDarkMode
  } = useApp();

  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md transition-colors dark:border-slate-800/80 dark:bg-slate-950/90">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-3 sm:px-6">
        
        {/* Zone 1: Brand & Logo */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('inicio')}
            className="flex items-center gap-2 text-left group transition-transform active:scale-95"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 shadow-md shadow-orange-500/20">
              <Flame className="h-5 w-5 text-white animate-pulse" />
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white group-hover:text-amber-400 transition-colors font-heading block leading-tight">
                A PRUEBA DE FUEGO
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-500 block leading-none">
                Juventud Cristiana & JA
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Search Trigger on Desktop / Quick Bar */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 w-64 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all"
          >
            <Search className="h-3.5 w-3.5 text-amber-500" />
            <span>Buscar jóvenes, iglesias, retos...</span>
            <kbd className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Ctrl+K</kbd>
          </button>
        </div>

        {/* Zone 3: Points Pill, Notifications, Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          
          {/* Points Pill (Soccer Player Rating Style) */}
          <button
            onClick={() => setActiveTab('ranking')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border border-amber-500/30 text-amber-300 hover:border-amber-400 transition-all group"
            title="Ver ranking y puntos"
          >
            <Flame className="h-4 w-4 text-orange-400 group-hover:scale-110 transition-transform fill-orange-400" />
            <span className="text-xs font-black tracking-tight tabular-nums text-white">
              {currentUser.points.toLocaleString()}
            </span>
            <span className="text-[10px] font-medium text-amber-400/90 hidden xs:inline">
              pts
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-200 font-bold uppercase tracking-wider ml-0.5 hidden sm:inline">
              Nv.{currentUser.level}
            </span>
          </button>

          {/* Search Trigger for Mobile */}
          <button
            onClick={onOpenSearch}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
            title="Buscar"
          >
            <Search className="h-4 w-4 text-slate-300" />
          </button>

          {/* Admin Panel Quick Access Button */}
          {(currentUser.role === 'superadmin' || currentUser.role === 'admin' || currentUser.email === 'harmonyestampadosr@gmail.com') && (
            <button
              onClick={() => setActiveTab('admin')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/25 hover:from-amber-400 hover:to-orange-400 transition-all group"
              title="Ir al Panel de Administración y Supervisión"
            >
              <ShieldCheck className="h-4 w-4 fill-slate-950" />
              <span className="hidden sm:inline">Panel Admin</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
            title="Cambiar tema"
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-400" />}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
            title="Notificaciones"
          >
            <Bell className="h-4 w-4" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white ring-2 ring-slate-950">
                {unreadNotifs}
              </span>
            )}
          </button>

          {/* Account & Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAccountMenu(!showAccountMenu)}
              className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700"
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="h-7 w-7 rounded-lg object-cover ring-1 ring-amber-500/50"
                />
                {currentUser.isOfficialVerified && (
                  <div className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-[8px] text-slate-950 font-bold">
                    ✓
                  </div>
                )}
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {showAccountMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-white truncate">{currentUser.name} {currentUser.lastName}</p>
                    {currentUser.isOfficialVerified && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        OFICIAL
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">@{currentUser.username}</p>
                  <p className="text-[10px] text-amber-400 font-semibold mt-1">
                    Nivel {currentUser.level} — {currentUser.levelName} ({currentUser.points} pts)
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowAccountMenu(false);
                      onOpenAuthModal();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 font-bold flex items-center justify-between mb-1"
                  >
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Iniciar Sesión / Registro Firebase</span>
                    </span>
                    <span className="text-[10px] text-amber-300">Auth</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('perfil');
                      setShowAccountMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center justify-between"
                  >
                    <span>Ver mi ficha de jugador</span>
                    <span className="text-[10px] text-amber-400">Perfil</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('juegos');
                      setShowAccountMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-amber-300 hover:bg-amber-500/10 flex items-center justify-between"
                  >
                    <span>🎮 Juegos Bíblicos & Trivia</span>
                    <span className="text-[10px] text-amber-400">Puntos</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('cine');
                      setShowAccountMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-rose-300 hover:bg-rose-500/10 flex items-center justify-between"
                  >
                    <span>🎬 Cine & Películas Cristianas</span>
                    <span className="text-[10px] text-rose-400">Portal</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('actividades');
                      setShowAccountMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-amber-300 hover:bg-amber-500/10 flex items-center justify-between"
                  >
                    <span>💡 Ideas JA & Fondos</span>
                    <span className="text-[10px] text-amber-400">Guías</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('materiales');
                      setShowAccountMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-blue-300 hover:bg-blue-500/10 flex items-center justify-between"
                  >
                    <span>📚 Materiales Oficiales</span>
                    <span className="text-[10px] text-blue-400">PDFs</span>
                  </button>

                  {(currentUser.role === 'superadmin' || currentUser.role === 'admin') && (
                    <button
                      onClick={() => {
                        setActiveTab('admin');
                        setShowAccountMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-amber-400 hover:bg-amber-500/10 flex items-center gap-2 font-semibold"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Panel Administrativo</span>
                    </button>
                  )}
                </div>

                {/* Quick Account Switcher for Demo testing */}
                <div className="border-t border-slate-800/80 pt-2 mt-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                    Cambiar usuario de prueba:
                  </p>
                  {allUsers.slice(0, 4).map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        loginAs(u.id);
                        setShowAccountMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        u.id === currentUser.id 
                          ? 'bg-amber-500/20 text-amber-300 font-semibold' 
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate flex items-center gap-1.5">
                        {u.role === 'superadmin' ? '🔥 Admin Oficial' : `${u.name} ${u.lastName}`}
                      </span>
                      <span className="text-[10px] text-slate-400 tabular-nums">
                        {u.points} pts
                      </span>
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      setActiveTab('onboarding');
                      setShowAccountMenu(false);
                    }}
                    className="w-full mt-1.5 text-center px-3 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-bold shadow-md hover:from-amber-500 hover:to-orange-500 flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Crear nuevo perfil (00 pts)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
