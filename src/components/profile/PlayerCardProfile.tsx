import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PostCard } from '../feed/PostCard';
import { calculateLevel, LEVEL_TIERS } from '../../data/seedData';
import { 
  Flame, 
  Trophy, 
  Medal, 
  MapPin, 
  Church, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Share2, 
  Edit3, 
  HeartHandshake, 
  BookOpen, 
  Zap,
  CheckCircle2,
  Lock,
  Eye
} from 'lucide-react';

interface PlayerCardProfileProps {
  userId?: string | null;
}

export const PlayerCardProfile: React.FC<PlayerCardProfileProps> = ({ userId }) => {
  const { currentUser, allUsers, posts, updateUserProfile } = useApp();
  
  // Show selected user or current user
  const user = userId ? (allUsers.find(u => u.id === userId) || currentUser) : currentUser;
  const isSelf = user.id === currentUser.id;

  const [activeTab, setActiveTab] = useState<'card' | 'posts' | 'badges' | 'settings'>('card');
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState(user.bio);
  const [editChurch, setEditChurch] = useState(user.church);

  const userPosts = posts.filter(p => p.authorId === user.id);
  const levelInfo = calculateLevel(user.points);

  // Calculate next tier progress percentage
  const currentTier = LEVEL_TIERS.find(t => t.level === user.level) || LEVEL_TIERS[0];
  const nextTier = LEVEL_TIERS.find(t => t.level === user.level + 1);
  const pointsInCurrentTier = user.points - currentTier.minPoints;
  const tierRange = (nextTier?.minPoints || currentTier.maxPoints) - currentTier.minPoints;
  const progressPercent = Math.min(100, Math.max(0, Math.round((pointsInCurrentTier / tierRange) * 100)));

  const handleSaveProfile = () => {
    updateUserProfile({
      bio: editBio,
      church: editChurch,
    });
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-6 py-4">
      
      {/* Navigation tabs within profile */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 mb-5">
        <button
          onClick={() => setActiveTab('card')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'card' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Ficha de Jugador
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'posts' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Publicaciones ({userPosts.length})
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'badges' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Insignias ({user.badges.length})
        </button>
        {isSelf && (
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'settings' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Configuración
          </button>
        )}
      </div>

      {/* TAB 1: PLAYER CARD (ESTÉTICA DE FICHA DEPORTIVA) */}
      {activeTab === 'card' && (
        <div className="space-y-4">
          
          {/* Main Soccer Player Card Container */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/40 shadow-2xl p-5 sm:p-7 fire-glow">
            
            {/* Card Background Watermark & Decorative Flames */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Rating Lockup: Soccer Player Style Card */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 pb-6 border-b border-slate-800">
              
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                {/* Avatar with Level Rating Badge */}
                <div className="relative">
                  <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-3xl p-1 bg-gradient-to-tr from-amber-400 via-orange-500 to-red-600 shadow-xl">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full rounded-[22px] object-cover"
                    />
                  </div>

                  {/* Level Rating Pin */}
                  <div className="absolute -top-2 -left-2 flex flex-col items-center justify-center h-10 w-10 rounded-xl bg-slate-950 border-2 border-amber-400 shadow-md">
                    <span className="text-[9px] font-bold text-slate-400 leading-none">NV</span>
                    <span className="text-sm font-black text-amber-400 leading-none tabular-nums">{user.level}</span>
                  </div>

                  {user.isOfficialVerified && (
                    <div className="absolute -bottom-2 -right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black shadow-md ring-2 ring-slate-950">
                      <span>✓ OFICIAL</span>
                    </div>
                  )}
                </div>

                {/* Name, Username, Church */}
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
                      {user.name} {user.lastName}
                    </h1>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-amber-300 font-semibold">
                      {user.isAdventist ? 'Adventista del 7° Día' : 'Cristiano'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-0.5">
                    @{user.username} · {user.age} años · {user.maritalStatus === 'casado' ? '💍 Casado/a' : '🌱 Soltero/a'}
                  </p>

                  <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-300 mt-2 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Church className="h-3.5 w-3.5 text-amber-400" />
                      <strong>{user.church}</strong>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-amber-400" />
                      <span>{user.city}, {user.country}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1">
                    {user.district} · {user.zone} · {user.yearsServing} años sirviendo
                  </p>
                </div>
              </div>

              {/* GIANT SOCCER PLAYER POINT RATING BADGE */}
              <div className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-amber-500/25 via-orange-600/20 to-slate-950 border-2 border-amber-400 shadow-xl min-w-[140px] text-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                  PUNTUACIÓN GLOBAL
                </span>
                <div className="flex items-center gap-1.5 text-3xl font-black text-white tabular-nums my-0.5 font-heading">
                  <Flame className="h-7 w-7 text-orange-500 fill-orange-500 animate-pulse" />
                  <span>{user.points.toLocaleString()}</span>
                </div>
                <span className="text-xs font-extrabold text-amber-300">
                  {user.levelName}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Nivel {user.level} de 10
                </span>
              </div>

            </div>

            {/* Level Progress Bar to Next Level */}
            <div className="mt-5 pb-5 border-b border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-300">
                  Progreso al Nivel {user.level < 10 ? user.level + 1 : 10}
                </span>
                <span className="text-amber-400 font-extrabold tabular-nums">
                  {user.points.toLocaleString()} / {nextTier ? nextTier.minPoints.toLocaleString() : '8,000+'} pts ({progressPercent}%)
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Player Stats Grid (4-pillar metrics) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Retos Cumplidos</span>
                <span className="text-xl font-black text-white tabular-nums">{user.stats.challengesCompleted}</span>
                <span className="text-[10px] text-emerald-400 block font-semibold">Verificados</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Eventos JA</span>
                <span className="text-xl font-black text-white tabular-nums">{user.stats.eventsAttended}</span>
                <span className="text-[10px] text-amber-400 block font-semibold">Asistidos</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Misiones Caleb</span>
                <span className="text-xl font-black text-white tabular-nums">{user.stats.missionsDone}</span>
                <span className="text-[10px] text-orange-400 block font-semibold">En servicio</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Insignias</span>
                <span className="text-xl font-black text-white tabular-nums">{user.badges.length}</span>
                <span className="text-[10px] text-purple-400 block font-semibold">Desbloqueadas</span>
              </div>
            </div>

            {/* Streaks (Rachas espirituales) */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-5 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">🙏 Racha Oración</span>
                <strong className="text-amber-300 font-extrabold">{user.stats.prayerStreak} días</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">📖 Racha Lectura</span>
                <strong className="text-amber-300 font-extrabold">{user.stats.bibleReadingStreak} días</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">🔥 Racha Activa</span>
                <strong className="text-amber-300 font-extrabold">{user.stats.activeStreakDays} días</strong>
              </div>
            </div>

            {/* Biography */}
            <div className="mb-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Biografía y Testimonio
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic bg-slate-950/60 p-3.5 rounded-2xl border border-slate-850">
                "{user.bio}"
              </p>
            </div>

            {/* Ministries & Activities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Ministerios donde sirve:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {user.ministries.map((m, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Actividades en la iglesia:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {user.activities.map((a, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 capitalize"
                    >
                      {a.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Interests Tags */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Intereses seleccionados:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {user.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs font-bold text-amber-300"
                  >
                    #{interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Edit Profile CTA if viewing self */}
            {isSelf && (
              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Edit3 className="h-3.5 w-3.5 text-amber-400" />
                  <span>{isEditing ? 'Cerrar edición' : 'Editar Ficha'}</span>
                </button>
              </div>
            )}

            {/* Inline Profile Editor */}
            {isEditing && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Editar Datos Públicos</h3>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Biografía:</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={2}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Iglesia local:</label>
                  <input
                    type="text"
                    value={editChurch}
                    onChange={(e) => setEditChurch(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-extrabold"
                >
                  Guardar Cambios
                </button>
              </div>
            )}

          </div>

        </div>
      )}

      {/* TAB 2: POSTS */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {userPosts.length === 0 ? (
            <div className="text-center py-12 rounded-3xl bg-slate-900 border border-slate-800 p-6">
              <p className="text-sm font-bold text-white">No hay publicaciones de este usuario todavía.</p>
            </div>
          ) : (
            userPosts.map(post => <PostCard key={post.id} post={post} />)
          )}
        </div>
      )}

      {/* TAB 3: BADGES */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {user.badges.map(b => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3.5 shadow-sm"
            >
              <span className="text-3xl p-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 shrink-0">
                {b.icon}
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">{b.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{b.description}</p>
                <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block mt-1">
                  Categoría: {b.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: SETTINGS & PRIVACY (Section 44) */}
      {activeTab === 'settings' && isSelf && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-2">
            Configuración y Privacidad Juvenil
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-850">
              <div>
                <p className="text-xs font-bold text-white">Perfil Público</p>
                <p className="text-[11px] text-slate-400">Permitir que otros jóvenes vean tu ficha de jugador</p>
              </div>
              <input
                type="checkbox"
                checked={user.privacy.isProfilePublic}
                onChange={(e) => updateUserProfile({ privacy: { ...user.privacy, isProfilePublic: e.target.checked } })}
                className="h-4 w-4 accent-amber-500 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-850">
              <div>
                <p className="text-xs font-bold text-white">Mostrar Ubicación General</p>
                <p className="text-[11px] text-slate-400">Mostrar ciudad y país para descubrir jóvenes cercanos</p>
              </div>
              <input
                type="checkbox"
                checked={user.privacy.showLocation}
                onChange={(e) => updateUserProfile({ privacy: { ...user.privacy, showLocation: e.target.checked } })}
                className="h-4 w-4 accent-amber-500 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-850">
              <div>
                <p className="text-xs font-bold text-white">Mensajes Directos</p>
                <p className="text-[11px] text-slate-400">Permitir que otros jóvenes cristianos te envíen mensajes de chat</p>
              </div>
              <input
                type="checkbox"
                checked={user.privacy.allowDirectMessages}
                onChange={(e) => updateUserProfile({ privacy: { ...user.privacy, allowDirectMessages: e.target.checked } })}
                className="h-4 w-4 accent-amber-500 rounded"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <p className="text-[11px] text-slate-400">
              🛡️ <strong>Seguridad Infantil y Juvenil:</strong> A Prueba de Fuego protege la privacidad de menores de edad. Nunca mostramos direcciones exactas, teléfonos o información financiera en perfiles públicos.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
