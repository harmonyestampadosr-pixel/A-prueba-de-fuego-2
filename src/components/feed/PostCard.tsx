import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Post, Comment, REACTION_CONFIGS, ReactionType } from '../../types';
import { CHRISTIAN_STICKERS } from '../../data/seedData';
import { subscribePostComments } from '../../firebase/db';
import { 
  Flame, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Eye, 
  MoreHorizontal, 
  CheckCircle2, 
  Send, 
  Smile, 
  Sparkles,
  ExternalLink,
  Flag,
  UserPlus,
  UserCheck
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  onComment?: (postId: string, content: string, sticker?: string) => Promise<void> | void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onComment }) => {
  const { 
    currentUser, 
    toggleReaction, 
    addComment, 
    incrementPostViews,
    followUser,
    savePost,
    reportPost,
    setSelectedUserId,
    setActiveTab
  } = useApp();

  const [showReactionsTray, setShowReactionsTray] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [liveComments, setLiveComments] = useState<Comment[]>([]);

  const userReactions = post.userReactions[currentUser.id] || [];
  const isFollowing = currentUser.followingIds.includes(post.authorId);
  const isSaved = currentUser.savedPostIds.includes(post.id);

  // Escuchar en tiempo real la subcolección 'comments' de Firestore cuando se abre la sección de comentarios
  useEffect(() => {
    if (!showComments) return;
    const unsubscribe = subscribePostComments(post.id, (comments) => {
      if (comments && comments.length > 0) {
        setLiveComments(comments);
      }
    });
    return () => unsubscribe();
  }, [showComments, post.id]);

  // Combinar comentarios locales con los obtenidos de la subcolección en Firestore evitando duplicados
  const commentsMap = new Map<string, Comment>();
  post.comments.forEach(c => commentsMap.set(c.id, c));
  liveComments.forEach(c => commentsMap.set(c.id, c));
  const displayComments = Array.from(commentsMap.values());

  // Compute total reactions
  const totalReactions = Object.values(post.reactions).reduce((a, b) => a + b, 0);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const text = commentText.trim();
    setCommentText('');
    if (onComment) {
      await onComment(post.id, text);
    } else {
      addComment(post.id, text);
    }
  };

  const handleStickerClick = async (stickerText: string) => {
    setShowStickerPicker(false);
    if (onComment) {
      await onComment(post.id, '', stickerText);
    } else {
      addComment(post.id, '', stickerText);
    }
  };

  const handleCardClick = () => {
    incrementPostViews(post.id);
  };

  return (
    <article 
      onClick={handleCardClick}
      className="w-full rounded-3xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 shadow-lg hover:border-slate-750 transition-all mb-4 relative"
    >
      {/* Recommendation Header if present */}
      {post.recommendationReason && (
        <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-medium mb-3 pb-2 border-b border-slate-800/80">
          <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span className="truncate">{post.recommendationReason}</span>
        </div>
      )}

      {/* Author Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setSelectedUserId(post.authorId);
              setActiveTab('perfil');
            }}
            className="relative shrink-0 focus:outline-none"
          >
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              referrerPolicy="no-referrer"
              className="h-11 w-11 rounded-2xl object-cover ring-2 ring-amber-500/40"
            />
            {post.authorIsOfficial && (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-slate-950 ring-1 ring-slate-900">
                ✓
              </span>
            )}
          </button>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => {
                  setSelectedUserId(post.authorId);
                  setActiveTab('perfil');
                }}
                className="text-xs sm:text-sm font-bold text-white hover:text-amber-400 transition-colors"
              >
                {post.authorName}
              </button>
              
              {/* Player Rating Points Display next to name */}
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-bold text-amber-300">
                <Flame className="h-3 w-3 text-orange-400 fill-orange-400" />
                <span className="tabular-nums">{post.authorPoints.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 flex-wrap">
              <span>@{post.authorUsername}</span>
              <span>·</span>
              <span>{post.createdAt}</span>
              {post.authorChurch && (
                <>
                  <span>·</span>
                  <span className="text-slate-400 truncate max-w-[160px] sm:max-w-xs">{post.authorChurch}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Options Menu & Follow */}
        <div className="flex items-center gap-1 relative">
          {post.authorId !== currentUser.id && (
            <button
              onClick={() => followUser(post.authorId)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                isFollowing 
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-750' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              }`}
            >
              {isFollowing ? 'Siguiendo' : '+ Seguir'}
            </button>
          )}

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 w-44 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl p-1.5 z-20">
              <button
                onClick={() => {
                  savePost(post.id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
              >
                <Bookmark className="h-3.5 w-3.5 text-amber-400" />
                <span>{isSaved ? 'Quitar de guardados' : 'Guardar publicación'}</span>
              </button>
              <button
                onClick={() => {
                  reportPost(post.id, 'Contenido inapropiado');
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
              >
                <Flag className="h-3.5 w-3.5" />
                <span>Reportar</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Text */}
      <p className="text-xs sm:text-sm text-slate-100 leading-relaxed whitespace-pre-line mb-3 font-normal">
        {post.content}
      </p>

      {/* Bible Verse Card */}
      {post.bibleVerse && (
        <div className="mb-3 p-3 rounded-2xl bg-amber-500/10 border-l-4 border-amber-500 text-amber-200">
          <p className="text-xs font-semibold italic leading-relaxed">
            {post.bibleVerse}
          </p>
        </div>
      )}

      {/* Official Source Link Banner */}
      {post.isOfficial && post.officialSource && (
        <div className="mb-3 flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/30 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="font-semibold text-white truncate">{post.officialSource.organization}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
              Fuente Oficial
            </span>
          </div>
          <a
            href={post.officialSource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-amber-400 hover:underline shrink-0 font-medium"
          >
            <span>Ver fuente</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      {/* Attached Media */}
      {post.imageUrl && (
        <div className="relative rounded-2xl overflow-hidden mb-3 max-h-[480px] bg-slate-950">
          <img
            src={post.imageUrl}
            alt="Post attachment"
            referrerPolicy="no-referrer"
            className="w-full h-auto object-cover max-h-[480px]"
          />
        </div>
      )}

      {post.videoUrl && (
        <div className="relative rounded-2xl overflow-hidden mb-3 max-h-[480px] bg-black">
          <video
            src={post.videoUrl}
            controls
            playsInline
            className="w-full h-auto max-h-[480px] rounded-2xl"
          />
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((tag, idx) => (
            <span key={idx} className="text-[11px] font-medium text-amber-400/80 hover:text-amber-300">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats Bar (Views & Reactions summary) */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 mb-2 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          {/* Reaction badges summary */}
          <div className="flex items-center -space-x-1">
            {REACTION_CONFIGS.slice(0, 3).map((r) => {
              if ((post.reactions[r.type] || 0) > 0) {
                return (
                  <span key={r.type} className="inline-block text-xs drop-shadow-sm">
                    {r.emoji}
                  </span>
                );
              }
              return null;
            })}
          </div>
          <span className="font-medium text-slate-300">
            {totalReactions > 0 ? `${totalReactions} reacciones` : 'Sé el primero en reaccionar'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5 text-slate-400" />
            <span className="tabular-nums">{post.viewsCount.toLocaleString()} vistas</span>
          </span>
          <button 
            onClick={() => setShowComments(!showComments)}
            className="hover:text-slate-200"
          >
            {post.comments.length} comentarios
          </button>
        </div>
      </div>

      {/* Action Buttons: Christian Reactions, Comment, Share */}
      <div className="relative flex items-center justify-between pt-1">
        
        {/* Christian Reactions Button with Hover / Click Popover */}
        <div className="relative">
          <button
            onClick={() => setShowReactionsTray(!showReactionsTray)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              userReactions.length > 0
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="text-base">
              {userReactions.length > 0 
                ? REACTION_CONFIGS.find(r => r.type === userReactions[0])?.emoji || '🔥' 
                : '🙏'}
            </span>
            <span>
              {userReactions.length > 0 
                ? REACTION_CONFIGS.find(r => r.type === userReactions[0])?.label 
                : 'Reaccionar'}
            </span>
          </button>

          {/* Christian Reactions Popover Tray */}
          {showReactionsTray && (
            <div className="absolute bottom-10 left-0 flex items-center gap-1 p-1.5 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-100">
              {REACTION_CONFIGS.map((r) => {
                const isSelected = userReactions.includes(r.type);
                const count = post.reactions[r.type] || 0;
                return (
                  <button
                    key={r.type}
                    onClick={() => {
                      toggleReaction(post.id, r.type);
                      setShowReactionsTray(false);
                    }}
                    className={`flex flex-col items-center p-1.5 rounded-xl transition-all transform hover:scale-125 ${
                      isSelected ? 'bg-amber-500/30 ring-1 ring-amber-400' : 'hover:bg-slate-800'
                    }`}
                    title={r.label}
                  >
                    <span className="text-lg leading-none">{r.emoji}</span>
                    <span className="text-[9px] font-bold text-slate-300 mt-1 whitespace-nowrap">
                      {r.label}
                    </span>
                    {count > 0 && (
                      <span className="text-[8px] text-amber-400 font-extrabold">{count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Comment Trigger */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Comentar</span>
        </button>

        {/* Share Button */}
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: post.authorName, text: post.content, url: window.location.href });
            } else {
              alert('¡Enlace de la publicación copiado al portapapeles!');
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
        >
          <Share2 className="h-4 w-4" />
          <span>Compartir</span>
        </button>

        {/* Save Bookmark */}
        <button
          onClick={() => savePost(post.id)}
          className={`p-1.5 rounded-xl transition-colors ${isSaved ? 'text-amber-400 bg-amber-500/15' : 'text-slate-400 hover:text-white'}`}
          title="Guardar"
        >
          <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-amber-400' : ''}`} />
        </button>
      </div>

      {/* Expanded Comments Section */}
      {showComments && (
        <div className="mt-4 pt-3 border-t border-slate-800 space-y-3">
          
          {/* Quick Christian Stickers Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Stickers:</span>
            {CHRISTIAN_STICKERS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleStickerClick(s.text)}
                className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-semibold text-white hover:border-amber-400 shrink-0 transition-all flex items-center gap-1 active:scale-95"
              >
                <span>{s.emoji}</span>
                <span>{s.text}</span>
              </button>
            ))}
          </div>

          {/* New Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
            <img
              src={currentUser.avatar}
              alt="Tu avatar"
              referrerPolicy="no-referrer"
              className="h-7 w-7 rounded-full object-cover ring-1 ring-amber-500"
            />
            <div className="relative flex-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Escribe un mensaje de edificación o bendición..."
                className="w-full px-3.5 py-2 rounded-full bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 pr-16"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="absolute right-1.5 top-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold hover:bg-amber-400 transition-colors disabled:opacity-40"
              >
                Enviar
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {displayComments.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-2">
                Aún no hay comentarios. ¡Sé el primero en animar a tu hermano en la fe!
              </p>
            ) : (
              displayComments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2.5 bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800/80">
                  <img
                    src={comment.authorAvatar}
                    alt={comment.authorName}
                    referrerPolicy="no-referrer"
                    className="h-6 w-6 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{comment.authorName}</span>
                      <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                    </div>

                    {comment.sticker ? (
                      <div className="inline-block mt-1 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-xs font-bold text-amber-300">
                        {comment.sticker}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-300 mt-0.5">{comment.content}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </article>
  );
};
