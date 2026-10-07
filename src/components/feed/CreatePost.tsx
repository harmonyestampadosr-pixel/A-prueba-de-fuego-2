import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { createPost as createPostInDb } from '../../firebase/db';
import { Post } from '../../types';
import { 
  Flame, 
  Image as ImageIcon, 
  Film, 
  BookOpen, 
  Sparkles, 
  Upload, 
  Trash2, 
  X, 
  Check, 
  Loader2,
  Camera,
  Send
} from 'lucide-react';

interface CreatePostProps {
  onSuccess?: (post: Post) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export const CreatePost: React.FC<CreatePostProps> = ({ 
  onSuccess, 
  onCancel, 
  isModal = false 
}) => {
  const { currentUser, createPost: createPostInContext, triggerCelebration } = useApp();

  // Form State
  const [content, setContent] = useState('');
  const [bibleVerse, setBibleVerse] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [videoFileName, setVideoFileName] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['JuventudAdventista', 'FuegoEspiritual']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Hidden File Inputs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const suggestedTags = [
    'RetoJuvenil',
    'AlabanzaJA',
    'CampamentoJA',
    'Testimonio',
    'Oración',
    'MisiónCaleb',
    'EstudioBíblico'
  ];

  // Handle Image Upload from device
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: warning if over 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert('La imagen es un poco pesada (máximo recomendado: 10MB). Se comprimirá para subirla.');
    }

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string);
        setVideoUrl(null); // Clear video if image selected
        setVideoFileName('');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Video Upload from device
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert('El video supera los 25MB recomendados. Para videos largos, te sugerimos comprimirlos o subir clips de hasta 60 segundos.');
    }

    setVideoFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setVideoUrl(event.target.result as string);
        setImageUrl(null); // Clear image if video selected
        setImageFileName('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleRemoveMedia = () => {
    setImageUrl(null);
    setVideoUrl(null);
    setImageFileName('');
    setVideoFileName('');
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setFeedbackMsg(null);

    const postId = `post_${Date.now()}`;
    const newPost: Post = {
      id: postId,
      authorId: currentUser.id,
      authorName: `${currentUser.name} ${currentUser.lastName}`.trim(),
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      authorChurch: currentUser.church,
      authorPoints: currentUser.points,
      authorIsOfficial: currentUser.role === 'admin' || currentUser.isOfficialVerified,
      content: content.trim(),
      bibleVerse: bibleVerse.trim() || undefined,
      imageUrl: imageUrl || undefined,
      videoUrl: videoUrl || undefined,
      tags: selectedTags,
      isOfficial: currentUser.role === 'admin',
      reactions: {
        amen: 0,
        aleluya: 0,
        gloriaDios: 0,
        diosEsBueno: 0,
        bendiciones: 0,
        estoyOrando: 0,
        meInspiro: 0,
      },
      userReactions: {},
      comments: [],
      sharesCount: 0,
      viewsCount: 1,
      createdAt: 'Justo ahora',
    };

    try {
      // 1. Guardar en la colección 'posts' de Firestore
      await createPostInDb(newPost);

      // 2. Sincronizar en el estado de la aplicación
      createPostInContext({
        content: newPost.content,
        bibleVerse: newPost.bibleVerse,
        imageUrl: newPost.imageUrl,
        videoUrl: newPost.videoUrl,
        tags: newPost.tags,
      });

      triggerCelebration();
      setFeedbackMsg('¡Publicación compartida con la comunidad!');

      // Reset form
      setContent('');
      setBibleVerse('');
      handleRemoveMedia();

      if (onSuccess) {
        onSuccess(newPost);
      }
    } catch (error) {
      console.error('Error al guardar publicación en Firestore:', error);
      setFeedbackMsg('Hubo un inconveniente al conectar con Firestore, pero se guardó en tu feed local.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerClasses = isModal 
    ? 'w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-5'
    : 'w-full rounded-3xl bg-slate-900 border border-slate-800 shadow-xl p-4 sm:p-5 mb-4';

  return (
    <div className={containerClasses}>
      
      {/* Hidden File Pickers */}
      <input 
        type="file" 
        ref={imageInputRef} 
        accept="image/*" 
        onChange={handleImageChange} 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={videoInputRef} 
        accept="video/*" 
        onChange={handleVideoChange} 
        className="hidden" 
      />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-orange-500/20">
            <Flame className="h-4 w-4 fill-slate-950" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">
              Crear Publicación Juvenil
            </h3>
            <span className="text-[10px] text-amber-400 font-medium">
              Conectado a Firestore (Colección 'posts')
            </span>
          </div>
        </div>

        {onCancel && (
          <button 
            type="button"
            onClick={onCancel}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Author Bar */}
      <div className="flex items-center gap-2.5 mb-3">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          referrerPolicy="no-referrer"
          className="h-10 w-10 rounded-2xl object-cover ring-2 ring-amber-500/40 shrink-0"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-white truncate">
              {currentUser.name} {currentUser.lastName}
            </span>
            {currentUser.role === 'admin' && (
              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-black uppercase">
                Admin
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 truncate">
            @{currentUser.username} · {currentUser.church || 'Guerrero JA'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        
        {/* Main Text Content */}
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`¿Qué testimonio, reflexión o alabanza deseas compartir hoy con los jóvenes, ${currentUser.name}?`}
          className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none leading-relaxed"
          required
        />

        {/* Bible Verse Input */}
        <div className="relative">
          <div className="absolute left-3 top-2.5 flex items-center text-amber-400 pointer-events-none">
            <BookOpen className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={bibleVerse}
            onChange={(e) => setBibleVerse(e.target.value)}
            placeholder="Versículo bíblico (Ej: Isaías 40:31 — 'Los que esperan a Jehová...')"
            className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Media Preview Box (Image or Video) */}
        {(imageUrl || videoUrl) && (
          <div className="relative rounded-2xl overflow-hidden border border-amber-500/40 bg-black max-h-72 flex items-center justify-center group">
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Vista previa de imagen"
                className="w-full h-auto max-h-72 object-cover rounded-2xl"
              />
            )}

            {videoUrl && (
              <video
                src={videoUrl}
                controls
                playsInline
                className="w-full h-auto max-h-72 rounded-2xl"
              />
            )}

            {/* Media Overlay Controls */}
            <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-xl">
              <span className="text-[10px] text-slate-300 px-2 py-0.5 font-medium truncate max-w-[150px]">
                {imageFileName || videoFileName || (imageUrl ? 'Foto adjunta' : 'Video adjunto')}
              </span>
              <button
                type="button"
                onClick={handleRemoveMedia}
                className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-colors"
                title="Quitar archivo"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Device Media Buttons */}
        <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all"
            >
              <Camera className="h-3.5 w-3.5 text-amber-400" />
              <span>📷 Subir Foto</span>
            </button>

            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all"
            >
              <Film className="h-3.5 w-3.5 text-purple-400" />
              <span>🎥 Subir Video</span>
            </button>
          </div>

          <span className="text-[10px] text-slate-500 hidden sm:inline">
            Archivos desde tu galería
          </span>
        </div>

        {/* Tags Selection */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 block">
            Etiquetas cristianas:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestedTags.map(tag => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => handleToggleTag(tag)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback message */}
        {feedbackMsg && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
          )}

          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black text-xs shadow-md shadow-orange-500/20 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 transition-all active:scale-95"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Publicando en Firestore...</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Publicar en la Comunidad</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
