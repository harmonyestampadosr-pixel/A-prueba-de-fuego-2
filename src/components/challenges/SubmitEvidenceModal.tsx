import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Challenge } from '../../types';
import { X, Flame, Camera, MapPin, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

interface SubmitEvidenceModalProps {
  challenge: Challenge;
  onClose: () => void;
}

export const SubmitEvidenceModal: React.FC<SubmitEvidenceModalProps> = ({ challenge, onClose }) => {
  const { currentUser, submitChallengeEvidence } = useApp();
  
  const [reflection, setReflection] = useState('');
  const [approximateLocation, setApproximateLocation] = useState(currentUser.city || 'Bogotá, Colombia');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [mediaUrl, setMediaUrl] = useState(challenge.imageUrl || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80');

  const sampleEvidencePhotos = [
    'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&auto=format&fit=crop&q=80',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflection.trim()) return;

    submitChallengeEvidence({
      challengeId: challenge.id,
      challengeTitle: challenge.title,
      challengePoints: challenge.points,
      userId: currentUser.id,
      userName: `${currentUser.name} ${currentUser.lastName}`.trim(),
      userUsername: currentUser.username,
      userAvatar: currentUser.avatar,
      userChurch: currentUser.church,
      date,
      approximateLocation: approximateLocation.trim(),
      commentReflection: reflection.trim(),
      mediaType,
      mediaUrl,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-5 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
              Certificación de Reto
            </span>
            <h2 className="text-base font-bold text-white">Subir Evidencia de Cumplimiento</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Challenge Summary Banner */}
        <div className="mt-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{challenge.icon}</span>
            <div>
              <p className="text-xs font-bold text-white leading-tight">{challenge.title}</p>
              <p className="text-[10px] text-amber-300">Recompensa: +{challenge.points} puntos tras revisión</p>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-black">
            +{challenge.points} pts
          </div>
        </div>

        {/* Required Evidence Note */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-white">Evidencia requerida:</strong> {challenge.requiredEvidence}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          
          {/* Reflection */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Comentario y reflexión de la experiencia:
            </label>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Describe cómo realizaste el reto, qué impactó tu vida o a quiénes pudiste bendecir en el nombre de Dios..."
              rows={3}
              className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
              required
            />
          </div>

          {/* Location & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-amber-400" />
                <span>Lugar aproximado:</span>
              </label>
              <input
                type="text"
                value={approximateLocation}
                onChange={(e) => setApproximateLocation(e.target.value)}
                placeholder="Ej: Barrio Norte, Cali"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-amber-400" />
                <span>Fecha de realización:</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          {/* Media Evidence Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
              <Camera className="h-3.5 w-3.5 text-amber-400" />
              <span>Fotografía o evidencia gráfica:</span>
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {sampleEvidencePhotos.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setMediaUrl(img)}
                  className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    mediaUrl === img ? 'border-amber-400 scale-95 shadow-md shadow-amber-500/30' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Evidence option" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <input
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="O escribe la URL de tu foto/video"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Anti-cheat disclaimer */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300/90 leading-relaxed">
            🛡️ <strong>Seguridad y revisión:</strong> Tu evidencia quedará en estado <em>"Pendiente de revisión"</em>. El equipo moderador revisará la autenticidad antes de acreditar los <strong>+{challenge.points} puntos</strong>. Los puntos no se asignan automáticamente.
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!reflection.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 text-xs font-black shadow-md hover:from-amber-400 hover:to-orange-500 transition-all disabled:opacity-50"
            >
              Enviar a Revisión (+{challenge.points} pts)
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
