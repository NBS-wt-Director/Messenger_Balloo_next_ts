/**
 * Типы вложений сообщений Balloo Messenger
 * Все типы вложений: бесплатные и premium (Шейх)
 * 
 * @version 2.0.0
 * @date 2026-06-14
 * @author NLP-Core-Team
 */

// ============================================
// ОБЩИЕ ТИПЫ И КОНСТАНТЫ
// ============================================

/**
 * Категории вложений
 */
export type AttachmentCategory = 
  | 'media'           // Медиафайлы
  | 'interactive'     // Интерактивные
  | 'content'         // Контент
  | 'communication'   // Коммуникация
  | 'premium';        // Premium (Шейх)

/**
 * Уровень доступа к вложению
 */
export type AttachmentAccessLevel = 'free' | 'premium';

/**
 * Типы премиум-доступа
 */
export type PremiumType = 'sheikh' | 'enterprise' | 'partner';

/**
 * Информация о доступности вложения
 */
export interface AttachmentAccessInfo {
  level: AttachmentAccessLevel;
  premiumType?: PremiumType;
  requiredRole?: 'sheikh';
  description?: string;
}

/**
 * Все типы вложений в Balloo Messenger
 * 
 * БЕСПЛАТНЫЕ (доступны всем):
 * - Медиа: image, video, audio, file, voice_message, video_note
 * - Интерактивные: poll, list, survey, quiz
 * - Контент: gif, sticker, link_preview, note, chart, music
 * - Коммуникация: location, contact, event, mention, call_recording
 * 
 * PREMIUM (только Шейх):
 * - payment, game, expiring, collaborative, combined
 */
export type AttachmentType = 
  // Медиа (бесплатные)
  | 'image' 
  | 'video' 
  | 'audio' 
  | 'file' 
  | 'document'
  | 'voice_message'
  | 'video_note'
  // Интерактивные (бесплатные)
  | 'poll' 
  | 'list' 
  | 'survey' 
  | 'quiz'
  // Контент (бесплатные)
  | 'gif'
  | 'sticker'
  | 'link_preview'
  | 'note'
  | 'chart'
  | 'music'
  // Коммуникация (бесплатные)
  | 'location'
  | 'contact'
  | 'event'
  | 'mention'
  | 'call_recording'
  // Premium (только Шейх)
  | 'payment'
  | 'game'
  | 'expiring'
  | 'collaborative'
  | 'combined';

/**
 * Метаданные вложения
 */
export interface AttachmentMetadata {
  title?: string;
  subtitle?: string;
  icon?: string;
  category: AttachmentCategory;
  accessLevel: AttachmentAccessLevel;
  fileSize?: number;
  mimeType?: string;
  createdAt: number;
  updatedAt?: number;
}

// ============================================
// МЕДИА-ВЛОЖЕНИЯ (БЕСПЛАТНЫЕ)
// ============================================

// --------------------------------------------
// 1.1 ИЗОБРАЖЕНИЯ (image) - FREE
// --------------------------------------------

export interface ImageAttachment {
  type: 'image';
  attachmentId: string;
  url: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  mimeType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
  caption?: string;
  exif?: {
    camera?: string;
    date?: number;
    location?: { lat: number; lng: number };
  };
  compressed?: boolean;
  optimized?: boolean;
  accessInfo: AttachmentAccessInfo;
  createdAt: number;
  updatedAt: number;
}

// --------------------------------------------
// 1.2 ВИДЕО (video) - FREE
// --------------------------------------------

export interface VideoAttachment {
  type: 'video';
  attachmentId: string;
  url: string;
  streamingUrl?: string;
  thumbnailUrl: string;
  previewGifUrl?: string;
  duration: number;
  width: number;
  height: number;
  fileSize: number;
  bitrate?: number;
  mimeType: 'video/mp4' | 'video/webm' | 'video/quicktime';
  codec?: string;
  caption?: string;
  transcoded?: boolean;
  resolutions?: {
    '360p'?: string;
    '480p'?: string;
    '720p'?: string;
    '1080p'?: string;
  };
  accessInfo: AttachmentAccessInfo;
  createdAt: number;
  updatedAt: number;
}

// --------------------------------------------
// 1.3 АУДИО (audio) - FREE
// --------------------------------------------

