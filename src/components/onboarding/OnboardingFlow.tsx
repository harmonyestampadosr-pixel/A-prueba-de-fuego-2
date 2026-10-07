import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { db, auth } from '../../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { 
  Flame, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Church, 
  Heart, 
  Compass, 
  ShieldCheck,
  Camera,
  LogIn,
  Upload,
  UserCheck,
  Crown
} from 'lucide-react';

interface OnboardingFlowProps {
  onCancel?: () => void;
  initialUserData?: {
    uid?: string;
    email?: string;
    name?: string;
    avatar?: string;
  };
  onOpenAuthModal?: () => void;
}

const INTEREST_OPTIONS = [
  { id: 'Música', label: 'Música', emoji: '🎵' },
  { id: 'Canto', label: 'Canto', emoji: '🎤' },
  { id: 'Biblia', label: 'Biblia', emoji: '📖' },
  { id: 'Evangelismo', label: 'Evangelismo', emoji: '🔥' },
  { id: 'Oración', label: 'Oración', emoji: '🙏' },
  { id: 'Campamentos', label: 'Campamentos', emoji: '🏕️' },
  { id: 'Juegos', label: 'Juegos', emoji: '🎮' },
  { id: 'Videos', label: 'Videos', emoji: '🎬' },
  { id: 'Fotografía', label: 'Fotografía', emoji: '📸' },
  { id: 'Misión', label: 'Misión', emoji: '🌎' },
  { id: 'Servicio', label: 'Servicio', emoji: '❤️' },
  { id: 'Predicación', label: 'Predicación', emoji: '🎙️' },
  { id: 'Estudios bíblicos', label: 'Estudios bíblicos', emoji: '📚' },
  { id: 'Jóvenes', label: 'Jóvenes', emoji: '👥' },
  { id: 'Deportes', label: 'Deportes', emoji: '🏃' },
  { id: 'Creatividad', label: 'Creatividad', emoji: '🎨' },
];

const MINISTRY_OPTIONS = [
  'Ministerio Juvenil JA',
  'Música y Alabanza',
  'Conquistadores',
  'Guías Mayores',
  'Aventureros',
  'Acción Misionera',
  'Escuela Sabática Joven',
  'Diaconado',
  'Comunicaciones',
  'Salud y Temperancia',
  'Recepción',
];

