export type ReactionType = 
  | 'amen' 
  | 'aleluya' 
  | 'gloriaDios' 
  | 'diosEsBueno' 
  | 'bendiciones' 
  | 'estoyOrando' 
  | 'meInspiro';

export interface ReactionConfig {
  type: ReactionType;
  label: string;
  emoji: string;
  bgActive: string;
  textActive: string;
}

export const REACTION_CONFIGS: ReactionConfig[] = [
  { type: 'amen', label: 'Amén', emoji: '🙏', bgActive: 'bg-amber-500/20 border-amber-500/40', textActive: 'text-amber-400' },
  { type: 'aleluya', label: 'Aleluya', emoji: '🔥', bgActive: 'bg-orange-500/20 border-orange-500/40', textActive: 'text-orange-400' },
  { type: 'gloriaDios', label: 'Gloria a Dios', emoji: '❤️', bgActive: 'bg-rose-500/20 border-rose-500/40', textActive: 'text-rose-400' },
  { type: 'diosEsBueno', label: 'Dios es Bueno', emoji: '🙌', bgActive: 'bg-emerald-500/20 border-emerald-500/40', textActive: 'text-emerald-400' },
  { type: 'bendiciones', label: 'Bendiciones', emoji: '💪', bgActive: 'bg-blue-500/20 border-blue-500/40', textActive: 'text-blue-400' },
  { type: 'estoyOrando', label: 'Estoy Orando', emoji: '🙏', bgActive: 'bg-purple-500/20 border-purple-500/40', textActive: 'text-purple-400' },
  { type: 'meInspiro', label: 'Me Inspiró', emoji: '✨', bgActive: 'bg-yellow-500/20 border-yellow-500/40', textActive: 'text-yellow-400' },
];

export interface Badge {
  id: string;
  name: string;
  icon: string;
  imageUrl?: string;
  description: string;
  category: 'reto' | 'servicio' | 'fe' | 'puntos' | 'liderazgo';
  unlockedAt?: string;
}

export interface UserStats {
  challengesCompleted: number;
  eventsAttended: number;
  missionsDone: number;
  badgesCount: number;
  prayerStreak: number;
  bibleReadingStreak: number;
  activeStreakDays: number;
}

export interface UserPrivacy {
  isProfilePublic: boolean;
  showLocation: boolean;
  allowDirectMessages: boolean;
  allowPrayerMentions: boolean;
}

export interface User {
  id: string;
  name: string;
  lastName: string;
  username: string;
  email: string;
  avatar: string;
  coverImage?: string;
  age: number;
  birthDate: string;
  city: string;
  state?: string;
  country: string;
  
  // Church and Ministry info
  church: string;
  district: string;
  zone: string;
  isAdventist: boolean;
  yearsServing: number;
  ministries: string[];
  activities: string[];
  maritalStatus: 'soltero' | 'casado';
  interests: string[];
  bio: string;
  
  // Gamification & Role
  points: number;
  level: number;
  levelName: string;
  role: 'superadmin' | 'admin' | 'moderator' | 'organizer' | 'user';
  isOfficialVerified: boolean;
  badges: Badge[];
  stats: UserStats;
  privacy: UserPrivacy;
  
  // Social
  followingIds: string[];
  followerIds: string[];
  savedPostIds: string[];
  joinedEventIds: string[];
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  content: string;
  sticker?: string;
  createdAt: string;
  likes: number;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorPoints: number;
  authorIsOfficial: boolean;
  authorChurch?: string;
  authorLevel?: number;
  createdAt: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  bibleVerse?: string;
  tags: string[];
  viewsCount: number;
  reactions: Record<ReactionType, number>;
  userReactions: Record<string, ReactionType[]>; // userId -> ReactionType[]
  comments: Comment[];
  sharesCount: number;
  isOfficial?: boolean;
  officialSource?: {
    organization: string;
    url: string;
    verified: boolean;
  };
  recommendationReason?: string;
}

export interface Story {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  category: 'oracion' | 'versiculo' | 'testimonio' | 'reflexion' | 'musica' | 'iglesia' | 'campamento';
  mediaUrl?: string;
  textContent?: string;
  bibleVerse?: string;
  createdAt: string;
  expiresAt: string;
  viewsCount: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil' | 'Épico';
  points: number;
  participantsCount: number;
  deadline: string;
  requiredEvidence: string;
  icon: string;
  imageUrl?: string;
  isOfficial: boolean;
}