export interface AudioAttachment {
  type: 'audio';
  attachmentId: string;
  url: string;
  waveformUrl?: string;
  duration: number;
  fileSize: number;
  mimeType: 'audio/mpeg' | 'audio/wav' | 'audio/ogg' | 'audio/aac';
  metadata?: {
    title?: string;
    artist?: string;
    album?: string;
    year?: number;
    genre?: string;
    coverArtUrl?: string;
    trackNumber?: number;
  };
  caption?: string;
  accessInfo: AttachmentAccessInfo;
  createdAt: number;
  updatedAt: number;
}

// --------------------------------------------
// 1.4 ДОКУМЕНТЫ (file/document) - FREE
// --------------------------------------------

export interface FileAttachment {
  type: 'file' | 'document';
  attachmentId: string;
  url: string;
  previewUrl?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  extension: string;
  category: 'document' | 'spreadsheet' | 'presentation' | 'archive' | 'ebook' | 'other';
  pageCount?: number;
  caption?: string;
  virusScanStatus?: 'pending' | 'clean' | 'infected';
  scannedAt?: number;
  accessInfo: AttachmentAccessInfo;
  createdAt: number;
  updatedAt: number;
}

// --------------------------------------------
// 1.5 ГОЛОСОВЫЕ СООБЩЕНИЯ (voice_message) - FREE
// --------------------------------------------

export interface VoiceMessageAttachment {
  type: 'voice_message';
  attachmentId: string;
  url: string;
  waveformUrl?: string;
  duration: number;
  fileSize: number;
  mimeType: 'audio/ogg' | 'audio/mp3' | 'audio/webm';
  codec: 'opus' | 'aac' | 'mp3';
  bitrate: number;
  isPlayed: boolean;
  playbackSpeed: 0.5 | 1.0 | 1.5 | 2.0;
  listenedUntil?: number;
  transcript?: string;
  transcriptLanguage?: string;
  transcriptConfidence?: number;
  waveform: number[];
  caption?: string;
  accessInfo: AttachmentAccessInfo;
  createdAt: number;
}

// --------------------------------------------
// 1.6 ВИДЕО-СООБЩЕНИЯ (video_note) - FREE
// --------------------------------------------

export interface VideoNoteAttachment {
  type: 'video_note';
  attachmentId: string;
  url: string;
  thumbnailUrl: string;
  gifPreviewUrl?: string;
  duration: number;
  size: number;
  fileSize: number;
  mimeType: 'video/mp4' | 'video/webm';
  codec: 'H.264' | 'VP9';
  fps: number;
  isPlayed: boolean;
  watchedUntil?: number;
  loop: boolean;
  hasAudio: boolean;
  muted?: boolean;
  accessInfo: AttachmentAccessInfo;
  createdAt: number;
}

// ============================================
// ИНТЕРАКТИВНЫЕ ВЛОЖЕНИЯ (БЕСПЛАТНЫЕ)
// ============================================

// --------------------------------------------
// 2.1 ОПРОСЫ (poll) - FREE
// --------------------------------------------

export interface PollAttachment {
  type: 'poll';
  pollId: string;
  question: string;
  description?: string;
  options: PollOption[];
  settings: PollSettings;
  results: PollResults;
  userResponse?: UserPollResponse;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  expiresAt?: number;
  closedAt?: number;
  accessInfo: AttachmentAccessInfo;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
  userVoted?: boolean;
  color?: string;
  order: number;
}

export interface PollSettings {
  allowTextResponse: boolean;
  multipleChoice: boolean;
  isAnonymous: boolean;
  expiresAt?: number;
  maxVotes?: number;
  showResultsBeforeVote: boolean;
  allowChangeVote: boolean;
}

export interface PollResults {
  totalVotes: number;
  uniqueVoters: string[];
  voteDistribution: Record<string, number>;
  completedAt?: number;
  topOption?: string;
}

export interface UserPollResponse {
  optionIds: string[];
  textResponse?: string;
  votedAt: number;
  canChange: boolean;
}

// --------------------------------------------
// 2.2 СПИСКИ (list) - FREE
// --------------------------------------------

