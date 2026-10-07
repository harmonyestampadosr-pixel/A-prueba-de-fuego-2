import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, Image, BookOpen, Flame } from 'lucide-react';

interface CreateStoryModalProps {
  onClose: () => void;
}

const CATEGORIES = [
  { id: 'oracion', label: 'Oración', emoji: '🙏' },
  { id: 'versiculo', label: 'Versículo', emoji: '📖' },
  { id: 'testimonio', label: 'Testimonio', emoji: '❤️' },
  { id: 'reflexion', label: 'Reflexión', emoji: '🔥' },
  { id: 'musica', label: 'Música', emoji: '🎵' },
  { id: 'iglesia', label: 'Iglesia', emoji: '⛪' },
  { id: 'campamento', label: 'Campamento', emoji: '🏕️' },
] as const;

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ onClose }) => {
  const { createStory } = useApp();
  const [category, setCategory] = useState<typeof CATEGORIES[number]['id']>('reflexion');
  const [textContent, setTextContent] = useState('');
  const [bibleVerse, setBibleVerse] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  const sampleImages = [
    'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textContent.trim() && !mediaUrl) return;

    createStory({
      category,
      textContent: textContent.trim(),
      bibleVerse: bibleVerse.trim() || undefined,
      mediaUrl: mediaUrl || sampleImages[0],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-white">Publicar Estado Espiritual</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">
              Categoría del estado:
            </label>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                    category === c.id
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span className="mr-1">{c.emoji}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text input */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Mensaje o reflexión:
            </label>
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="¿Qué puso Dios en tu corazón hoy para compartir con la juventud?"
              rows={3}
              className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Scripture Verse */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Versículo bíblico (opcional):
            </label>
            <input
              type="text"
              value={bibleVerse}
              onChange={(e) => setBibleVerse(e.target.value)}
              placeholder="Ej: Jeremías 29:11 o Salmos 46:1"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Quick Background Image Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">
              Seleccionar fondo visual:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {sampleImages.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setMediaUrl(img)}
                  className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    mediaUrl === img ? 'border-amber-400 scale-95 shadow-md shadow-amber-500/20' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!textContent.trim() && !mediaUrl}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 text-xs font-extrabold shadow-md hover:from-amber-400 hover:to-orange-500 transition-all disabled:opacity-50"
            >
              Publicar Estado (24h)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
