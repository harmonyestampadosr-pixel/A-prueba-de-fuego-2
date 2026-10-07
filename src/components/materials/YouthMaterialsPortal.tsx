import React, { useState } from 'react';
import { OFFICIAL_YOUTH_MATERIALS, YouthMaterial } from '../../data/adventistResourcesData';
import { 
  BookOpen, 
  Download, 
  ExternalLink, 
  FileText, 
  Music, 
  Layers, 
  HelpCircle, 
  ShieldCheck, 
  Search, 
  Sparkles,
  Info
} from 'lucide-react';

export const YouthMaterialsPortal: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<YouthMaterial | null>(null);

  const filteredMaterials = OFFICIAL_YOUTH_MATERIALS.filter(mat => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = 
      !term || 
      mat.title.toLowerCase().includes(term) || 
      mat.description.toLowerCase().includes(term) ||
      mat.authorOrEntity.toLowerCase().includes(term);

    const matchesCategory = selectedCategory === 'all' || mat.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-blue-950/60 via-slate-900 to-slate-950 border border-blue-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-xs font-bold text-blue-300 mb-2">
              <BookOpen className="h-4 w-4 text-blue-400" />
              <span>REPOSITORIO OFICIAL DE RECURSOS IASD</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              Materiales Juveniles & Guías de Estudio
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              Accede a manuales oficiales del Ministerio Joven de la División Interamericana, himnarios con acordes, folletos inVerse de Escuela Sabática universitaria y paquetes de diseño para tu club.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-blue-500/30 text-center min-w-[130px] shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recursos</span>
            <span className="text-2xl font-black text-blue-400">{OFFICIAL_YOUTH_MATERIALS.length}</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Documentos Listos</span>
          </div>
        </div>
      </div>

      {/* "Cómo acceder a ellos" Guide Box */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Info className="h-4 w-4 text-amber-400" />
          <span>¿Cómo acceder a los materiales juveniles adventistas?</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="font-bold text-blue-400 block">1. Descarga Directa Digital:</span>
            <p className="text-slate-300 leading-relaxed">
              Haz clic en "Descargar / Acceder" en cada recurso para abrir el PDF o archivo comprimido oficial sin costo.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="font-bold text-emerald-400 block">2. Librerías IADPA Oficiales:</span>
            <p className="text-slate-300 leading-relaxed">
              Para versiones impresas en papel y pañuelos oficiales, acude a la librería de la Asociación Sur Occidental o Unión Colombiana.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="font-bold text-amber-400 block">3. Apps Oficiales Móviles:</span>
            <p className="text-slate-300 leading-relaxed">
              Descarga en Google Play / App Store las aplicaciones: "Himnario Adventista", "Escuela Sabática" y "EGW Writings".
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar manual, himno o estudio..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-slate-950'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedCategory('manuales_oficiales')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'manuales_oficiales'
                ? 'bg-blue-500 text-slate-950'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Manuales
          </button>
          <button
            onClick={() => setSelectedCategory('himnarios_musica')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'himnarios_musica'
                ? 'bg-blue-500 text-slate-950'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Música
          </button>
          <button
            onClick={() => setSelectedCategory('escuela_sabatica')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'escuela_sabatica'
                ? 'bg-blue-500 text-slate-950'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            inVerse
          </button>
        </div>
      </div>

      {/* Materials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMaterials.map((mat) => (
          <div
            key={mat.id}
            className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 p-5 flex flex-col justify-between space-y-4 transition-all shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase">
                  {mat.format} · {mat.size}
                </span>
                <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {mat.authorOrEntity}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1">{mat.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {mat.description}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <span className="font-bold text-slate-300 block">¿Cómo acceder a este material?</span>
                <p>{mat.howToAccess}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-medium">
                Recurso 100% Oficial IASD
              </span>

              <a
                href={mat.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs shadow-md flex items-center gap-1.5 transition-all"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Acceder al Material</span>
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