export interface ListAttachment {
  type: 'list';
  listId: string;
  title: string;
  description?: string;
  items: ListItem[];
  settings: ListSettings;
  progress: ListProgress;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  accessInfo: AttachmentAccessInfo;
}

export interface ListItem {
  id: string;
  text: string;
  description?: string;
  completed: boolean;
  completedBy?: string[];
  completedAt?: number;
  assignedTo?: string;
  dueDate?: number;
  priority: 'low' | 'medium' | 'high';
  order: number;
  parentId?: string;
  tags?: string[];
}

export interface ListSettings {
  allowMultipleCompletion: boolean;
  requireAllItems: boolean;
  allowReordering: boolean;
  notifyOnComplete: boolean;
  allowComments: boolean;
  showProgress: boolean;
}

export interface ListProgress {
  totalItems: number;
  completedItems: number;
  progress: number;
  completedBy: Record<string, number>;
  lastCompletedAt?: number;
  estimatedCompletion?: number;
}

// --------------------------------------------
// 2.3 АНКЕТЫ (survey) - FREE
// --------------------------------------------

export type SurveyQuestionType = 
  | 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' 
  | 'rating' | 'scale' | 'date' | 'email' | 'phone';

export interface SurveyAttachment {
  type: 'survey';
  surveyId: string;
  title: string;
  description?: string;
  sections: SurveySection[];
  settings: SurveySettings;
  results?: SurveyResults;
  userSubmission?: UserSurveySubmission;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  expiresAt?: number;
  accessInfo: AttachmentAccessInfo;
}

export interface SurveySection {
  id: string;
  title: string;
  description?: string;
  questions: SurveyQuestion[];
  order: number;
}

export interface SurveyQuestion {
  id: string;
  type: SurveyQuestionType;
  question: string;
  description?: string;
  placeholder?: string;
  options?: SurveyOption[];
  required: boolean;
  order: number;
  validation?: QuestionValidation;
  otherOption?: boolean;
}

export interface SurveyOption {
  id: string;
  text: string;
  value?: string;
  image?: string;
  order: number;
}

export interface QuestionValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  customError?: string;
}

export interface SurveySettings {
  allowMultipleSubmissions: boolean;
  showResultsAfterSubmit: boolean;
  requireAllQuestions: boolean;
  anonymous: boolean;
  expiresAt?: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showProgressBar: boolean;
  allowSaveDraft: boolean;
}

export interface SurveyResults {
  totalSubmissions: number;
  uniqueRespondents: string[];
  completedAt?: number;
  questionResults: QuestionResults[];
  averageCompletionTime: number;
}

export interface QuestionResults {
  questionId: string;
  responses: number;
  averageRating?: number;
  optionBreakdown?: Record<string, number>;
  textResponses?: string[];
}

export interface UserSurveySubmission {
  answers: SurveyAnswer[];
  submittedAt: number;
  duration?: number;
  deviceId?: string;
}

export interface SurveyAnswer {
  questionId: string;
  value: string | string[] | number;
  text?: string;
}

// --------------------------------------------
// 2.4 ТЕСТЫ (quiz) - FREE
// --------------------------------------------

export type QuizQuestionType = 
  | 'single-choice' | 'multiple-choice' | 'true-false'
  | 'matching' | 'ordering' | 'fill-blank';

export interface QuizAttachment {
  type: 'quiz';
  quizId: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  settings: QuizSettings;
  results: QuizResults;
  userAttempt?: UserQuizAttempt;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  publishedAt?: number;
  accessInfo: AttachmentAccessInfo;
}

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  question: string;
  description?: string;
  options: QuizOption[];
  correctOptions: string[];
  explanation?: string;
  points: number;
  order: number;
  mediaUrl?: string;
  mediaType?: 'image' | 'audio' | 'video';
}

export interface QuizOption {
  id: string;
  text: string;
  image?: string;
  order: number;
}

export interface QuizSettings {
  passingScore: number;
  maxAttempts: number;
  showCorrectAnswers: boolean;
  showExplanation: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  timer?: number;
  randomizeCorrectAnswers: boolean;
  showScoreImmediately: boolean;
  allowReview: boolean;
  certificateEnabled: boolean;
}