const ACTIVITY_QUESTIONS = [
  { id: 'cantar', label: '¿Te gusta cantar?' },
  { id: 'predicar', label: '¿Te gusta predicar?' },
  { id: 'ensenar', label: '¿Te gusta enseñar?' },
  { id: 'dar_estudios', label: '¿Te gusta dar estudios bíblicos?' },
  { id: 'obra_misionera', label: '¿Te gusta hacer obra misionera?' },
  { id: 'trabajar_ninos', label: '¿Te gusta trabajar con niños?' },
  { id: 'trabajar_jovenes', label: '¿Te gusta trabajar con jóvenes?' },
  { id: 'musica', label: '¿Te gusta la música?' },
  { id: 'evangelismo', label: '¿Te gusta hacer evangelismo?' },
  { id: 'ayudar_personas', label: '¿Te gusta ayudar a personas?' },
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onCancel, initialUserData, onOpenAuthModal }) => {
  const { registerUser, setActiveTab } = useApp();
  const [step, setStep] = useState(1);

  // File input ref for gallery upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedPhotoName, setUploadedPhotoName] = useState<string>('');

  // Form State
  const [name, setName] = useState(initialUserData?.name || '');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState(
    initialUserData?.name ? initialUserData.name.toLowerCase().replace(/\s+/g, '_') : ''
  );
  const [email, setEmail] = useState(initialUserData?.email || '');
  const [age, setAge] = useState(20);
  const [birthDate, setBirthDate] = useState('2006-05-10');
  const [city, setCity] = useState('Bogotá');
  const [country, setCountry] = useState('Colombia');
  const [avatar, setAvatar] = useState(
    initialUserData?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80'
  );

  // Admin account option
  const [isAdminAccount, setIsAdminAccount] = useState<boolean>(
    initialUserData?.email?.toLowerCase() === 'harmonyestampadosr@gmail.com'
  );

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        setAvatar(uploadEvent.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (initialUserData?.name) setName(initialUserData.name);
    if (initialUserData?.email) {
      setEmail(initialUserData.email);
      if (initialUserData.email.toLowerCase() === 'harmonyestampadosr@gmail.com') {
        setIsAdminAccount(true);
      }
    }
    if (initialUserData?.avatar) setAvatar(initialUserData.avatar);
    if (initialUserData?.name && !username) {
      setUsername(initialUserData.name.toLowerCase().replace(/\s+/g, '_'));
    }
  }, [initialUserData]);

  // Step 2: Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Música', 'Biblia', 'Campamentos']);

  // Step 3: Church info
  const [isAdventist, setIsAdventist] = useState(true);
  const [church, setChurch] = useState('Iglesia Adventista El Sinaí');
  const [district, setDistrict] = useState('Distrito Norte');
  const [zone, setZone] = useState('Zona 2');
  const [yearsServing, setYearsServing] = useState(3);

  // Step 4: Ministries & Activities
  const [selectedMinistries, setSelectedMinistries] = useState<string[]>(['Ministerio Juvenil JA']);
  const [selectedActivities, setSelectedActivities] = useState<string[]>(['trabajar_jovenes', 'musica', 'ayudar_personas']);
  const [maritalStatus, setMaritalStatus] = useState<'soltero' | 'casado'>('soltero');
  const [bio, setBio] = useState('¡Listo para vivir a prueba de fuego y servir al Señor con toda mi energía juvenil!');

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const toggleMinistry = (min: string) => {
    setSelectedMinistries(prev => 
      prev.includes(min) ? prev.filter(m => m !== min) : [...prev, min]
    );
  };

  const toggleActivity = (act: string) => {
    setSelectedActivities(prev => 
      prev.includes(act) ? prev.filter(a => a !== act) : [...prev, act]
    );
  };

  const handleFinish = async () => {
    const finalUserId = initialUserData?.uid || auth.currentUser?.uid || `user_${Date.now()}`;
    const isUserAdmin = isAdminAccount || email.trim().toLowerCase() === 'harmonyestampadosr@gmail.com';

    const userData = {
      id: finalUserId,
      name: name.trim() || (isUserAdmin ? 'Administrador' : 'Nuevo'),
      lastName: lastName.trim() || (isUserAdmin ? 'Oficial' : 'Guerrero'),
      username: username.trim() || (isUserAdmin ? 'admin_fuego' : `guerrero_${Date.now().toString().slice(-4)}`),
      email: email.trim() || initialUserData?.email || 'guerrero@apruebadefuego.org',
      avatar,
      age: Number(age),
      birthDate,
      city,
      country,
      church: church || (isUserAdmin ? 'Misión Central Adventista' : 'Iglesia Adventista'),
      district,
      zone,
      isAdventist,
      yearsServing: Number(yearsServing),
      ministries: selectedMinistries,
      activities: selectedActivities,
      maritalStatus,
      interests: selectedInterests,
      bio: bio || (isUserAdmin ? 'Cuenta Oficial de Administración y Moderación A Prueba de Fuego' : ''),
      points: isUserAdmin ? 1500 : 50,
      level: isUserAdmin ? 5 : 1,
      levelName: isUserAdmin ? 'Evangelista' : 'Comenzando',
      role: isUserAdmin ? ('admin' as const) : ('user' as const),
      isOfficialVerified: isUserAdmin,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('apdf_registered', 'true');

    // Save to Firestore if authenticated or online
    try {
      if (finalUserId) {
        await setDoc(doc(db, 'users', finalUserId), userData, { merge: true });
        console.log('User profile successfully saved to Firestore:', finalUserId);
      }
    } catch (err) {
      console.warn('Could not write profile to Firestore:', err);
    }

    registerUser(userData);

    if (isUserAdmin) {
      setActiveTab('admin');
    } else {
      setActiveTab('inicio');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6">
      <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8">
        
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black">
              <Flame className="h-4 w-4 fill-slate-950" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block">
                Paso {step} de 5
              </span>
              <h2 className="text-sm font-extrabold text-white">Registro & Perfil Inicial</h2>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  step === s ? 'w-6 bg-amber-500' : step > s ? 'w-2 bg-emerald-400' : 'w-2 bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: WELCOME & BASIC FIELDS */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center mb-3">
              <h3 className="text-lg font-black text-white font-heading">
                🔥 Bienvenido a A PRUEBA DE FUEGO
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Comienza creando tu perfil de guerrero espiritual.
              </p>
            </div>

            {/* Quick Firebase Auth Banner */}
            {onOpenAuthModal && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0" />
                  <span className="text-[11px] text-slate-300">
                    {initialUserData?.email ? `Autenticado con Firebase: ${initialUserData.email}` : '¿Ya tienes cuenta o prefieres entrar con Google?'}
                  </span>
                </div>
                {!initialUserData?.email && (
                  <button
                    type="button"
                    onClick={onOpenAuthModal}
                    className="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-bold text-[10px] hover:bg-amber-400 transition-colors shrink-0"
                  >
                    Iniciar Sesión
                  </button>
                )}
              </div>
            )}

            {/* Avatar Select with Gallery Photo Upload */}
            <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoFileChange}
                className="hidden"
              />

              <div className="relative group">
                <img
                  src={avatar}
                  alt="Selected Avatar"
                  referrerPolicy="no-referrer"
                  className="h-24 w-24 rounded-3xl object-cover ring-4 ring-amber-500 shadow-xl shadow-amber-500/20"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 rounded-xl bg-amber-500 text-slate-950 shadow-lg hover:bg-amber-400 hover:scale-105 transition-all"
                  title="Subir foto desde tu galería o cámara"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all mt-1"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>📷 Subir foto desde tu galería</span>
              </button>

              {uploadedPhotoName && (
                <span className="text-[10px] text-emerald-400 font-medium">
                  ✓ Foto cargada: {uploadedPhotoName}
                </span>
              )}

              <div className="w-full text-center pt-2 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-400 block mb-1.5">O escoge un avatar de guerrero:</span>
                <div className="flex justify-center gap-2">
                  {sampleAvatars.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAvatar(av);
                        setUploadedPhotoName('');
                      }}
                      className={`h-9 w-9 rounded-xl overflow-hidden border-2 transition-all ${
                        avatar === av ? 'border-amber-400 scale-105 ring-2 ring-amber-500/30' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt="Option" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Nombre:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Apellido:</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Pérez"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            {/* Username & Email */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Nombre de usuario:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="juan_perez"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Correo electrónico:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEmail(val);
                    if (val.trim().toLowerCase() === 'harmonyestampadosr@gmail.com') {
                      setIsAdminAccount(true);
                    }
                  }}
                  placeholder="juan@ejemplo.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            {/* Admin Account Option */}
            <div className={`p-3 rounded-2xl border transition-all ${
              isAdminAccount 
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-200' 
                : 'bg-slate-950/60 border-slate-800 text-slate-300'
            }`}>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAdminAccount}
                  onChange={(e) => setIsAdminAccount(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-700 text-amber-500 focus:ring-amber-400"
                />
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Crown className="h-3.5 w-3.5 text-amber-400" />
                    Crear cuenta como Administrador / Líder Oficial
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Te dará acceso inmediato al panel de administración para ver todos los usuarios registrados, revisar publicaciones y moderar la comunidad.
                  </p>
                </div>
              </label>

              {email.trim().toLowerCase() === 'harmonyestampadosr@gmail.com' && (
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Correo Administrador Oficial de A Prueba de Fuego reconocido</span>
                </div>
              )}
            </div>

            {/* Location & Age */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Edad:</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Ciudad:</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">País:</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: INTERESTS */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-black text-white font-heading">
                Selecciona tus Intereses
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Esto personalizará tu Inicio con retos y eventos afines.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {INTEREST_OPTIONS.map((item) => {
                const isSelected = selectedInterests.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleInterest(item.id)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md ring-1 ring-amber-400/50'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                    }`}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-xs font-bold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: CHURCH INFO */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-black text-white font-heading">
                Cuéntanos sobre tu Iglesia
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Ayúdanos a conectarte con tu distrito y zona eclesial.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">¿Eres miembro de la Iglesia Adventista?</p>
                <p className="text-[11px] text-slate-400">Jóvenes de otras denominaciones también son bienvenidos</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAdventist(!isAdventist)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  isAdventist ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {isAdventist ? 'Sí, Adventista' : 'Cristiano Amigo'}
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">¿Cuál es tu iglesia local?</label>
              <input
                type="text"
                value={church}
                onChange={(e) => setChurch(e.target.value)}
                placeholder="Ej: Iglesia Adventista Central o Bethel"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Distrito:</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Distrito Central"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Zona:</label>
                <input
                  type="text"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  placeholder="Zona 1"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                ¿Cuántos años tienes de servir en la iglesia?
              </label>
              <input
                type="number"
                value={yearsServing}
                onChange={(e) => setYearsServing(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>
        )}

        {/* STEP 4: MINISTRIES & ACTIVITIES */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-black text-white font-heading">
                Ministerios y Actividades
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                ¿Dónde te gusta poner tus talentos al servicio del Señor?
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">
                ¿En qué ministerios sirves actualmente?
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                {MINISTRY_OPTIONS.map((min) => {
                  const isSel = selectedMinistries.includes(min);
                  return (
                    <button
                      key={min}
                      type="button"
                      onClick={() => toggleMinistry(min)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isSel ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {min}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">
                ¿Qué actividades disfrutas realizar?
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                {ACTIVITY_QUESTIONS.map((act) => {
                  const isSel = selectedActivities.includes(act.id);
                  return (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => toggleActivity(act.id)}
                      className={`p-2 rounded-xl text-left text-[11px] font-semibold transition-all border ${
                        isSel ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {act.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-bold text-slate-300">Estado civil:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMaritalStatus('soltero')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold ${
                    maritalStatus === 'soltero' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Soltero/a
                </button>
                <button
                  type="button"
                  onClick={() => setMaritalStatus('casado')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold ${
                    maritalStatus === 'casado' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Casado/a
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: CONFIRMATION & 00 POINTS */}
        {step === 5 && (
          <div className="text-center space-y-4 py-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 text-slate-950 mx-auto shadow-2xl fire-glow">
              <Flame className="h-10 w-10 fill-slate-950" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
              ¡Tu aventura comienza con 00 puntos!
            </h3>

            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-xs text-slate-300 max-w-md mx-auto space-y-2">
              <p>
                Bienvenido, <strong className="text-amber-400">{name} {lastName}</strong>.
              </p>
              <p>
                Tu perfil de jugador espiritual ha sido configurado en el nivel <strong>Nivel 1 — Comenzando</strong>.
              </p>
              <p className="text-slate-400 text-[11px]">
                A partir de ahora podrás subir evidencias de retos, participar en campamentos y confraternizar con miles de jóvenes adventistas en todo el mundo.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-black">
              🔥 00 PUNTOS DISPONIBLES · LISTO PARA EL DESAFÍO
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800 mt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Anterior</span>
            </button>
          ) : (
            onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-300"
              >
                Cancelar
              </button>
            ) : <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev + 1)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black hover:bg-amber-400 transition-colors flex items-center gap-1.5 shadow-md"
            >
              <span>Siguiente</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-slate-950 text-xs font-black shadow-lg hover:from-amber-400 hover:to-orange-500 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles className="h-4 w-4 fill-slate-950" />
              <span>Comenzar Mi Aventura</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
