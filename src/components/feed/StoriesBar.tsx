import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Story } from '../../types';
import { Plus, Flame, Heart, BookOpen, Music, Church, Sparkles } from 'lucide-react';

interface StoriesBarProps {
  onOpenCreateStory: () => void;
  onSelectStory: (story: Story) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  oracion: '🙏',
  versiculo: '📖',
  testimonio: '❤️',
  reflexion: '🔥',
  musica: '🎵',
  iglesia: '⛪',
  campamento: '🏕️',
};

export const StoriesBar: React.FC<StoriesBarProps> = ({ onOpenCreateStory, onSelectStory }) => {
  const { currentUser, stories } = useApp();

  return (
    <div className="w-full py-2">
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar px-1 py-1">
        
        {/* User's Add Story Card */}
        <button
          onClick={onOpenCreateStory}
          className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
        >
          <div className="relative">
            <div className="h-16 w-16 rounded-full p-0.5 border-2 border-dashed border-amber-500/60 group-hover:border-amber-400 transition-colors">
              <img
                src={currentUser.avatar}
                alt="Tu estado"
                referrerPolicy="no-referrer"
                className="h-full w-full rounded-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md ring-2 ring-slate-950">
              <Plus className="h-3.5 w-3.5 stroke-[3]" />
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-300 group-hover:text-amber-400 transition-colors truncate max-w-[70px]">
            Tu estado
          </span>
        </button>

        {/* Stories List */}
        {stories.map((story) => {
          const categoryIcon = CATEGORY_ICONS[story.category] || '🔥';

          return (
            <button
              key={story.id}
              onClick={() => onSelectStory(story)}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            >
              <div className="relative">
                <div className="h-16 w-16 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 group-hover:scale-105 transition-transform shadow-md shadow-orange-500/10">
                  <div className="h-full w-full rounded-full p-0.5 bg-slate-950">
                    <img
                      src={story.authorAvatar}
                      alt={story.authorName}
                      referrerPolicy="no-referrer"
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                </div>
                {/* Category Icon Badge */}
                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 border border-amber-500/40 text-[10px] shadow-sm">
                  {categoryIcon}
                </div>
              </div>

              <span className="text-[11px] font-medium text-slate-200 group-hover:text-amber-400 transition-colors truncate max-w-[72px]">
                {story.authorName.split(' ')[0]}
              </span>
            </button>
          );
        })}

      </div>
    </div>
  );
};