export interface QuizResults {
  totalAttempts: number;
  uniqueTakers: string[];
  averageScore: number;
  passRate: number;
  averageTime: number;
  completedAt?: number;
  leaderboard?: QuizLeaderboardEntry[];
}

export interface UserQuizAttempt {
  attemptId: string;
  answers: QuizAnswer[];
  score: number;
  maxScore: number;
  percentage: number;
  correctCount: number;
  totalCount: number;
  passed: boolean;
  attemptedAt: number;
  duration?: number;
  attemptNumber: number;
  reviewAvailable: boolean;
  certificateUrl?: string;
}

export interface QuizAnswer {
  questionId: string;
  optionIds: string[];
  isCorrect: boolean;
  points: number;
  userExplanation?: string;
}

export interface QuizLeaderboardEntry {
  userId: string;
  userName: string;
  score: number;
  duration: number;
  attemptDate: number;
  rank: number;
}

// ============================================
// КОНТЕНТ-ВЛОЖЕНИЯ (БЕСПЛАТНЫЕ)
// ============================================

// --------------------------------------------
// 3.1 GIF (gif) - FREE
// --------------------------------------------

export interface GifAttachment {
  type: 'gif';
  attachmentId: string;
  url: string;
  previewUrl: string;
  stillUrl?: string;
  width: number;
  height: number;
  fileSize: number;
  frames?: number;
  duration?: number;
  fps?: number;
  provider: 'giphy' | 'tenor' | 'yandex';
  gifId: string;
  title?: string;
  tags: string[];
  rating: 'g' | 'pg' | 'pg-13' | 'r';
  accessInfo: AttachmentAccessInfo;
  createdAt: number;
}

// --------------------------------------------
// 3.2 СТИКЕРЫ (sticker) - FREE
// --------------------------------------------

export interface StickerAttachment {
  type: 'sticker';
  attachmentId: string;
  stickerId: string;
  packId: string;
  url: string;
  thumbnailUrl?: string;
  width: number;
  height: number;
  fileSize: number;
  emoji?: string;
  isAnimated: boolean;
  isPremium: boolean;
  tags?: string[];
  pack: StickerPack;
  accessInfo: AttachmentAccessInfo;
  createdAt: number;
}

export interface StickerPack {
  id: string;
  name: string;
  author: string;
  stickers: Sticker[];
  coverUrl: string;
  isInstalled: boolean;
  isFree: boolean;
  price?: number;
  stickerCount: number;
}

export interface Sticker {
  id: string;
  url: string;
  emoji?: string;
  order: number;
}

// --------------------------------------------
// 3.3 ПРЕДПРОСМОТР ССЫЛОК (link_preview) - FREE
// --------------------------------------------

export interface LinkPreviewAttachment {
  type: 'link_preview';
  attachmentId: string;
  url: string;
  canonicalUrl?: string;
  title: string;
  description: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  siteName?: string;
  type: 'article' | 'video' | 'music' | 'product' | 'website';
  favicon?: string;
  videoUrl?: string;
  videoDuration?: number;
  videoThumbnail?: string;
  audioUrl?: string;
  artist?: string;
  album?: string;
  price?: number;
  currency?: string;
  inStock?: boolean;
  rating?: number;
  fetchedAt: number;
  expiresAt: number;
  cacheKey: string;
  accessInfo: AttachmentAccessInfo;
  createdAt: number;
}

// --------------------------------------------
// 3.4 ЗАМЕТКИ (note) - FREE
// --------------------------------------------

export interface NoteAttachment {
  type: 'note';
  attachmentId: string;
  noteId: string;
  title: string;
  content: string;
  preview: string;
  formatting: 'plain' | 'markdown' | 'html';
  wordCount: number;
  charCount: number;
  readTime: number;
  attachments?: string[];
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  isEdited: boolean;
  version: number;
  history?: NoteVersion[];
  accessInfo: AttachmentAccessInfo;
}

export interface NoteVersion {
  version: number;
  content: string;
  editedAt: number;
  editedBy: string;
  changes?: string;
}

// --------------------------------------------
// 3.5 ДИАГРАММЫ (chart) - FREE
// --------------------------------------------

export type ChartType = 
  | 'pie' | 'doughnut' | 'bar' | 'column' | 'line' | 'area'
  | 'radar' | 'polar' | 'scatter' | 'bubble' | 'gauge' | 'funnel';

