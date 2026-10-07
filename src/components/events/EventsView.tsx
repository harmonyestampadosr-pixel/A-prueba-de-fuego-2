import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EventItem } from '../../types';
import { BUENAVENTURA_CHURCHES } from '../../data/adventistResourcesData';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  Users, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Bookmark, 
  Share2, 
  Filter,
  Search,
  Church,
  ShieldCheck,
  Flame,
  Radio,
  Globe
} from 'lucide-react';

export const EventsView: React.FC = () => {
  const { events, toggleEventParticipation } = useApp();
  const [filterRegion, setFilterRegion] = useState<'buenaventura' | 'colombia' | 'mundial' | 'all'>('buenaventura');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Enriquecer eventos con los de Buenaventura
  const buenaventuraEvents: EventItem[] = [
    {
      id: 'ev_buenaventura_caleb_2026',
      title: 'Misión Caleb Pacífico 2026: "Esperanza en el Puerto"',
      description: 'Gran jornada juvenil de servicio en Buenaventura: Limpieza ecológica de playas en La Bocana y Juanchaco, brigadas de salud gratuitas en sectores de bajamar y carpas de esperanza en el Malecón Bahía de la Cruz.',
      category: 'mision_caleb',
      date: '15 al 25 de Octubre, 2026',
      time: '08:00 AM',
      city: 'Buenaventura, Valle del Cauca',
      country: 'Colombia',
      venue: 'Malecón Bahía de la Cruz & Barrio Cascajal',
      organizer: 'Asociación Sur Occidental & Distritos de Buenaventura',
      isOfficialSource: true,
      officialOrganization: 'Iglesia Adventista del Séptimo Día — Asociación Sur Occidental',
      officialSourceUrl: 'https://interamerica.org',
      interestedCount: 640,
      attendingCount: 380,
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&auto=format&fit=crop&q=80',
      scope: 'ciudad',
      isAttending: true,
      isInterested: true,
    },
    {
      id: 'ev_vigilia_buenaventura',
      title: 'Vigilia Zonal de Oración JA: "Fuego en las Aguas"',
      description: 'Noche de clamor espiritual, testimonios de milagros y alabanza unida entre todos los clubes de jóvenes adventistas del puerto de Buenaventura.',
      category: 'ja_especial',
      date: '31 de Octubre, 2026',
      time: '08:00 PM a 04:00 AM',
      city: 'Buenaventura, Valle del Cauca',
      country: 'Colombia',
      venue: 'Templo Adventista Central (Calle 1ª # 4-22, Centro)',
      organizer: 'Pastores y Líderes JA de Buenaventura',
      isOfficialSource: true,
      officialOrganization: 'Distrito Central Buenaventura',
      officialSourceUrl: 'https://adventistas.org',
      interestedCount: 420,
      attendingCount: 290,
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&auto=format&fit=crop&q=80',
      scope: 'ciudad',
      isAttending: false,
      isInterested: true,
    },
    {
      id: 'ev_campamento_sancipriano',
      title: 'Campamento de Liderazgo & Conquistadores San Cipriano',
      description: 'Retiro en la Reserva Natural de San Cipriano. Especialidades de naturaleza, nudos, primeros auxilios, supervivencia en selva tropical y fogata de consagración.',
      category: 'campamento',
      date: '13 al 16 de Noviembre, 2026',
      time: '06:30 AM',
      city: 'Buenaventura (Reserva San Cipriano)',
      country: 'Colombia',
      venue: 'Campamento Adventista San Cipriano',
      organizer: 'Clubes de Conquistadores y Guías Mayores del Pacífico',
      isOfficialSource: true,
      officialOrganization: 'Ministerio de Conquistadores IASD',
      officialSourceUrl: 'https://unioncolombiana.org.co',
      interestedCount: 510,
      attendingCount: 310,
      imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1000&auto=format&fit=crop&q=80',
      scope: 'ciudad',
      isAttending: false,
      isInterested: true,
    }
  ];

  // Merge all events
  const allEventsList = [...buenaventuraEvents, ...events.filter(e => !buenaventuraEvents.some(b => b.id === e.id))];

  const filteredEvents = allEventsList.filter((ev) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = 
      !term || 
      ev.title.toLowerCase().includes(term) ||
      ev.city.toLowerCase().includes(term) ||
      ev.organizer.toLowerCase().includes(term) ||
      ev.description.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    if (filterCategory !== 'all' && ev.category !== filterCategory) return false;

    if (filterRegion === 'buenaventura') {
      return ev.city.toLowerCase().includes('buenaventura') || ev.venue.toLowerCase().includes('buenaventura');
    }
    if (filterRegion === 'colombia') {
      return ev.country.toLowerCase().includes('colombia');
    }
    if (filterRegion === 'mundial') {
      return ev.scope === 'internacional' || ev.scope === 'nacional';
    }

    return true;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-xs font-bold text-indigo-300 mb-2">
              <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span>RADAR DE EVENTOS JUVENILES & NOTICIAS IASD</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              Calendario de Eventos Adventistas
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              Actualizado continuamente con actividades de la juventud adventista, con prioridad en Buenaventura (Valle del Cauca), Colombia y la División Interamericana.
            </p>
          </div>

          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-slate-900 border border-indigo-500/30 text-center">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Buenaventura</span>
              <span className="text-xl font-black text-amber-400">{buenaventuraEvents.length} Activos</span>
            </div>
            <div className="border-l border-slate-800 pl-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Red</span>
              <span className="text-xl font-black text-indigo-400">{allEventsList.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Region Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilterRegion('buenaventura')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${
            filterRegion === 'buenaventura'
              ? 'bg-amber-500 text-slate-950 shadow-lg'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <MapPin className="h-4 w-4 text-amber-900" />
          <span>📍 Buenaventura (Prioridad)</span>
        </button>

        <button
          onClick={() => setFilterRegion('colombia')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${
            filterRegion === 'colombia'
              ? 'bg-amber-500 text-slate-950 shadow-lg'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <span>🇨🇴 Colombia (Uniones)</span>
        </button>

        <button
          onClick={() => setFilterRegion('mundial')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${
            filterRegion === 'mundial'
              ? 'bg-amber-500 text-slate-950 shadow-lg'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>🌎 División & Mundial</span>
        </button>

        <button
          onClick={() => setFilterRegion('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            filterRegion === 'all'
              ? 'bg-amber-500 text-slate-950'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Todos ({allEventsList.length})
        </button>
      </div>

      {/* BUENAVENTURA CHURCHES RADAR (Show when Buenaventura filter is active) */}
      {filterRegion === 'buenaventura' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Church className="h-5 w-5 text-amber-400" />
              <span>Iglesias de Buenaventura y Proyectos en Marcha</span>
            </h2>
            <span className="text-xs text-amber-400 font-bold">
              {BUENAVENTURA_CHURCHES.length} Congregaciones Activas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {BUENAVENTURA_CHURCHES.map((ch, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all space-y-2.5 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      {ch.district}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-bold">
                      {ch.youthMembers} jóvenes JA
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-tight">
                    {ch.churchName}
                  </h3>

                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                    <span className="truncate">{ch.address}</span>
                  </p>

                  <div className="mt-2.5 p-2.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 block uppercase">
                      Proyectos y Actividades Actuales:
                    </span>
                    <ul className="text-[11px] text-slate-300 space-y-1">
                      {ch.activeProjects.map((p, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-emerald-400">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Líder JA: {ch.youthLeader}</span>
                  <span className="font-semibold text-amber-300">{ch.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar eventos por nombre, ciudad, organizador o camporee..."
          className="w-full rounded-2xl bg-slate-900 border border-slate-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Events List Cards */}
      <div className="space-y-4">
        {filteredEvents.map((ev) => (
          <div 
            key={ev.id}
            className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all overflow-hidden flex flex-col md:flex-row gap-4 p-5 shadow-lg"
          >
            {/* Event Image */}
            <div className="w-full md:w-64 h-48 md:h-auto rounded-2xl overflow-hidden bg-slate-950 relative shrink-0">
              <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover" />
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 uppercase">
                  {ev.category.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Event Info */}
            <div className="flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1 text-xs text-amber-400 font-bold flex-wrap">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {ev.date}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {ev.time}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <MapPin className="h-3.5 w-3.5" />
                    {ev.city}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-white hover:text-amber-400 transition-colors">
                  {ev.title}
                </h3>

                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-3">
                  {ev.description}
                </p>

                <div className="mt-2 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Lugar:</span> {ev.venue}
                </div>
              </div>

              {/* Action row */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Users className="h-3.5 w-3.5" />
                  <span>{ev.attendingCount} van a asistir</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleEventParticipation(ev.id, 'attend')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      ev.isAttending
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-amber-500 text-slate-950 font-black hover:bg-amber-400'
                    }`}
                  >
                    {ev.isAttending ? '✓ Asistiré' : '¡Me Apunto!'}
                  </button>

                  {ev.officialSourceUrl && (
                    <a
                      href={ev.officialSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                      title="Ver Fuente Oficial"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