export type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'more_info';

export interface ChallengeSubmission {
  id: string;
  challengeId: string;
  challengeTitle: string;
  challengePoints: number;
  userId: string;
  userName: string;
  userUsername: string;
  userAvatar: string;
  userChurch: string;
  date: string;
  approximateLocation: string;
  commentReflection: string;
  mediaType: 'photo' | 'video';
  mediaUrl: string;
  status: SubmissionStatus;
  adminFeedback?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: 'campamento' | 'retiro' | 'congreso' | 'mision_caleb' | 'concierto' | 'ja_especial';
  date: string;
  time: string;
  city: string;
  country: string;
  venue: string;
  organizer: string;
  isOfficialSource: boolean;
  officialSourceUrl?: string;
  officialOrganization?: string;
  interestedCount: number;
  attendingCount: number;
  imageUrl: string;
  isAttending?: boolean;
  isInterested?: boolean;
  scope: 'local' | 'ciudad' | 'nacional' | 'internacional';
}

export interface OfficialSource {
  id: string;
  name: string;
  organization: string;
  region: string;
  websiteUrl: string;
  logo: string;
  verified: boolean;
  description: string;
  lastUpdated: string;
  eventCount: number;
}

export interface PrayerRequest {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorChurch: string;
  title: string;
  description: string;
  isAnswered: boolean;
  testimony?: string;
  prayingCount: number;
  prayingUserIds: string[];
  createdAt: string;
  category: 'salud' | 'familia' | 'mision' | 'estudios' | 'espiritual';
}

export interface Testimonial {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorChurch: string;
  title: string;
  story: string;
  category: 'milagro' | 'oracion_respondida' | 'mision_caleb' | 'fe_en_crisis';
  date: string;
  amenCount: number;
  praisedUserIds: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  mediaUrl?: string;
  sticker?: string;
  isVoiceNote?: boolean;
  voiceDuration?: string;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  isGroup: boolean;
  name: string;
  avatar: string;
  participantIds: string[];
  category?: 'musica' | 'evangelismo' | 'jovenes' | 'campamentos' | 'estudios_biblicos' | 'ministerios';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  verseRef: string;
  explanation: string;
  points: number;
}

export interface Church {
  id: string;
  name: string;
  district: string;
  zone: string;
  city: string;
  country: string;
  address: string;
  pastor: string;
  youthLeader: string;
  youthCount: number;
  websiteUrl?: string;
  activeEventsCount: number;
}

export interface NotificationItem {
  id: string;
  type: 'reaction' | 'comment' | 'follow' | 'challenge_approved' | 'challenge_new' | 'event' | 'badge_earned' | 'prayer';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  pointsAwarded?: number;
}

export interface ChannelItem {
  id: string;
  title: string;
  category: 'musica' | 'predicaciones' | 'estudios_biblicos' | 'devocionales' | 'noticias_iasd';
  creator: string;
  thumbnail: string;
  duration: string;
  views: string;
  verifiedOfficial: boolean;
  url: string;
}

export interface ReactionRecord {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  type: ReactionType;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  targetType: 'post' | 'user' | 'comment' | 'submission';
  targetId: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  reviewedBy?: string;
  resolutionNotes?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  sourceName: string;
  sourceUrl?: string;
  category: 'institucional' | 'juvenil' | 'mision' | 'campamentos' | 'internacional';
  publishedAt: string;
  imageUrl?: string;
  verified: boolean;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  category: 'trivia' | 'verdadero_falso' | 'completa_versiculo' | 'personajes';
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
  questionsCount: number;
  pointsReward: number;
  icon: string;
  active: boolean;
}

export interface GameScore {
  id: string;
  gameId: string;
  gameTitle: string;
  userId: string;
  userName: string;
  userAvatar: string;
  score: number;
  pointsAwarded: number;
  correctAnswers: number;
  totalQuestions: number;
  playedAt: string;
}

export interface Achievement {
  id: string;
  userId: string;
  badgeId: string;
  badgeName: string;
  badgeIcon: string;
  description: string;
  pointsAwarded: number;
  unlockedAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  avatar: string;
  category: 'musica' | 'evangelismo' | 'jovenes' | 'campamentos' | 'estudios_biblicos' | 'ministerios';
  leaderId: string;
  leaderName: string;
  memberIds: string[];
  isPublic: boolean;
  createdAt: string;
}

