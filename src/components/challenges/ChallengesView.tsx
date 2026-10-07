import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Challenge, Badge } from '../../types';
import { SubmitEvidenceModal } from './SubmitEvidenceModal';
import { WeeklyConsistencyWidget } from './WeeklyConsistencyWidget';
import { BibleGames } from '../games/BibleGames';
import { DAILY_CHALLENGES_SCHEDULE } from '../../data/adventistResourcesData';
import confetti from 'canvas-confetti';
import { 
  Flame, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Filter,
  PlusCircle,
  FileCheck,
  Sparkles,
  Zap,
  Calendar,
  BookOpen,
  Award,
  Trophy,
  Check,
  X,
  Camera,
  MapPin,
  Share2,
  BookmarkCheck,
  Star,
  Layers,
  Gamepad2
} from 'lucide-react';

export interface SpiritualBadgeDef extends Badge {
  unlockRequirement: string;
  pointsReward: number;
  verseRef: string;
}

export const SPIRITUAL_ACHIEVEMENT_BADGES: SpiritualBadgeDef[] = [
  {
    id: 'b_orador_dia',
    name: 'Orador del día',
    icon: '🎤',
    imageUrl: '/src/assets/images/badge_orador_dia_1791150552233.jpg',
    description: 'Proclamó con valentía y unción la palabra de Dios ante la congregación o grupo juvenil JA.',
    category: 'fe',
    unlockRequirement: 'Participar como orador en el culto JA, dar un tema bíblico o dirigir la meditación devocional.',
    pointsReward: 250,
    verseRef: '1 Pedro 4:11',
  },
  {
    id: 'b_servidor_fiel',
    name: 'Servidor fiel',
    icon: '❤️',
    imageUrl: '/src/assets/images/badge_servidor_fiel_1791150561583.jpg',
    description: 'Manifestó el amor de Cristo mediante servicio generoso a los necesitados, la comunidad y la iglesia.',
    category: 'servicio',
    unlockRequirement: 'Realizar una obra solidaria de impacto: alimentos a necesitados, visita a enfermos o apoyo al prójimo.',
    pointsReward: 220,
    verseRef: 'Gálatas 5:13',
  },
  {
    id: 'b_estudiante_biblia',
    name: 'Estudiante de la Biblia',
    icon: '📖',
    imageUrl: '/src/assets/images/badge_estudiante_biblia_1791150570985.jpg',
    description: 'Profundizó diligentemente en el estudio bíblico personal, lección de Escuela Sabática y memorización.',
    category: 'fe',
    unlockRequirement: 'Completar 7 días de estudio diario de la Biblia y repaso de la lección de Escuela Sabática.',
    pointsReward: 200,
    verseRef: '2 Timoteo 3:16-17',
  },
];