export interface ChartAttachment {
  type: 'chart';
  attachmentId: string;
  chartId: string;
  chartType: ChartType;
  title: string;
  description?: string;
  data: ChartData;
  options: ChartOptions;
  imageUrl?: string;
  interactiveUrl?: string;
  createdBy: string;
  createdAt: number;
  accessInfo: AttachmentAccessInfo;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    values: number[];
    color?: string;
    colors?: string[];
  }[];
}

export interface ChartOptions {
  showLegend: boolean;
  showValues: boolean;
  showPercentage: boolean;
  showGrid: boolean;
  smooth: boolean;
  stacked: boolean;
}

// --------------------------------------------
// 3.6 МУЗЫКА (music) - FREE
// --------------------------------------------

export interface MusicAttachment {
  type: 'music';
  attachmentId: string;
  url: string;
  coverArtUrl?: string;
  lyricsUrl?: string;
  duration: number;
  title: string;
  artist: string;
  album?: string;
  year?: number;
  genre?: string;
  trackNumber?: number;
  fileSize: number;
  mimeType: 'audio/mpeg' | 'audio/wav' | 'audio/ogg' | 'audio/flac';
  bitrate: number;
  isLicensed: boolean;
  licenseInfo?: string;
  accessInfo: AttachmentAccessInfo;
  createdAt: number;
}

// ============================================
// КОММУНИКАЦИЯ-ВЛОЖЕНИЯ (БЕСПЛАТНЫЕ)
// ============================================

// --------------------------------------------
// 4.1 ГЕОЛОКАЦИЯ (location) - FREE
// --------------------------------------------

export interface LocationAttachment {
  type: 'location';
  attachmentId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  name?: string;
  address?: string;
  venue?: string;
  category?: string;
  staticMapUrl?: string;
  zoomLevel?: number;
  provider: 'google' | 'yandex' | 'osm' | '2gis';
  placeId?: string;
  rating?: number;
  priceLevel?: 1 | 2 | 3 | 4;
  openingHours?: string;
  phoneNumber?: string;
  website?: string;
  isLive?: boolean;
  expiresAt?: number;
  updateInterval?: number;
  caption?: string;
  accessInfo: AttachmentAccessInfo;
  createdAt: number;
}

// --------------------------------------------
// 4.2 КОНТАКТЫ (contact) - FREE
// --------------------------------------------

export interface ContactAttachment {
  type: 'contact';
  attachmentId: string;
  firstName: string;
  lastName?: string;
  displayName: string;
  middleName?: string;
  phoneNumbers: ContactPhone[];
  emails: ContactEmail[];
  avatar?: string;
  organization?: string;
  jobTitle?: string;
  department?: string;
  addresses: ContactAddress[];
  socialProfiles: ContactSocial[];
  websites: string[];
  notes?: string;
  vcard?: string;
  source: 'phonebook' | 'manual' | 'import';
  accessInfo: AttachmentAccessInfo;
  createdAt: number;
}

export interface ContactPhone {
  number: string;
  type: 'mobile' | 'home' | 'work' | 'main' | 'other';
  label?: string;
  isPrimary?: boolean;
}

export interface ContactEmail {
  email: string;
  type: 'personal' | 'work' | 'other';
  label?: string;
  isPrimary?: boolean;
}

export interface ContactAddress {
  street?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  type: 'home' | 'work' | 'other';
}

export interface ContactSocial {
  platform: 'telegram' | 'whatsapp' | 'vk' | 'facebook' | 'instagram' | 'linkedin';
  username?: string;
  url?: string;
}

// --------------------------------------------
// 4.3 СОБЫТИЯ (event) - FREE
// --------------------------------------------

export interface EventAttachment {
  type: 'event';
  attachmentId: string;
  eventId: string;
  title: string;
  description?: string;
  startTime: number;
  endTime: number;
  timezone: string;
  allDay: boolean;
  location?: string;
  locationAddress?: string;
  locationCoords?: { lat: number; lng: number };
  onlineMeetingUrl?: string;
  organizer: string;
  attendees: EventAttendee[];
  reminders: EventReminder[];
  recurrence?: EventRecurrence;
  status: 'confirmed' | 'tentative' | 'cancelled';
  visibility: 'public' | 'private' | 'default';
  attachments?: string[];
  icsUrl?: string;
  calendarUrl?: string;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  accessInfo: AttachmentAccessInfo;
}

