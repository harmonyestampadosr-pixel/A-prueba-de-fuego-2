import React, { useState } from 'react';
import { INITIAL_CHANNELS } from '../../data/seedData';
import { Tv, Play, CheckCircle2, Clock, Eye, ExternalLink } from 'lucide-react';

export const ChannelsView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const channels = INITIAL_CHANNELS;

  const filtered = channels.filter(c => {
    if (selectedCategory === 'all') return true;
    return c.category === selectedCategory;
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4">
      
      {/* Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-red-950/40 via-slate-900 to-slate-950 border border-red-500/30 p-5 sm:p-6 mb-6">
        <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Tv className="h-4 w-4" />
          <span>CONTENIDO AUDIOVISUAL DE EDIFICACIÓN</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
          Canales Cristianos & Devocionales
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
          Música sacra contemporánea, devocionales matutinos, lecciones de Escuela Sabática universitaria y conferencias juveniles de edificación.
        </p>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-5 border-b border-slate-800">
        {[
          { id: 'all', label: 'Todos los Canales' },
          { id: 'estudios_biblicos', label: 'Escuela Sabática (InVerse)' },
          { id: 'musica', label: 'Música & Alabanza JA' },
          { id: 'predicaciones', label: 'Predicaciones Juveniles' },
          { id: 'devocionales', label: 'Devocionales Matutinos' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Video Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden hover:border-red-500/40 transition-all shadow-md group"
          >
            {/* Thumbnail */}
            <div className="relative h-44 sm:h-48 w-full bg-slate-950">
              <img
                src={item.thumbnail}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <button
                  onClick={() => alert(`Reproduciendo: "${item.title}". Conectado con la señal oficial.`)}
                  className="h-12 w-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform active:scale-95"
                >
                  <Play className="h-5 w-5 fill-white ml-0.5" />
                </button>
              </div>

              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-white text-[10px] font-bold">
                {item.duration}
              </div>
            </div>

            {/* Metadata */}
            <div className="p-4">
              <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-semibold mb-1">
                <span>{item.creator}</span>
                {item.verifiedOfficial && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                )}
              </div>

              <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                {item.title}
              </h3>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5 text-slate-500" />
                  <span>{item.views} reproducciones</span>
                </span>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-amber-400 hover:underline font-bold"
                >
                  <span>Canal</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
