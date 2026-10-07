import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  MapPin, 
  Users, 
  Calendar, 
  ExternalLink, 
  Search, 
  UserCheck, 
  Flame 
} from 'lucide-react';

export const ChurchesView: React.FC = () => {
  const { churches } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChurches = churches.filter(ch => {
    const term = searchTerm.toLowerCase();
    return ch.name.toLowerCase().includes(term) ||
           ch.city.toLowerCase().includes(term) ||
           ch.district.toLowerCase().includes(term) ||
           ch.pastor.toLowerCase().includes(term);
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4">
      
      {/* Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/30 p-5 sm:p-6 mb-6">
        <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Building2 className="h-4 w-4" />
          <span>DIRECTORIO ECLESIAL</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
          Directorio de Iglesias Adventistas Locales
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
          Encuentra tu congregación local, los líderes juveniles de tu distrito y las actividades JA programadas para cada sábado.
        </p>

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por iglesia, pastor, ciudad o distrito..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Churches Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredChurches.map((church) => (
          <div
            key={church.id}
            className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 hover:border-blue-500/40 transition-all shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                  {church.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold shrink-0">
                  {church.district}
                </span>
              </div>

              <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-3">
                <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>{church.address}, {church.city}, {church.country}</span>
              </p>

              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/80 border border-slate-850 text-xs mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Pastor Distrital:</span>
                  <span className="text-white font-medium">{church.pastor}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Líder Juvenil JA:</span>
                  <span className="text-amber-400 font-semibold">{church.youthLeader}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
              <span className="flex items-center gap-1 font-semibold text-slate-300">
                <Users className="h-3.5 w-3.5 text-amber-400" />
                <span>{church.youthCount} jóvenes registrados</span>
              </span>

              {church.websiteUrl && (
                <a
                  href={church.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Portal</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