export interface EventAttendee {
  userId: string;
  email?: string;
  name?: string;
  status: 'pending' | 'accepted' | 'declined' | 'maybe';
  respondedAt?: number;
  isOrganizer: boolean;
  canEdit?: boolean;
}

export interface EventReminder {
  type: 'notification' | 'email' | 'sms';
  minutesBefore: number;
  customMessage?: string;
}

export interface EventRecurrence {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  count?: number;
  until?: number;
  byDay?: string[];
  byMonthDay?: number[];
}

// --------------------------------------------
// 4.4 УПОМИНАНИЯ (mention) - FREE
// --------------------------------------------

export interface MentionAttachment {
  type: 'mention';
  attachmentId: string;
  mentionType: 'user' | 'group' | 'channel' | 'hashtag';
  targetId: string;
  targetName: string;
  targetAvatar?: string;
  context?: string;
  accessInfo: AttachmentAccessInfo;
  createdAt: number;
}

// --------------------------------------------
// 4.5 ЗАПИСИ ЗВОНКОВ (call_recording) - FREE
// --------------------------------------------

export interface CallRecordingAttachment {
  type: 'call_recording';
  attachmentId: string;
  url: string;
  transcriptUrl?: string;
  duration: number;
  fileSize: number;
  mimeType: 'audio/ogg' | 'audio/mp3' | 'video/mp4';
  callId: string;
  callType: 'audio' | 'video';
  participants: string[];
  transcript?: string;
  transcriptLanguage?: string;
  accessInfo: AttachmentAccessInfo;
  createdAt: number;
}

// ============================================
// PREMIUM ВЛОЖЕНИЯ (ТОЛЬКО ШЕЙХ)
// ============================================

// --------------------------------------------
// 5.1 ПЕРЕВОДЫ (payment) - PREMIUM SHEIKH
// --------------------------------------------

export interface PaymentAttachment {
  type: 'payment';
  attachmentId: string;
  paymentId: string;
  amount: number;
  currency: 'RUB' | 'USD' | 'EUR' | 'KZT' | 'BTC' | 'ETH';
  sender: string;
  recipient: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'balance' | 'sbp' | 'yandex' | 'crypto';
  message?: string;
  transactionId?: string;
  fee?: number;
  feePercent: number;
  feePayer: 'sender' | 'recipient' | 'platform';
  sheikhDiscount: boolean;
  conversion?: {
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    convertedAmount: number;
  };
  createdAt: number;
  completedAt?: number;
  receiptUrl?: string;
  accessInfo: AttachmentAccessInfo;
}

// --------------------------------------------
// 5.2 ИГРЫ (game) - PREMIUM SHEIKH
// --------------------------------------------

export type GameType = 
  | 'chess' | 'checkers' | 'tictactoe' | 'quiz' | 'cards'
  | 'board' | 'arcade' | 'puzzle' | 'trivia' | 'custom';

export interface GameAttachment {
  type: 'game';
  attachmentId: string;
  gameId: string;
  gameType: GameType;
  title: string;
  description?: string;
  gameState: GameState;
  players: GamePlayer[];
  spectators: string[];
  settings: GameSettings;
  results?: GameResults;
  session: GameSession;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  expiresAt?: number;
  accessInfo: AttachmentAccessInfo;
}

export interface GameState {
  status: 'waiting' | 'playing' | 'paused' | 'completed' | 'cancelled';
  currentTurn?: string;
  board?: Record<string, any>;
  moves?: GameMove[];
  timer?: number;
}

export interface GameMove {
  playerId: string;
  move: string;
  timestamp: number;
  notation?: string;
}

export interface GamePlayer {
  userId: string;
  displayName: string;
  avatar?: string;
  isSheikh: boolean;
  role: 'player' | 'spectator' | 'host';
  team?: string;
  score?: number;
  rating?: number;
}

export interface GameSettings {
  isPublic: boolean;
  allowSpectators: boolean;
  timerPerMove?: number;
  maxPlayers: number;
  minPlayers: number;
  ranked: boolean;
}

