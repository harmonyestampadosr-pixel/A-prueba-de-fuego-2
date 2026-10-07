import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Post, 
  Story, 
  Challenge, 
  ChallengeSubmission, 
  EventItem, 
  OfficialSource, 
  PrayerRequest, 
  Testimonial, 
  Church, 
  NotificationItem, 
  ChatConversation, 
  ChatMessage, 
  ReactionType,
  SubmissionStatus,
  Badge
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_POSTS, 
  INITIAL_STORIES, 
  INITIAL_CHALLENGES, 
  INITIAL_SUBMISSIONS, 
  INITIAL_EVENTS, 
  OFFICIAL_SOURCES, 
  INITIAL_PRAYER_REQUESTS, 
  INITIAL_TESTIMONIALS, 
  INITIAL_CHURCHES, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_MESSAGES,
  calculateLevel,
  INITIAL_BADGES,
  ADMIN_USER
} from '../data/seedData';
import confetti from 'canvas-confetti';
import {
  initializeFirestoreData,
  createPostInFirestore,
  updatePostInFirestore,
  deletePostInFirestore,
  getPostsFromFirestore,
  createChallengeInFirestore,
  updateChallengeInFirestore,
  deleteChallengeInFirestore,
  getChallengesFromFirestore,
  createSubmissionInFirestore,
  updateSubmissionStatusInFirestore,
  deleteSubmissionInFirestore,
  getSubmissionsFromFirestore,
  createEventInFirestore,
  updateEventInFirestore,
  deleteEventInFirestore,
  getEventsFromFirestore,
  createPrayerInFirestore,
  updatePrayerInFirestore,
  deletePrayerInFirestore,
  getPrayersFromFirestore,
  createTestimonialInFirestore,
  updateTestimonialInFirestore,
  deleteTestimonialInFirestore,
  getTestimonialsFromFirestore,
  saveUserToFirestore,
  updateUserInFirestore,
  getAllUsersFromFirestore,
  createStoryInFirestore,
  createCommentInFirestore,
  saveReactionInFirestore,
  deleteReactionInFirestore,
  createMessageInFirestore,
  createGameScoreInFirestore,
  createReportInFirestore,
  saveDailyChallengeRewardInFirestore
} from '../firebase/firestoreService';

export type TabType = 
  | 'inicio' 
  | 'descubrir' 
  | 'retos' 
  | 'eventos' 
  | 'perfil' 
  | 'chat' 
  | 'oracion' 
  | 'juegos' 
  | 'canales' 
  | 'ranking' 
  | 'oficial' 
  | 'admin' 
  | 'iglesias' 
  | 'notificaciones'
  | 'onboarding'
  | 'cine'
  | 'actividades'
  | 'materiales';

