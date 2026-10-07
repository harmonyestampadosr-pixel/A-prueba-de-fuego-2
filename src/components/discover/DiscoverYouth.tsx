import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { 
  Search, 
  MapPin, 
  Church, 
  Flame, 
  Filter, 
  UserPlus, 
  UserCheck, 
  MessageCircle, 
  Music, 
  Mic, 
  Tent, 
  Heart,
  Sparkles
} from 'lucide-react';

export const DiscoverYouth: React.FC = () => {
  const { 
    allUsers, 
    currentUser, 
    followUser, 
    setSelectedUserId, 
    setActiveTab, 
    setActiveConversationId 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInterestFilter, setSelectedInterestFilter] = useState<string>('all');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('all');

  const presetFilters = [
    { id: 'all', label: 'Todos los jóvenes' },
    { id: 'Música', label: 'Aman la Música 🎵' },
    { id: 'Evangelismo', label: 'Hacen Evangelismo 🔥' },
    { id: 'Predicación', label: 'Predicadores 🎤' },
    { id: 'Campamentos', label: 'Campistas & JA 🏕️' },
    { id: 'Servicio', label: 'Servicio Comunitario ❤️' },
  ];

  // Exclude current user from discover list
  const otherUsers = allUsers.filter(u => u.id !== currentUser.id);

  const filteredUsers = otherUsers.filter(user => {
    // Search term matching
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = `${user.name} ${user.lastName}`.toLowerCase().includes(term);
      const matchUsername = user.username.toLowerCase().includes(term);
      const matchChurch = user.church.toLowerCase().includes(term);
      const matchCity = user.city.toLowerCase().includes(term);
      const matchDistrict = user.district.toLowerCase().includes(term);
      if (!matchName && !matchUsername && !matchChurch && !matchCity && !matchDistrict) {
        return false;
      }
    }

    // Preset interest filter
    if (selectedInterestFilter !== 'all') {
      const hasInterest = user.interests.includes(selectedInterestFilter);
      if (!hasInterest) return false;
    }

    // City filter
    if (selectedCityFilter !== 'all' && user.city !== selectedCityFilter) {
      return false;
    }

    return true;
  });

  const cities = Array.from(new Set(otherUsers.map(u => u.city))).filter(Boolean);

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4">
      
      {/* Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-amber-600/20 via-slate-900 to-slate-950 border border-amber-500/30 p-5 sm:p-6 mb-6">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="h-4 w-4" />
          <span>CONECTA Y CONFRATERNIZA</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
          Descubrir Jóvenes Adventistas & Cristianos
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
          Encuentra jóvenes de tu iglesia local, tu distrito o de otras ciudades que comparten tus mismos ministerios, pasiones misioneras y música.
        </p>

        {/* Global Search input */}
        <div className="mt-4 relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, usuario, iglesia, ciudad, distrito..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 shadow-inner"
          />
        </div>
      </div>

      {/* Preset Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-5 border-b border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {presetFilters.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedInterestFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedInterestFilter === f.id
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* City Dropdown */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <MapPin className="h-3.5 w-3.5 text-amber-400" />
          <select
            value={selectedCityFilter}
            onChange={(e) => setSelectedCityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Todas las ciudades</option>
            {cities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Youth Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredUsers.map((user) => {
          const isFollowing = currentUser.followingIds.includes(user.id);

          return (
            <div
              key={user.id}
              className="flex flex-col justify-between rounded-3xl bg-slate-900/90 border border-slate-800 p-4 hover:border-amber-500/40 transition-all shadow-md group relative overflow-hidden"
            >
              {/* Header with Avatar & Points */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="h-14 w-14 rounded-2xl object-cover ring-2 ring-amber-500/40"
                    />
                    <div className="absolute -bottom-1 -left-1 px-1.5 py-0.2 rounded-md bg-slate-950 border border-amber-400 text-[9px] font-black text-amber-300">
                      Nv.{user.level}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-xs font-black tabular-nums">
                    <Flame className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
                    <span>{user.points.toLocaleString()} pts</span>
                  </div>
                </div>

                {/* Name & Basic Info */}
                <button
                  onClick={() => {
                    setSelectedUserId(user.id);
                    setActiveTab('perfil');
                  }}
                  className="text-left block w-full focus:outline-none"
                >
                  <h3 className="text-sm font-extrabold text-white group-hover:text-amber-400 transition-colors truncate">
                    {user.name} {user.lastName}
                  </h3>
                  <p className="text-[11px] text-slate-400">@{user.username} · {user.age} años</p>
                </button>

                {/* Church & City */}
                <div className="mt-2 space-y-1 text-[11px] text-slate-300">
                  <p className="flex items-center gap-1.5 truncate">
                    <Church className="h-3 w-3 text-amber-400 shrink-0" />
                    <span className="truncate">{user.church}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-400 truncate">
                    <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                    <span className="truncate">{user.city}, {user.country} ({user.district})</span>
                  </p>
                </div>

                {/* Interests Pills */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {user.interests.slice(0, 3).map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-slate-800 text-[10px] font-semibold text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800">
                <button
                  onClick={() => followUser(user.id)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isFollowing
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                      : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-sm'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>Siguiendo</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-3.5 w-3.5" />
                      <span>Seguir</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setSelectedUserId(user.id);
                    setActiveTab('perfil');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:text-white hover:bg-slate-750"
                  title="Ver ficha de jugador"
                >
                  Ver Ficha
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