export interface GameResults {
  winnerId?: string;
  winners?: string[];
  scores: Record<string, number>;
  duration: number;
  totalMoves: number;
  completedAt: number;
}

export interface GameSession {
  sessionId: string;
  serverUrl: string;
  token: string;
  expiresAt: number;
}

// --------------------------------------------
// 5.3 ИСЧЕЗАЮЩИЕ (expiring) - PREMIUM SHEIKH
// --------------------------------------------

export type ExpiringType = 'image' | 'video' | 'voice_message' | 'video_note' | 'note' | 'file';

export interface ExpiringAttachment {
  type: 'expiring';
  attachmentId: string;
  expiringType: ExpiringType;
  originalAttachment: ImageAttachment | VideoAttachment | VoiceMessageAttachment | VideoNoteAttachment | NoteAttachment | FileAttachment;
  expiresAt: number;
  destroyOnRead: boolean;
  destroyOnScreenshot: boolean;
  notifyBeforeExpire: number;
  isViewed: boolean;
  viewedAt?: number;
  viewedBy: string[];
  isDestroyed: boolean;
  destroyedAt?: number;
  screenshotDetected?: boolean;
  screenshotAt?: number;
  screenshotBy?: string[];
  createdBy: string;
  createdAt: number;
  accessInfo: AttachmentAccessInfo;
}

// --------------------------------------------
// 5.4 СОВМЕСТНЫЕ (collaborative) - PREMIUM SHEIKH
// --------------------------------------------

export type CollaborativeType = 'list' | 'note' | 'chart' | 'document' | 'whiteboard';

export interface CollaborativeAttachment {
  type: 'collaborative';
  attachmentId: string;
  collaborativeType: CollaborativeType;
  title: string;
  description?: string;
  content: any;
  editors: CollaborativeEditor[];
  currentEditors: string[];
  realTimeSync: boolean;
  lastSyncAt: number;
  syncServer?: string;
  editHistory: Edit[];
  locks: Record<string, string>;
  permissions: CollaborativePermissions;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  accessInfo: AttachmentAccessInfo;
}

export interface CollaborativeEditor {
  userId: string;
  displayName: string;
  avatar?: string;
  isSheikh: boolean;
  role: 'owner' | 'editor' | 'viewer';
  permissions: PermissionLevel;
  joinedAt: number;
  lastActiveAt?: number;
}

export type PermissionLevel = 'read' | 'write' | 'admin';

export interface CollaborativePermissions {
  canEdit: boolean;
  canComment: boolean;
  canShare: boolean;
  canDelete: boolean;
  canInvite: boolean;
}

export interface Edit {
  editId: string;
  userId: string;
  timestamp: number;
  section: string;
  oldContent: string;
  newContent: string;
  operation: 'create' | 'update' | 'delete';
}

// --------------------------------------------
// 5.5 КОМБИНИРОВАННЫЕ (combined) - PREMIUM SHEIKH
// --------------------------------------------

export type CombinedType = 
  | 'poll_list' | 'event_poll' | 'quiz_survey' 
  | 'chart_note' | 'location_event' | 'custom';

export interface CombinedAttachment {
  type: 'combined';
  attachmentId: string;
  combinedType: CombinedType;
  title: string;
  description?: string;
  components: CombinedComponent[];
  relations: ComponentRelation[];
  results?: CombinedResults;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  accessInfo: AttachmentAccessInfo;
}

export interface CombinedComponent {
  id: string;
  type: AttachmentType;
  data: any;
  order: number;
  isVisible: boolean;
}

export interface ComponentRelation {
  fromComponentId: string;
  toComponentId: string;
  relationType: 'depends_on' | 'triggers' | 'updates' | 'validates';
  condition?: string;
}

export interface CombinedResults {
  componentResults: Record<string, any>;
  aggregatedData?: any;
  completedAt?: number;
}

// ============================================
// ОБЩИЕ ТИПЫ ВЛОЖЕНИЙ
// ============================================