interface AppContextType {
  currentUser: User;
  allUsers: User[];
  setAllUsers: React.Dispatch<React.SetStateAction<User[]>>;
  posts: Post[];
  stories: Story[];
  challenges: Challenge[];
  submissions: ChallengeSubmission[];
  events: EventItem[];
  officialSources: OfficialSource[];
  prayerRequests: PrayerRequest[];
  testimonials: Testimonial[];
  churches: Church[];
  notifications: NotificationItem[];
  conversations: ChatConversation[];
  messages: Record<string, ChatMessage[]>;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;
  viewingSubmissionId: string | null;
  setViewingSubmissionId: (id: string | null) => void;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  
  // Actions
  loginAs: (userId: string) => void;
  registerUser: (userData: Partial<User>) => void;
  createPost: (post: Partial<Post>) => void;
  toggleReaction: (postId: string, reaction: ReactionType) => void;
  addComment: (postId: string, content: string, sticker?: string) => void;
  incrementPostViews: (postId: string) => void;
  createStory: (story: Partial<Story>) => void;
  submitChallengeEvidence: (submission: Omit<ChallengeSubmission, 'id' | 'status' | 'submittedAt'>) => void;
  adminReviewSubmission: (submissionId: string, status: SubmissionStatus, feedback?: string, pointsOverride?: number) => void;
  adminCreateChallenge: (challenge: Omit<Challenge, 'id' | 'participantsCount'>) => void;
  adminCreateEvent: (event: Omit<EventItem, 'id' | 'interestedCount' | 'attendingCount'>) => void;
  toggleEventParticipation: (eventId: string, type: 'attend' | 'interest') => void;
  prayForRequest: (requestId: string) => void;
  createPrayerRequest: (request: Omit<PrayerRequest, 'id' | 'authorId' | 'authorName' | 'authorUsername' | 'authorAvatar' | 'authorChurch' | 'prayingCount' | 'prayingUserIds' | 'createdAt' | 'isAnswered'>) => void;
  markPrayerAnswered: (requestId: string, testimony: string) => void;
  createTestimonial: (testimonial: Omit<Testimonial, 'id' | 'authorId' | 'authorName' | 'authorUsername' | 'authorAvatar' | 'authorChurch' | 'date' | 'amenCount' | 'praisedUserIds'>) => void;
  sendMessage: (conversationId: string, content: string, sticker?: string, isVoiceNote?: boolean) => void;
  followUser: (targetUserId: string) => void;
  awardQuizPoints: (points: number, reason: string) => void;
  savePost: (postId: string) => void;
  reportPost: (postId: string, reason: string) => void;
  deletePost: (postId: string) => void;
  deleteChallenge: (challengeId: string) => void;
  deleteEvent: (eventId: string) => void;
  deletePrayerRequest: (prayerId: string) => void;
  deleteTestimonial: (testId: string) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  markAllNotificationsRead: () => void;
  triggerCelebration: () => void;
  completeDailyChallenge: (badge: Badge, points: number, challengeId: string, reflection?: string) => Promise<{ updatedUser: User; badge: Badge }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state or default
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('apdf_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('apdf_current_user_id') || 'user_david';
  });

  const currentUser = allUsers.find(u => u.id === currentUserId) || allUsers[1] || INITIAL_USERS[1];

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('apdf_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('apdf_stories');
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem('apdf_challenges');
    return saved ? JSON.parse(saved) : INITIAL_CHALLENGES;
  });

  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>(() => {
    const saved = localStorage.getItem('apdf_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('apdf_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [officialSources] = useState<OfficialSource[]>(OFFICIAL_SOURCES);

  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>(() => {
    const saved = localStorage.getItem('apdf_prayers');
    return saved ? JSON.parse(saved) : INITIAL_PRAYER_REQUESTS;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('apdf_testimonials');
    return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
  });

  const [churches] = useState<Church[]>(INITIAL_CHURCHES);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('apdf_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    const saved = localStorage.getItem('apdf_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('apdf_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [activeTab, setActiveTab] = useState<TabType>('inicio');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [viewingSubmissionId, setViewingSubmissionId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('apdf_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('apdf_current_user_id', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('apdf_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('apdf_stories', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem('apdf_challenges', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem('apdf_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('apdf_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('apdf_prayers', JSON.stringify(prayerRequests));
  }, [prayerRequests]);

  useEffect(() => {
    localStorage.setItem('apdf_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('apdf_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('apdf_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('apdf_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Synchronize with Cloud Firestore on mount
  useEffect(() => {
    const initAndSyncFirestore = async () => {
      await initializeFirestoreData();
      try {
        const [cloudPosts, cloudChallenges, cloudEvents, cloudPrayers, cloudTestimonials, cloudSubmissions, cloudUsers] = await Promise.all([
          getPostsFromFirestore(),
          getChallengesFromFirestore(),
          getEventsFromFirestore(),
          getPrayersFromFirestore(),
          getTestimonialsFromFirestore(),
          getSubmissionsFromFirestore(),
          getAllUsersFromFirestore(),
        ]);

        if (cloudPosts.length > 0) setPosts(cloudPosts);
        if (cloudChallenges.length > 0) setChallenges(cloudChallenges);
        if (cloudEvents.length > 0) setEvents(cloudEvents);
        if (cloudPrayers.length > 0) setPrayerRequests(cloudPrayers);
        if (cloudTestimonials.length > 0) setTestimonials(cloudTestimonials);
        if (cloudSubmissions.length > 0) setSubmissions(cloudSubmissions);
        if (cloudUsers.length > 0) {
          setAllUsers((prev: User[]) => {
            const combined = [...cloudUsers];
            prev.forEach(p => {
              if (!combined.some(c => c.id === p.id)) combined.push(p);
            });
            return combined;
          });
        }
      } catch (err) {
        console.warn('Firestore initial sync fallback to local cache:', err);
      }
    };

    initAndSyncFirestore();
  }, []);

  // Dark mode class toggle
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ef4444', '#f97316', '#fbbf24', '#ffffff']
      });
    } catch {
      // Safe fallback
    }
  };

  const loginAs = (userId: string) => {
    setCurrentUserId(userId);
  };

  const registerUser = (userData: Partial<User>) => {
    const newId = `user_${Date.now()}`;
    const levelInfo = calculateLevel(0);
    const newUser: User = {
      id: newId,
      name: userData.name || 'Joven',
      lastName: userData.lastName || 'Cristiano',
      username: (userData.username || `joven_${Date.now()}`).toLowerCase().replace(/\s+/g, '_'),
      email: userData.email || 'joven@ejemplo.com',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
      age: userData.age || 18,
      birthDate: userData.birthDate || '2008-01-01',
      city: userData.city || 'Bogotá',
      country: userData.country || 'Colombia',
      church: userData.church || 'Iglesia Adventista Central',
      district: userData.district || 'Distrito Central',
      zone: userData.zone || 'Zona 1',
      isAdventist: userData.isAdventist ?? true,
      yearsServing: userData.yearsServing || 1,
      ministries: userData.ministries || ['Ministerio Juvenil JA'],
      activities: userData.activities || ['trabajar_jovenes'],
      maritalStatus: userData.maritalStatus || 'soltero',
      interests: userData.interests || ['Biblia', 'Música', 'Misión'],
      bio: userData.bio || '¡Comenzando mi aventura en A Prueba de Fuego con 00 puntos para la gloria de Dios!',
      points: 0,
      level: levelInfo.level,
      levelName: levelInfo.name,
      role: 'user',
      isOfficialVerified: false,
      badges: [],
      stats: {
        challengesCompleted: 0,
        eventsAttended: 0,
        missionsDone: 0,
        badgesCount: 0,
        prayerStreak: 1,
        bibleReadingStreak: 1,
        activeStreakDays: 1,
      },
      privacy: {
        isProfilePublic: true,
        showLocation: true,
        allowDirectMessages: true,
        allowPrayerMentions: true,
      },
      followingIds: ['admin_official'],
      followerIds: [],
      savedPostIds: [],
      joinedEventIds: [],
    };

    setAllUsers(prev => [newUser, ...prev]);
    setCurrentUserId(newId);
    setActiveTab('inicio');
    triggerCelebration();

    // Persist user to Firestore
    saveUserToFirestore(newUser).catch(e => console.warn('Cloud user save fallback:', e));

    // Welcome notification
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        type: 'challenge_new',
        title: '¡Bienvenido a A Prueba de Fuego!',
        message: 'Tu aventura comienza con 00 puntos. Participa en retos y eventos para forjar tu carácter.',
        read: false,
        createdAt: 'Hace un momento',
      },
      ...prev
    ]);
  };

  const createPost = (newPostData: Partial<Post>) => {
    const newPost: Post = {
      id: `p_${Date.now()}`,
      authorId: currentUser.id,
      authorName: `${currentUser.name} ${currentUser.lastName}`.trim(),
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      authorPoints: currentUser.points,
      authorIsOfficial: currentUser.isOfficialVerified,
      authorChurch: currentUser.church,
      authorLevel: currentUser.level,
      createdAt: 'Justo ahora',
      content: newPostData.content || '',
      imageUrl: newPostData.imageUrl,
      videoUrl: newPostData.videoUrl,
      bibleVerse: newPostData.bibleVerse,
      tags: newPostData.tags || ['AbaPadre', 'JuventudAdventista'],
      viewsCount: 1,
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
      isOfficial: currentUser.role === 'superadmin' || currentUser.role === 'admin',
    };

    setPosts(prev => [newPost, ...prev]);
    createPostInFirestore(newPost).catch(e => console.warn('Firestore post creation fallback:', e));
    triggerCelebration();
  };

  const toggleReaction = (postId: string, reaction: ReactionType) => {
    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;
      
      const currentList = post.userReactions[currentUser.id] || [];
      const hasReaction = currentList.includes(reaction);

      const nextList = hasReaction 
        ? currentList.filter(r => r !== reaction)
        : [...currentList, reaction];

      const diff = hasReaction ? -1 : 1;
      const newCount = Math.max(0, (post.reactions[reaction] || 0) + diff);

      const updatedReactions = {
        ...post.reactions,
        [reaction]: newCount,
      };

      const updatedUserReactions = {
        ...post.userReactions,
        [currentUser.id]: nextList,
      };

      updatePostInFirestore(postId, {
        reactions: updatedReactions,
        userReactions: updatedUserReactions
      }).catch(e => console.warn('Firestore update reaction fallback:', e));

      // Sync reaction record
      if (!hasReaction) {
        saveReactionInFirestore({
          id: `react_${postId}_${currentUser.id}_${reaction}`,
          postId,
          userId: currentUser.id,
          userName: `${currentUser.name} ${currentUser.lastName}`.trim(),
          type: reaction,
          createdAt: new Date().toISOString()
        }).catch(e => console.warn('Firestore reaction save fallback:', e));
      } else {
        deleteReactionInFirestore(`react_${postId}_${currentUser.id}_${reaction}`)
          .catch(e => console.warn('Firestore reaction delete fallback:', e));
      }

      return {
        ...post,
        reactions: updatedReactions,
        userReactions: updatedUserReactions,
      };
    }));
  };

  const addComment = (postId: string, content: string, sticker?: string) => {
    const newComment = {
      id: `c_${Date.now()}`,
      authorId: currentUser.id,
      authorName: `${currentUser.name} ${currentUser.lastName}`.trim(),
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      content,
      sticker,
      createdAt: 'Hace un momento',
      likes: 0,
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextComments = [...p.comments, newComment];
        updatePostInFirestore(postId, { comments: nextComments })
          .catch(e => console.warn('Firestore comment fallback:', e));
        createCommentInFirestore(newComment, postId)
          .catch(e => console.warn('Firestore create comment fallback:', e));
        return {
          ...p,
          comments: nextComments,
        };
      }
      return p;
    }));
  };

  const incrementPostViews = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const newViews = p.viewsCount + 1;
        updatePostInFirestore(postId, { viewsCount: newViews })
          .catch(e => console.warn('Firestore view counter fallback:', e));
        return { ...p, viewsCount: newViews };
      }
      return p;
    }));
  };

  const createStory = (storyData: Partial<Story>) => {
    const newStory: Story = {
      id: `st_${Date.now()}`,
      authorId: currentUser.id,
      authorName: `${currentUser.name} ${currentUser.lastName}`.trim(),
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      category: storyData.category || 'reflexion',
      mediaUrl: storyData.mediaUrl || 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=800&auto=format&fit=crop&q=80',
      textContent: storyData.textContent,
      bibleVerse: storyData.bibleVerse,
      createdAt: 'Hace un momento',
      expiresAt: '24h restantes',
      viewsCount: 1,
    };

    setStories(prev => [newStory, ...prev]);
    createStoryInFirestore(newStory).catch(e => console.warn('Firestore create story fallback:', e));
  };

  const submitChallengeEvidence = (submissionData: Omit<ChallengeSubmission, 'id' | 'status' | 'submittedAt'>) => {
    const newSub: ChallengeSubmission = {
      ...submissionData,
      id: `sub_${Date.now()}`,
      status: 'pending',
      submittedAt: 'Justo ahora',
    };

    setSubmissions(prev => [newSub, ...prev]);

    // Persist to Cloud Firestore
    createSubmissionInFirestore(newSub).catch(e => console.warn('Firestore submission fallback:', e));

    // Send notification
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        type: 'challenge_approved',
        title: 'Evidencia enviada a revisión',
        message: `Tu evidencia para "${submissionData.challengeTitle}" ha sido registrada. Espera la certificación del moderador.`,
        read: false,
        createdAt: 'Hace un momento',
      },
      ...prev
    ]);
  };

  const completeDailyChallenge = async (
    badge: Badge,
    points: number,
    challengeId: string,
    reflection?: string
  ): Promise<{ updatedUser: User; badge: Badge }> => {
    const nextPoints = currentUser.points + points;
    const nextLevel = calculateLevel(nextPoints);
    const updatedBadges = [...currentUser.badges];
    
    if (!updatedBadges.some(b => b.id === badge.id)) {
      updatedBadges.push({
        ...badge,
        unlockedAt: new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
      });
    }

    // Milestone: Primer reto
    if (!updatedBadges.some(b => b.id === 'b1')) {
      updatedBadges.push(INITIAL_BADGES[0]);
    }
    // Milestone: 1,000 puntos
    if (nextPoints >= 1000 && !updatedBadges.some(b => b.id === 'b10')) {
      updatedBadges.push(INITIAL_BADGES[9]);
    }

    const updatedStats = {
      ...currentUser.stats,
      challengesCompleted: currentUser.stats.challengesCompleted + 1,
      badgesCount: updatedBadges.length,
      activeStreakDays: currentUser.stats.activeStreakDays + 1,
    };

    const updatedUser: User = {
      ...currentUser,
      points: nextPoints,
      level: nextLevel.level,
      levelName: nextLevel.name,
      badges: updatedBadges,
      stats: updatedStats,
    };

    // 1. Actualizar estado local
    setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

    // 2. Guardar en Cloud Firestore (Usuario, Subcolección de Badges, Logro global y Submission aprobada)
    saveDailyChallengeRewardInFirestore(
      currentUser.id,
      updatedUser,
      badge,
      points,
      challengeId
    ).catch(e => console.warn('Error al persistir reto diario en Firestore:', e));

    // 3. Añadir a submissions aprobadas localmente
    const newSubmission: ChallengeSubmission = {
      id: `sub_daily_${currentUser.id}_${Date.now()}`,
      challengeId,
      challengeTitle: badge.name,
      challengePoints: points,
      userId: currentUser.id,
      userName: `${currentUser.name} ${currentUser.lastName}`.trim(),
      userUsername: currentUser.username,
      userAvatar: currentUser.avatar,
      userChurch: currentUser.church,
      date: new Date().toISOString().split('T')[0],
      approximateLocation: currentUser.city || 'Buenaventura, Colombia',
      commentReflection: reflection || `¡Reto diario completado con éxito! Desbloqueada la insignia virtual: ${badge.name}`,
      mediaType: 'photo',
      mediaUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
      status: 'approved',
      submittedAt: 'Justo ahora',
      reviewedAt: 'Justo ahora',
      reviewedBy: 'Sistema de Recompensas JA',
    };
    setSubmissions(prev => [newSubmission, ...prev]);

    // 4. Notificación de logro
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        type: 'badge_earned',
        title: `¡Nueva Insignia Virtual: ${badge.name}!`,
        message: `Has completado el reto diario. Ganaste +${points} puntos y desbloqueaste la insignia "${badge.name}". Progreso guardado en Firestore.`,
        read: false,
        createdAt: 'Hace un momento',
      },
      ...prev
    ]);

    triggerCelebration();

    return { updatedUser, badge };
  };

  const adminReviewSubmission = (submissionId: string, status: SubmissionStatus, feedback?: string, pointsOverride?: number) => {
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub) return;

    const awardedPoints = pointsOverride ?? sub.challengePoints;

    setSubmissions(prev => prev.map(s => {
      if (s.id === submissionId) {
        return {
          ...s,
          status,
          adminFeedback: feedback || (status === 'approved' ? `¡Evidencia verificada y aprobada por moderación! +${awardedPoints} puntos.` : 'Revisión actualizada.'),
          reviewedAt: 'Hace un momento',
          reviewedBy: currentUser.name,
        };
      }
      return s;
    }));

    // Update in Cloud Firestore
    updateSubmissionStatusInFirestore(submissionId, status, feedback, currentUser.name)
      .catch(e => console.warn('Firestore update submission status fallback:', e));

    if (status === 'approved') {
      // Award points to the user who submitted
      let updatedUserToSync: User | null = null;
      setAllUsers(prev => prev.map(u => {
        if (u.id === sub.userId) {
          const nextPoints = u.points + awardedPoints;
          const nextLevel = calculateLevel(nextPoints);
          const hadFirstChallengeBadge = u.badges.some(b => b.id === 'b1');
          const updatedBadges = [...u.badges];
          if (!hadFirstChallengeBadge) {
            updatedBadges.push(INITIAL_BADGES[0]);
          }
          if (nextPoints >= 1000 && !u.badges.some(b => b.id === 'b10')) {
            updatedBadges.push(INITIAL_BADGES[9]);
          }

          const updatedUser: User = {
            ...u,
            points: nextPoints,
            level: nextLevel.level,
            levelName: nextLevel.name,
            badges: updatedBadges,
            stats: {
              ...u.stats,
              challengesCompleted: u.stats.challengesCompleted + 1,
              badgesCount: updatedBadges.length,
            }
          };
          updatedUserToSync = updatedUser;
          return updatedUser;
        }
        return u;
      }));

      if (updatedUserToSync) {
        saveUserToFirestore(updatedUserToSync).catch(e => console.warn('Firestore award points fallback:', e));
      }

      // Add notification for the user
      setNotifications(prev => [
        {
          id: `notif_${Date.now()}`,
          type: 'challenge_approved',
          title: '✅ ¡Reto Aprobado por el Administrador!',
          message: `Tu reto "${sub.challengeTitle}" fue verificado exitosamente. ¡Ganaste +${awardedPoints} puntos!`,
          read: false,
          createdAt: 'Hace un momento',
          pointsAwarded: awardedPoints,
        },
        ...prev
      ]);

      triggerCelebration();
    }
  };

  const adminCreateChallenge = (challengeData: Omit<Challenge, 'id' | 'participantsCount'>) => {
    const newChallenge: Challenge = {
      ...challengeData,
      id: `ch_${Date.now()}`,
      participantsCount: 1,
    };
    setChallenges(prev => [newChallenge, ...prev]);
    createChallengeInFirestore(newChallenge).catch(e => console.warn('Firestore challenge fallback:', e));
  };

  const adminCreateEvent = (eventData: Omit<EventItem, 'id' | 'interestedCount' | 'attendingCount'>) => {
    const newEvent: EventItem = {
      ...eventData,
      id: `ev_${Date.now()}`,
      interestedCount: 0,
      attendingCount: 0,
      isAttending: false,
      isInterested: false,
    };
    setEvents(prev => [newEvent, ...prev]);
    createEventInFirestore(newEvent).catch(e => console.warn('Firestore event fallback:', e));
  };

  const toggleEventParticipation = (eventId: string, type: 'attend' | 'interest') => {
    let newAttending = 0;
    let newInterested = 0;

    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;
      if (type === 'attend') {
        const nextAttending = !ev.isAttending;
        newAttending = ev.attendingCount + (nextAttending ? 1 : -1);
        newInterested = ev.interestedCount;
        return {
          ...ev,
          isAttending: nextAttending,
          attendingCount: newAttending,
        };
      } else {
        const nextInterested = !ev.isInterested;
        newInterested = ev.interestedCount + (nextInterested ? 1 : -1);
        newAttending = ev.attendingCount;
        return {
          ...ev,
          isInterested: nextInterested,
          interestedCount: newInterested,
        };
      }
    }));

    updateEventInFirestore(eventId, { attendingCount: Math.max(0, newAttending), interestedCount: Math.max(0, newInterested) })
      .catch(e => console.warn('Firestore event update fallback:', e));
  };

  const prayForRequest = (requestId: string) => {
    let nextCount = 0;
    setPrayerRequests(prev => prev.map(pr => {
      if (pr.id !== requestId) return pr;
      const alreadyPraying = pr.prayingUserIds.includes(currentUser.id);
      const nextUserIds = alreadyPraying 
        ? pr.prayingUserIds.filter(id => id !== currentUser.id)
        : [...pr.prayingUserIds, currentUser.id];
      
      nextCount = nextUserIds.length;
      return {
        ...pr,
        prayingCount: nextCount,
        prayingUserIds: nextUserIds,
      };
    }));

    updatePrayerInFirestore(requestId, { prayingCount: nextCount })
      .catch(e => console.warn('Firestore pray update fallback:', e));
  };

  const createPrayerRequest = (data: Omit<PrayerRequest, 'id' | 'authorId' | 'authorName' | 'authorUsername' | 'authorAvatar' | 'authorChurch' | 'prayingCount' | 'prayingUserIds' | 'createdAt' | 'isAnswered'>) => {
    const newReq: PrayerRequest = {
      ...data,
      id: `pr_${Date.now()}`,
      authorId: currentUser.id,
      authorName: `${currentUser.name} ${currentUser.lastName}`.trim(),
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      authorChurch: currentUser.church,
      isAnswered: false,
      prayingCount: 1,
      prayingUserIds: [currentUser.id],
      createdAt: 'Justo ahora',
    };
    setPrayerRequests(prev => [newReq, ...prev]);
    createPrayerInFirestore(newReq).catch(e => console.warn('Firestore prayer fallback:', e));
  };

  const markPrayerAnswered = (requestId: string, testimony: string) => {
    setPrayerRequests(prev => prev.map(pr => {
      if (pr.id === requestId) {
        return {
          ...pr,
          isAnswered: true,
          testimony,
        };
      }
      return pr;
    }));

    updatePrayerInFirestore(requestId, { isAnswered: true, testimony })
      .catch(e => console.warn('Firestore mark answered fallback:', e));

    // Also publish into testimonials automatically!
    const target = prayerRequests.find(p => p.id === requestId);
    if (target) {
      const newTestimonial: Testimonial = {
        id: `t_${Date.now()}`,
        authorId: target.authorId,
        authorName: target.authorName,
        authorUsername: target.authorUsername,
        authorAvatar: target.authorAvatar,
        authorChurch: target.authorChurch,
        title: `Respuesta a la oración: ${target.title}`,
        story: testimony,
        category: 'oracion_respondida',
        date: 'Hoy',
        amenCount: 1,
        praisedUserIds: [currentUser.id],
      };
      setTestimonials(prev => [newTestimonial, ...prev]);
      createTestimonialInFirestore(newTestimonial).catch(e => console.warn('Firestore testimonial fallback:', e));
    }
  };

  const createTestimonial = (data: Omit<Testimonial, 'id' | 'authorId' | 'authorName' | 'authorUsername' | 'authorAvatar' | 'authorChurch' | 'date' | 'amenCount' | 'praisedUserIds'>) => {
    const newT: Testimonial = {
      ...data,
      id: `t_${Date.now()}`,
      authorId: currentUser.id,
      authorName: `${currentUser.name} ${currentUser.lastName}`.trim(),
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      authorChurch: currentUser.church,
      date: 'Hoy',
      amenCount: 1,
      praisedUserIds: [currentUser.id],
    };
    setTestimonials(prev => [newT, ...prev]);
    createTestimonialInFirestore(newT).catch(e => console.warn('Firestore testimonial fallback:', e));
  };

  const sendMessage = (conversationId: string, content: string, sticker?: string, isVoiceNote?: boolean) => {
    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      senderId: currentUser.id,
      senderName: `${currentUser.name} ${currentUser.lastName}`.trim(),
      senderAvatar: currentUser.avatar,
      content,
      sticker,
      isVoiceNote,
      voiceDuration: isVoiceNote ? '0:18' : undefined,
      timestamp: 'Ahora',
    };

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    // Persist to Cloud Firestore
    createMessageInFirestore(newMsg, conversationId)
      .catch(e => console.warn('Firestore send message fallback:', e));

    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessage: sticker ? `Sticker: ${sticker}` : content,
          lastMessageTime: 'Ahora',
        };
      }
      return c;
    }));
  };

  const followUser = (targetUserId: string) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const isFollowing = u.followingIds.includes(targetUserId);
        return {
          ...u,
          followingIds: isFollowing 
            ? u.followingIds.filter(id => id !== targetUserId)
            : [...u.followingIds, targetUserId],
        };
      }
      if (u.id === targetUserId) {
        const isFollower = u.followerIds.includes(currentUser.id);
        return {
          ...u,
          followerIds: isFollower 
            ? u.followerIds.filter(id => id !== currentUser.id)
            : [...u.followerIds, currentUser.id],
        };
      }
      return u;
    }));
  };

  const awardQuizPoints = (points: number, reason: string) => {
    let updatedUserToSync: User | null = null;
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const nextPoints = u.points + points;
        const nextLevel = calculateLevel(nextPoints);
        const updated: User = {
          ...u,
          points: nextPoints,
          level: nextLevel.level,
          levelName: nextLevel.name,
        };
        updatedUserToSync = updated;
        return updated;
      }
      return u;
    }));

    if (updatedUserToSync) {
      saveUserToFirestore(updatedUserToSync).catch(e => console.warn('Firestore user points fallback:', e));
    }

    // Persist Game Score
    createGameScoreInFirestore({
      id: `score_${Date.now()}`,
      gameId: 'quiz_general',
      gameTitle: reason,
      userId: currentUser.id,
      userName: `${currentUser.name} ${currentUser.lastName}`.trim(),
      userAvatar: currentUser.avatar,
      score: points,
      pointsAwarded: points,
      correctAnswers: 1,
      totalQuestions: 1,
      playedAt: new Date().toISOString()
    }).catch(e => console.warn('Firestore game score fallback:', e));

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        type: 'badge_earned',
        title: '¡Puntos ganados en Juego Bíblico!',
        message: `Acabas de ganar +${points} puntos por completar "${reason}".`,
        read: false,
        createdAt: 'Hace un momento',
        pointsAwarded: points,
      },
      ...prev
    ]);

    triggerCelebration();
  };

  const savePost = (postId: string) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const isSaved = u.savedPostIds.includes(postId);
        return {
          ...u,
          savedPostIds: isSaved 
            ? u.savedPostIds.filter(id => id !== postId)
            : [...u.savedPostIds, postId],
        };
      }
      return u;
    }));
  };

  const reportPost = (postId: string, reason: string) => {
    // Persist Report to Cloud Firestore
    createReportInFirestore({
      id: `rep_${Date.now()}`,
      reporterId: currentUser.id,
      targetType: 'post',
      targetId: postId,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString()
    }).catch(e => console.warn('Firestore report fallback:', e));

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        type: 'comment',
        title: 'Publicación reportada para moderación',
        message: `El reporte por "${reason}" fue recibido por nuestro equipo de seguridad juvenil.`,
        read: false,
        createdAt: 'Justo ahora',
      },
      ...prev
    ]);
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    deletePostInFirestore(postId).catch(e => console.warn('Firestore delete post fallback:', e));
  };

  const deleteChallenge = (challengeId: string) => {
    setChallenges(prev => prev.filter(c => c.id !== challengeId));
    deleteChallengeInFirestore(challengeId).catch(e => console.warn('Firestore delete challenge fallback:', e));
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    deleteEventInFirestore(eventId).catch(e => console.warn('Firestore delete event fallback:', e));
  };

  const deletePrayerRequest = (prayerId: string) => {
    setPrayerRequests(prev => prev.filter(p => p.id !== prayerId));
    deletePrayerInFirestore(prayerId).catch(e => console.warn('Firestore delete prayer fallback:', e));
  };

  const deleteTestimonial = (testId: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== testId));
    deleteTestimonialInFirestore(testId).catch(e => console.warn('Firestore delete testimonial fallback:', e));
  };

  const updateUserProfile = (updates: Partial<User>) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, ...updates };
      }
      return u;
    }));
    updateUserInFirestore(currentUser.id, updates).catch(e => console.warn('Firestore update profile fallback:', e));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      allUsers,
      setAllUsers,
      posts,
      stories,
      challenges,
      submissions,
      events,
      officialSources,
      prayerRequests,
      testimonials,
      churches,
      notifications,
      conversations,
      messages,
      activeTab,
      setActiveTab,
      selectedUserId,
      setSelectedUserId,
      viewingSubmissionId,
      setViewingSubmissionId,
      activeConversationId,
      setActiveConversationId,
      isDarkMode,
      setIsDarkMode,
      loginAs,
      registerUser,
      createPost,
      toggleReaction,
      addComment,
      incrementPostViews,
      createStory,
      submitChallengeEvidence,
      adminReviewSubmission,
      adminCreateChallenge,
      adminCreateEvent,
      toggleEventParticipation,
      prayForRequest,
      createPrayerRequest,
      markPrayerAnswered,
      createTestimonial,
      sendMessage,
      followUser,
      awardQuizPoints,
      savePost,
      reportPost,
      deletePost,
      deleteChallenge,
      deleteEvent,
      deletePrayerRequest,
      deleteTestimonial,
      updateUserProfile,
      markAllNotificationsRead,
      triggerCelebration,
      completeDailyChallenge,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