export const ChallengesView: React.FC = () => {
  const { challenges, submissions, currentUser, setActiveTab, completeDailyChallenge } = useApp();
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [viewTab, setViewTab] = useState<'available' | 'spiritual_badges' | 'games' | 'my_submissions'>('available');

  // Daily Challenge State
  const now = new Date();
  const currentDayOfWeek = now.getDay();
  const dailySchedule = DAILY_CHALLENGES_SCHEDULE.find(d => d.dayOfWeek === currentDayOfWeek) || DAILY_CHALLENGES_SCHEDULE[0];
  const hoursLeft = 23 - now.getHours();
  const minutesLeft = 59 - now.getMinutes();

  // Asignar icono/medallón 3D temático para el reto de hoy
  const associatedSpiritualBadge = 
    (currentDayOfWeek === 6 || currentDayOfWeek === 3) ? SPIRITUAL_ACHIEVEMENT_BADGES[0] : // Orador del día
    (currentDayOfWeek === 4 || currentDayOfWeek === 0) ? SPIRITUAL_ACHIEVEMENT_BADGES[1] : // Servidor fiel
    SPIRITUAL_ACHIEVEMENT_BADGES[2]; // Estudiante de la Biblia

  const todayBadgeId = `badge_daily_${currentDayOfWeek}`;
  const todayBadge: Badge = {
    id: todayBadgeId,
    name: `Insignia ${dailySchedule.dayName}: ${dailySchedule.theme}`,
    icon: dailySchedule.icon,
    imageUrl: associatedSpiritualBadge.imageUrl,
    description: `Completó el reto diario de ${dailySchedule.dayName} («${dailySchedule.title}»)`,
    category: 'reto',
    unlockedAt: new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }),
  };

  const hasCompletedToday = 
    currentUser.badges.some(b => b.id === todayBadgeId) ||
    submissions.some(s => s.userId === currentUser.id && (s.challengeId.startsWith(`daily_${currentDayOfWeek}`) || s.challengeTitle.includes(dailySchedule.dayName)));

  // Daily Modal, Celebration Modal, Spiritual Badge Modal and Golden Flash states
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [selectedSpiritualBadge, setSelectedSpiritualBadge] = useState<SpiritualBadgeDef | null>(null);
  const [dailyReflection, setDailyReflection] = useState('');
  const [dailyLocation, setDailyLocation] = useState(currentUser.city || 'Buenaventura, Colombia');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unlockedBadgeAlert, setUnlockedBadgeAlert] = useState<Badge | null>(null);
  const [showGoldenFlash, setShowGoldenFlash] = useState(false);

  // Animación visual de confeti y destello dorado
  const triggerGoldenBadgeCelebration = () => {
    // 1. Activar destello dorado en pantalla
    setShowGoldenFlash(true);
    setTimeout(() => setShowGoldenFlash(false), 900);

    // 2. Feedback háptico en dispositivos móviles compatibles
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([60, 40, 100]);
      }
    } catch {
      // Ignorar si no está soportado
    }

    // 3. Explosión de confeti en múltiples oleadas (Centro, izquierda y derecha con dorados y esmeraldas)
    try {
      // Ráfaga central
      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#FFD700', '#F59E0B', '#F97316', '#EF4444', '#10B981', '#FFFFFF'],
        ticks: 250,
        gravity: 1.1,
        scalar: 1.25,
      });

      // Cañones laterales tipo fuegos artificiales
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0.15, y: 0.65 },
          colors: ['#FFD700', '#FBBF24', '#F59E0B', '#FFFFFF'],
          ticks: 220,
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 0.85, y: 0.65 },
          colors: ['#FFD700', '#FBBF24', '#F59E0B', '#FFFFFF'],
          ticks: 220,
        });
      }, 140);

      // Tercera lluvia de estrellas doradas
      setTimeout(() => {
        confetti({
          particleCount: 40,
          spread: 90,
          origin: { y: 0.45 },
          shapes: ['star', 'circle'],
          colors: ['#FFE600', '#FFB703', '#FFFFFF', '#06D6A0'],
          scalar: 1.4,
          ticks: 280,
        });
      }, 300);
    } catch (e) {
      console.warn('Efecto confeti fallback:', e);
    }
  };

  const handleOpenDailyModal = () => {
    setShowDailyModal(true);
  };

  const handleClaimDailyReward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dailyReflection.trim()) return;

    setIsSubmitting(true);
    const challengeId = `daily_${currentDayOfWeek}_${now.toISOString().slice(0, 10)}`;

    try {
      // 1. Ejecutar lógica de recompensas y guardar en Firestore
      const result = await completeDailyChallenge(
        todayBadge,
        dailySchedule.points,
        challengeId,
        dailyReflection.trim()
      );

      setShowDailyModal(false);
      setDailyReflection('');
      setUnlockedBadgeAlert(result.badge);

      // 2. Disparar animación visual de confeti y destello dorado
      triggerGoldenBadgeCelebration();
    } catch (err) {
      console.error('Error al reclamar recompensa del reto diario:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Certificar y reclamar una insignia espiritual personalizada
  const handleClaimSpiritualBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpiritualBadge || !dailyReflection.trim()) return;

    setIsSubmitting(true);
    const challengeId = `spiritual_${selectedSpiritualBadge.id}_${Date.now()}`;

    try {
      const badgeToAward: Badge = {
        id: selectedSpiritualBadge.id,
        name: selectedSpiritualBadge.name,
        icon: selectedSpiritualBadge.icon,
        imageUrl: selectedSpiritualBadge.imageUrl,
        description: selectedSpiritualBadge.description,
        category: selectedSpiritualBadge.category,
        unlockedAt: new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }),
      };

      const result = await completeDailyChallenge(
        badgeToAward,
        selectedSpiritualBadge.pointsReward,
        challengeId,
        dailyReflection.trim()
      );

      setSelectedSpiritualBadge(null);
      setDailyReflection('');
      setUnlockedBadgeAlert(result.badge);

      triggerGoldenBadgeCelebration();
    } catch (err) {
      console.error('Error al certificar insignia espiritual:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const mySubmissions = submissions.filter(s => s.userId === currentUser.id);

  const filteredChallenges = challenges.filter(c => {
    if (filterDifficulty !== 'all' && c.difficulty !== filterDifficulty) return false;
    return true;
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4">
      
      {/* Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-amber-600/20 via-orange-950/40 to-slate-950 border border-amber-500/30 p-5 sm:p-6 mb-6 overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[11px] font-bold text-amber-300 mb-2">
              <Flame className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>SISTEMA DE RETOS & RECOMPENSAS FIRESTORE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
              Retos Juveniles & Insignias Virtuales
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
              Supera misiones de fe, comparte tu testimonio y gana insignias espirituales 3D oficiales guardadas en tu perfil de Firestore.
            </p>
          </div>

          <div className="flex flex-col items-end sm:items-center gap-1 p-3 rounded-2xl bg-slate-900/90 border border-amber-500/40 min-w-[130px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tus Puntos</span>
            <div className="flex items-center gap-1.5 text-xl font-black text-amber-400 tabular-nums">
              <Flame className="h-5 w-5 fill-amber-400" />
              <span>{currentUser.points.toLocaleString()}</span>
            </div>
            <span className="text-[10px] text-slate-300 font-semibold">
              Nivel {currentUser.level} · {currentUser.levelName}
            </span>
          </div>
        </div>
      </div>

      {/* Daily Challenge Spotlight Card */}
      <div className={`rounded-3xl border-2 p-5 mb-6 shadow-xl relative overflow-hidden transition-all ${
        hasCompletedToday
          ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-500/40'
          : 'bg-gradient-to-r from-amber-500/25 via-orange-600/20 to-slate-950 border-amber-500/50'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1 shadow-md ${
                hasCompletedToday ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
              }`}>
                <Zap className="h-3.5 w-3.5 fill-current" />
                Reto Diario: {dailySchedule.dayName}
              </span>

              {hasCompletedToday ? (
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Insignia Desbloqueada y Guardada en Firestore
                </span>
              ) : (
                <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Termina en: {hoursLeft}h {minutesLeft}m
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-black text-white">
              {dailySchedule.title}
            </h2>

            <p className="text-xs text-slate-200 leading-relaxed max-w-xl">
              {dailySchedule.description}
            </p>

            <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
              <span className="text-amber-400 font-bold italic flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                {dailySchedule.verseRef}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-300">Recompensa: Insignia 3D + {dailySchedule.points} pts</span>
            </div>
          </div>

          {/* Reward & Button Column */}
          <div className="flex flex-col items-end sm:items-center gap-2 shrink-0 self-end sm:self-center">
            {/* Virtual Badge Preview */}
            <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-900 border border-amber-500/30 shadow-md">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-400/50 bg-amber-500/10 shrink-0 flex items-center justify-center">
                {todayBadge.imageUrl ? (
                  <img 
                    src={todayBadge.imageUrl} 
                    alt={todayBadge.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">{dailySchedule.icon}</span>
                )}
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Insignia a Obtener
                </span>
                <span className="text-xs font-black text-white block truncate max-w-[130px]">
                  {todayBadge.name}
                </span>
                <span className="text-[10px] text-emerald-400 font-extrabold">
                  +{dailySchedule.points} pts
                </span>
              </div>
            </div>

            {hasCompletedToday ? (
              <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs text-center flex items-center justify-center gap-1.5">
                <Check className="h-4 w-4" />
                <span>¡Reto Cumplido Hoy!</span>
              </div>
            ) : (
              <button
                onClick={handleOpenDailyModal}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
              >
                <Award className="h-4 w-4 fill-slate-950" />
                <span>Completar y Ganar Insignia</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Widget Gráfico de Consistencia Semanal (Recharts) */}
      <WeeklyConsistencyWidget className="mb-6" />

      {/* Banner de Acceso Rápido a Juegos Bíblicos */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-purple-950/40 border border-amber-500/30 p-4 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-2xl shrink-0">
            🎮
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">
              Gana Puntos & Ejercita tu Mente
            </span>
            <h3 className="text-sm font-black text-white">
              Centro de Juegos Bíblicos JA
            </h3>
            <p className="text-xs text-slate-300">
              Quiz interactivo, ¿Quién es el personaje?, Verdadero o Falso y Memorizador de Versículos.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setViewTab('games')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black shrink-0 flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Gamepad2 className="h-4 w-4 fill-slate-950" />
          <span>Jugar Ahora</span>
        </button>
      </div>

      {/* Tabs: Retos Disponibles vs Insignias Espirituales 3D vs Juegos Bíblicos vs Mis Evidencias */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 mb-5 gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setViewTab('available')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewTab === 'available'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <Flame className="h-4 w-4" />
            <span>Retos de Misión ({challenges.length})</span>
          </button>

          <button
            onClick={() => setViewTab('spiritual_badges')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewTab === 'spiritual_badges'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <Star className="h-4 w-4 fill-current" />
            <span>Insignias Espirituales 3D ({SPIRITUAL_ACHIEVEMENT_BADGES.length})</span>
          </button>

          <button
            onClick={() => setViewTab('games')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewTab === 'games'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <Gamepad2 className="h-4 w-4" />
            <span>Juegos Bíblicos</span>
          </button>

          <button
            onClick={() => setViewTab('my_submissions')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewTab === 'my_submissions'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <FileCheck className="h-4 w-4" />
            <span>Mis Certificaciones ({mySubmissions.length})</span>
          </button>
        </div>

        {/* Filter difficulty (en pestaña de disponibles) */}
        {viewTab === 'available' && (
          <div className="flex items-center gap-1 text-xs self-end sm:self-center">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Todas las dificultades</option>
              <option value="Fácil">Fácil</option>
              <option value="Medio">Medio</option>
              <option value="Difícil">Difícil</option>
              <option value="Épico">Épico</option>
            </select>
          </div>
        )}
      </div>

      {/* VIEW 1: SPIRITUAL BADGES (Insignias Personalizadas Generadas) */}
      {viewTab === 'spiritual_badges' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-slate-950 border border-amber-500/30 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                Medallones 3D de Logros Espirituales
              </span>
              <h3 className="text-sm font-bold text-white">
                Insignias Espirituales Especiales para Jóvenes Adventistas
              </h3>
              <p className="text-xs text-slate-300">
                Certifica tu servicio como orador, servidor generoso o estudiante fiel de la Biblia para agregarlas a tu perfil en Firestore.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SPIRITUAL_ACHIEVEMENT_BADGES.map((badge) => {
              const isUnlocked = currentUser.badges.some((b) => b.id === badge.id);

              return (
                <div
                  key={badge.id}
                  className={`rounded-3xl border p-5 flex flex-col justify-between transition-all relative overflow-hidden group ${
                    isUnlocked
                      ? 'bg-slate-900/90 border-emerald-500/50 shadow-emerald-500/10 shadow-lg'
                      : 'bg-slate-900/90 border-amber-500/30 hover:border-amber-500/60 shadow-lg'
                  }`}
                >
                  {/* Decorative ambient glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

                  <div>
                    {/* Medallion Display */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl shadow-amber-500/20 group-hover:scale-105 transition-transform bg-slate-950">
                          <img
                            src={badge.imageUrl}
                            alt={badge.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {isUnlocked && (
                          <span className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-emerald-500 text-slate-950 shadow-md">
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black block">
                          +{badge.pointsReward} pts
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold block mt-1 uppercase">
                          {badge.category}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-base font-black text-white mb-1">
                      {badge.name}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {badge.description}
                    </p>

                    <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-1 mb-4 text-[11px]">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Requisito para certificar:
                      </span>
                      <p className="text-slate-200">{badge.unlockRequirement}</p>
                      <span className="text-amber-400 italic text-[10px] block pt-0.5 font-semibold">
                        📖 {badge.verseRef}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800">
                    {isUnlocked ? (
                      <div className="w-full py-2 px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold text-xs text-center flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Desbloqueada en Firestore</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedSpiritualBadge(badge)}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
                      >
                        <Award className="h-4 w-4 fill-slate-950" />
                        <span>Certificar y Ganar Medallón</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: AVAILABLE MISSION CHALLENGES */}
      {viewTab === 'available' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredChallenges.map((challenge) => {
            const isCompleted = submissions.some(
              (s) => s.challengeId === challenge.id && s.userId === currentUser.id && s.status === 'approved'
            );
            const isPending = submissions.some(
              (s) => s.challengeId === challenge.id && s.userId === currentUser.id && s.status === 'pending'
            );

            return (
              <div
                key={challenge.id}
                className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-750 transition-all p-5 flex flex-col justify-between shadow-lg relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-3xl p-2 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                      {challenge.icon}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-xl bg-slate-950 text-amber-400 text-xs font-black border border-slate-800 tabular-nums">
                        +{challenge.points} pts
                      </span>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                        challenge.difficulty === 'Fácil' ? 'bg-emerald-500/20 text-emerald-300' :
                        challenge.difficulty === 'Medio' ? 'bg-amber-500/20 text-amber-300' :
                        challenge.difficulty === 'Difícil' ? 'bg-orange-500/20 text-orange-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1 leading-snug">
                    {challenge.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {challenge.description}
                  </p>

                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-855 space-y-1 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Evidencia requerida:
                    </span>
                    <p className="text-[11px] text-slate-300">
                      {challenge.requiredEvidence}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {challenge.participantsCount} participantes
                  </span>

                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 text-xs">
                      <CheckCircle2 className="h-4 w-4" />
                      Aprobado (+{challenge.points} pts)
                    </span>
                  ) : isPending ? (
                    <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 text-xs">
                      <Clock className="h-4 w-4" />
                      En revisión
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedChallenge(challenge)}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-colors shadow-md flex items-center gap-1"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>Subir Evidencia</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: MY SUBMISSIONS */}
      {viewTab === 'my_submissions' && (
        <div className="space-y-3">
          {mySubmissions.length === 0 ? (
            <div className="text-center py-12 rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-2">
              <FileCheck className="h-8 w-8 text-slate-500 mx-auto" />
              <p className="text-sm font-bold text-white">Aún no has enviado evidencias de retos.</p>
              <p className="text-xs text-slate-400">
                Elige uno de los retos disponibles o completa el reto diario para ganar tus primeras insignias virtuales.
              </p>
            </div>
          ) : (
            mySubmissions.map((sub) => (
              <div 
                key={sub.id} 
                className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{sub.challengeTitle}</span>
                    <span className="text-xs font-black text-amber-400">+{sub.challengePoints} pts</span>
                  </div>
                  <p className="text-xs text-slate-300 italic">"{sub.commentReflection}"</p>
                  <span className="text-[10px] text-slate-400 block">Enviado: {sub.submittedAt}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                    sub.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    sub.status === 'rejected' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {sub.status === 'approved' ? '✓ Aprobado e Insignia Asignada' : sub.status === 'rejected' ? 'Rechazado' : '⏳ Pendiente'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* VIEW 4: JUEGOS BÍBLICOS JA */}
      {viewTab === 'games' && (
        <div className="rounded-3xl bg-slate-900/50 border border-slate-800/80 p-1 sm:p-3 animate-in fade-in duration-200">
          <BibleGames />
        </div>
      )}

      {/* 1. Modal: Subir Evidencia para Retos Regulares */}
      {selectedChallenge && (
        <SubmitEvidenceModal
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
        />
      )}

      {/* 2. Modal: Completar Reto Diario & Reclamar Insignia Virtual */}
      {showDailyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  Reto Diario: {dailySchedule.dayName}
                </span>
                <h3 className="text-base font-black text-white">{dailySchedule.title}</h3>
              </div>
              <button
                onClick={() => setShowDailyModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Reward Card Banner con Medallón 3D */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-slate-950 border border-amber-500/40 flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-lg shrink-0 bg-slate-950 flex items-center justify-center">
                {todayBadge.imageUrl ? (
                  <img
                    src={todayBadge.imageUrl}
                    alt={todayBadge.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl">{dailySchedule.icon}</span>
                )}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 block">
                  Insignia Virtual a Desbloquear:
                </span>
                <h4 className="text-sm font-black text-white">{todayBadge.name}</h4>
                <p className="text-[11px] text-slate-300">
                  Recompensa inmediata: <strong className="text-emerald-400">+{dailySchedule.points} puntos</strong> al perfil en Firestore.
                </p>
              </div>
            </div>

            {/* Instruction */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-slate-200 block">Misión del Día:</span>
              <p>{dailySchedule.description}</p>
              <p className="text-amber-400 italic text-[11px] pt-1">
                {dailySchedule.verseRef}: {dailySchedule.verseText}
              </p>
            </div>

            {/* Completion Form */}
            <form onSubmit={handleClaimDailyReward} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Escribe cómo cumpliste el reto de hoy (Testimonio o evidencia):
                </label>
                <textarea
                  required
                  rows={3}
                  value={dailyReflection}
                  onChange={(e) => setDailyReflection(e.target.value)}
                  placeholder="Ej: Hoy compartí con mi familia el devocional y oramos por los planes de la semana..."
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Ubicación o Iglesia Local:
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={dailyLocation}
                    onChange={(e) => setDailyLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDailyModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white font-bold"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !dailyReflection.trim()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg disabled:opacity-50"
                >
                  <Award className="h-4 w-4 fill-slate-950" />
                  <span>{isSubmitting ? 'Guardando en Firestore...' : 'Reclamar Insignia y Puntos'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: Certificar Insignia Espiritual Personalizada */}
      {selectedSpiritualBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  Certificación de Logro Espiritual JA
                </span>
                <h3 className="text-base font-black text-white">{selectedSpiritualBadge.name}</h3>
              </div>
              <button
                onClick={() => setSelectedSpiritualBadge(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Medallon Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-slate-950 border border-amber-500/40 flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl shrink-0 bg-slate-950">
                <img
                  src={selectedSpiritualBadge.imageUrl}
                  alt={selectedSpiritualBadge.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-white">{selectedSpiritualBadge.name}</h4>
                <p className="text-xs text-slate-300">{selectedSpiritualBadge.description}</p>
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-black">
                    +{selectedSpiritualBadge.pointsReward} pts
                  </span>
                  <span className="text-slate-400 font-bold italic">
                    {selectedSpiritualBadge.verseRef}
                  </span>
                </div>
              </div>
            </div>

            {/* Requirement note */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-850 text-xs text-slate-300">
              <span className="font-bold text-amber-300 block mb-0.5">Requisito a certificar:</span>
              <p>{selectedSpiritualBadge.unlockRequirement}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleClaimSpiritualBadge} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Describe tu experiencia y testimonio para certificar este logro:
                </label>
                <textarea
                  required
                  rows={3}
                  value={dailyReflection}
                  onChange={(e) => setDailyReflection(e.target.value)}
                  placeholder={`Ej: Esta semana completé la labor de ${selectedSpiritualBadge.name.toLowerCase()} compartiendo con la hermandad...`}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Lugar o Iglesia Local:
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={dailyLocation}
                    onChange={(e) => setDailyLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSpiritualBadge(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white font-bold"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !dailyReflection.trim()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg disabled:opacity-50"
                >
                  <Award className="h-4 w-4 fill-slate-950" />
                  <span>{isSubmitting ? 'Guardando en Firestore...' : 'Certificar y Desbloquear Insignia'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Overlay: Destello Dorado de Feedback Visual (Golden Flash) */}
      {showGoldenFlash && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
          {/* Luz radial pulsante que ilumina toda la pantalla */}
          <div className="w-[120vw] h-[120vh] bg-gradient-to-r from-amber-400/35 via-yellow-300/45 to-orange-400/35 rounded-full blur-3xl animate-ping" />
          <div className="absolute inset-0 bg-amber-500/20 backdrop-blur-xs transition-opacity duration-700" />
        </div>
      )}

      {/* 4. Celebration Modal: ¡Insignia Virtual Desbloqueada con Medallón 3D y Halo Dorado! */}
      {unlockedBadgeAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-250">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-amber-400 shadow-2xl p-6 text-center space-y-4 relative overflow-hidden shadow-amber-500/30">
            {/* Fondo con resplandor dorado */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-yellow-500/25 rounded-full blur-3xl pointer-events-none" />

            {/* Insignia central con Halo Dorado y Rayos Giratorios */}
            <div className="relative inline-flex items-center justify-center p-6 my-2">
              {/* Resplandor radial dorado pulsante */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/40 via-yellow-400/50 to-orange-500/40 rounded-full blur-2xl animate-pulse" />
              
              {/* Anillo de destello dorado giratorio */}
              <div className="absolute -inset-2 rounded-full border-2 border-dashed border-amber-400/70 animate-[spin_8s_linear_infinite]" />
              <div className="absolute -inset-4 rounded-full border border-amber-300/40 animate-[spin_12s_linear_infinite_reverse]" />

              {/* Chispas y destellos flotantes */}
              <span className="absolute -top-2 -left-2 text-xl animate-bounce">✨</span>
              <span className="absolute -bottom-1 -right-2 text-xl animate-bounce delay-150">🌟</span>
              <span className="absolute top-1/2 -right-4 text-base animate-pulse">⚡</span>
              <span className="absolute top-1/2 -left-4 text-base animate-pulse delay-200">🔥</span>

              {/* Medallón central (Imagen 3D generada o icono) */}
              <div className="relative z-10 w-28 h-28 rounded-3xl overflow-hidden border-2 border-amber-400 shadow-2xl shadow-amber-500/50 flex items-center justify-center bg-slate-950">
                {unlockedBadgeAlert.imageUrl ? (
                  <img
                    src={unlockedBadgeAlert.imageUrl}
                    alt={unlockedBadgeAlert.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl">{unlockedBadgeAlert.icon}</span>
                )}
              </div>
            </div>

            <div className="space-y-1 relative z-10">
              <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[11px] font-black uppercase shadow-lg shadow-amber-500/30 inline-flex items-center gap-1">
                <Sparkles className="h-3 w-3 fill-slate-950" />
                ¡NUEVA INSIGNIA DESBLOQUEADA!
              </span>
              <h3 className="text-xl font-black text-white mt-2">
                {unlockedBadgeAlert.name}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed px-2">
                {unlockedBadgeAlert.description}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 text-xs space-y-1.5 relative z-10">
              <div className="flex items-center justify-between text-slate-400">
                <span>Puntos sumados:</span>
                <span className="text-emerald-400 font-black text-sm">+{dailySchedule.points} pts</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Progreso en Firestore:</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Sincronizado en la nube
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2 relative z-10">
              <button
                type="button"
                onClick={triggerGoldenBadgeCelebration}
                className="w-full py-1.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>🎉 Lanzar Confeti & Destello de Nuevo</span>
              </button>

              <button
                onClick={() => {
                  setUnlockedBadgeAlert(null);
                  setActiveTab('perfil');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition-colors shadow-lg shadow-amber-500/20"
              >
                Ver en Mi Ficha de Jugador
              </button>

              <button
                onClick={() => setUnlockedBadgeAlert(null)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-bold text-xs transition-colors"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