export type AttachmentData = 
  | ImageAttachment | VideoAttachment | AudioAttachment | FileAttachment
  | VoiceMessageAttachment | VideoNoteAttachment
  | PollAttachment | ListAttachment | SurveyAttachment | QuizAttachment
  | GifAttachment | StickerAttachment | LinkPreviewAttachment
  | NoteAttachment | ChartAttachment | MusicAttachment
  | LocationAttachment | ContactAttachment | EventAttachment
  | MentionAttachment | CallRecordingAttachment
  | PaymentAttachment | GameAttachment | ExpiringAttachment
  | CollaborativeAttachment | CombinedAttachment;

export interface MessageAttachment {
  id: string;
  type: AttachmentType;
  data: AttachmentData;
  metadata: AttachmentMetadata;
}

export interface AttachmentConfig {
  maxSize: number;
  allowedTypes: AttachmentType[];
  premiumTypes: AttachmentType[];
  virusScan: boolean;
  compression: boolean;
}

export interface AttachmentLimits {
  free: {
    maxSize: number;
    dailyUploads: number;
    allowedTypes: AttachmentType[];
  };
  sheikh: {
    maxSize: number;
    dailyUploads: number;
    allowedTypes: AttachmentType[];
    multipliers: {
      fileLimit: number;
      storageLimit: number;
    };
  };
}

export interface AccessCheckResult {
  allowed: boolean;
  reason?: string;
  upgradeUrl?: string;
  error?: {
    code: 'PREMIUM_REQUIRED' | 'PREMIUM_EXPIRED' | 'LIMIT_EXCEEDED';
    message: string;
  };
}

// ============================================
// КОНСТАНТЫ
// ============================================

export const ATTACHMENT_ACCESS_INFO: Record<AttachmentType, AttachmentAccessInfo> = {
  // Медиа (бесплатные)
  'image': { level: 'free', category: 'media' as any },
  'video': { level: 'free', category: 'media' as any },
  'audio': { level: 'free', category: 'media' as any },
  'file': { level: 'free', category: 'media' as any },
  'document': { level: 'free', category: 'media' as any },
  'voice_message': { level: 'free', category: 'media' as any },
  'video_note': { level: 'free', category: 'media' as any },
  // Интерактивные (бесплатные)
  'poll': { level: 'free', category: 'interactive' as any },
  'list': { level: 'free', category: 'interactive' as any },
  'survey': { level: 'free', category: 'interactive' as any },
  'quiz': { level: 'free', category: 'interactive' as any },
  // Контент (бесплатные)
  'gif': { level: 'free', category: 'content' as any },
  'sticker': { level: 'free', category: 'content' as any },
  'link_preview': { level: 'free', category: 'content' as any },
  'note': { level: 'free', category: 'content' as any },
  'chart': { level: 'free', category: 'content' as any },
  'music': { level: 'free', category: 'content' as any },
  // Коммуникация (бесплатные)
  'location': { level: 'free', category: 'communication' as any },
  'contact': { level: 'free', category: 'communication' as any },
  'event': { level: 'free', category: 'communication' as any },
  'mention': { level: 'free', category: 'communication' as any },
  'call_recording': { level: 'free', category: 'communication' as any },
  // Premium (только Шейх)
  'payment': { level: 'premium', premiumType: 'sheikh', requiredRole: 'sheikh', description: 'Переводы и платежи' },
  'game': { level: 'premium', premiumType: 'sheikh', requiredRole: 'sheikh', description: 'Игры в чате' },
  'expiring': { level: 'premium', premiumType: 'sheikh', requiredRole: 'sheikh', description: 'Исчезающие вложения' },
  'collaborative': { level: 'premium', premiumType: 'sheikh', requiredRole: 'sheikh', description: 'Совместная работа' },
  'combined': { level: 'premium', premiumType: 'sheikh', requiredRole: 'sheikh', description: 'Комбинированные вложения' },
};

export const PREMIUM_ATTACHMENTS: AttachmentType[] = [
  'payment', 'game', 'expiring', 'collaborative', 'combined',
];

export const FREE_ATTACHMENTS: AttachmentType[] = [
  'image', 'video', 'audio', 'file', 'document',
  'voice_message', 'video_note',
  'poll', 'list', 'survey', 'quiz',
  'gif', 'sticker', 'link_preview', 'note', 'chart', 'music',
  'location', 'contact', 'event', 'mention', 'call_recording',
];
