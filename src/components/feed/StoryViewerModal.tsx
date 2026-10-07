import React, { useState, useEffect } from 'react';
import { Story } from '../../types';
import { X, Heart, MessageCircle, Eye, Flame, Share2 } from 'lucide-react';

interface StoryViewerModalProps {
  story: Story;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({ 
  story, 
  onClose, 
  onNext, 
  onPrev 
}) => {
  const [progress, setProgress] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onNext) onNext();
          else onClose();
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [story.id, onNext, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4">
      <div className="relative flex flex-col w-full max-w-sm h-[85vh] max-h-[720px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
        
        {/* Progress bar */}
        <div className="absolute top-3 left-3 right-3 z-30 flex gap-1.5">
          <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-400 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Header */}
        <div className="absolute top-6 left-3 right-3 z-30 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <img
              src={story.authorAvatar}
              alt={story.authorName}
              referrerPolicy="no-referrer"
              className="h-9 w-9 rounded-full object-cover ring-2 ring-amber-500"
            />
            <div>
              <p className="text-xs font-bold leading-tight drop-shadow-md">{story.authorName}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-300 drop-shadow-sm">
                <span className="capitalize">{story.category}</span>
                <span>·</span>
                <span>{story.createdAt}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Media or Visual Content */}
        <div className="relative flex-1 bg-slate-900 flex items-center justify-center overflow-hidden">
          {story.mediaUrl ? (
            <img
              src={story.mediaUrl}
              alt="Story"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-amber-900/60 via-slate-900 to-slate-950 p-6 flex flex-col justify-center items-center text-center">
              <Flame className="h-12 w-12 text-amber-500 mb-4 animate-bounce" />
            </div>
          )}

          {/* Text Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 flex flex-col justify-end p-5">
            {story.bibleVerse && (
              <div className="mb-2 p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 backdrop-blur-md">
                <p className="text-xs font-bold text-amber-300">📖 {story.bibleVerse}</p>
              </div>
            )}
            
            {story.textContent && (
              <p className="text-sm font-medium text-white leading-relaxed drop-shadow-md">
                {story.textContent}
              </p>
            )}

            <div className="flex items-center gap-3 text-xs text-slate-300 mt-3 pt-2 border-t border-white/10">
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5 text-amber-400" />
                <span>{story.viewsCount} vistas</span>
              </span>
              <span className="text-[10px] text-amber-400/90 ml-auto">
                {story.expiresAt}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Reaction Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Responder con fe..."
            className="flex-1 px-3 py-2 rounded-full bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <button 
            onClick={() => setHasLiked(!hasLiked)}
            className={`p-2 rounded-full border transition-all ${
              hasLiked 
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Heart className={`h-4 w-4 ${hasLiked ? 'fill-rose-500' : ''}`} />
          </button>
          <button 
            onClick={() => alert('¡Enlace del estado copiado!')}
            className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
