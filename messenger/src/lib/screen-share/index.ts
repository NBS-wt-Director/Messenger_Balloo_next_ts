/**
 * Screen Sharing Library
 * Демонстрация экрана через WebRTC GetDisplayMedia API
 */

export interface ScreenShareConfig {
  withAudio?: boolean;
  quality?: 'low' | 'medium' | 'high';
  frameRate?: number;
}

export interface ScreenShareSession {
  stream: MediaStream;
  track: MediaStreamTrack;
  sessionId: string;
  startedAt: number;
  viewers: string[];
}

/**
 * Начало демонстрации экрана
 */
export async function startScreenShare(
  config: ScreenShareConfig = {}
): Promise<ScreenShareSession> {
  const {
    withAudio = false,
    quality = 'high',
    frameRate = 30
  } = config;

  try {
    // Запрос доступа к демонстрации экрана
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: 'always',
        displaySurface: 'monitor',
        frameRate: {
          ideal: frameRate,
          max: frameRate
        }
      },
      audio: withAudio ? {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      } : false
    } as MediaStreamConstraints);

    const track = stream.getVideoTracks()[0];

    // Настройка качества
    if (track.getSettings) {
      const settings = track.getSettings();
      if (process.env.NODE_ENV === 'development') {
        console.log('Screen share settings:', settings);
      }
    }

    // Обработка остановки демонстрации
    track.onended = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Screen share stopped by user');
      }
      stopScreenShare({ stream, track, sessionId: '', startedAt: 0, viewers: [] });
    };

    const sessionId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      stream,
      track,
      sessionId,
      startedAt: Date.now(),
      viewers: []
    };
  } catch (error: any) {
    if (error.name === 'NotAllowedError') {
      throw new Error('Доступ к демонстрации экрана запрещен');
    } else if (error.name === 'NotFoundError') {
      throw new Error('Устройство захвата экрана не найдено');
    }
    throw error;
  }
}

/**
 * Остановка демонстрации экрана
 */
export function stopScreenShare(session: ScreenShareSession): void {
  if (session.track) {
    session.track.stop();
  }
  
  if (session.stream) {
    session.stream.getTracks().forEach(track => track.stop());
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('Screen share stopped:', session.sessionId);
  }
}

/**
 * Переключение камеры во время демонстрации
 */
export async function toggleCamera(
  session: ScreenShareSession,
  enable: boolean
): Promise<MediaStream | null> {
  if (enable) {
    const cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      },
      audio: false
    });

    // Добавление камеры к существующему стриму
    const cameraTrack = cameraStream.getVideoTracks()[0];
    session.stream.addTrack(cameraTrack);

    return cameraStream;
  } else {
    const cameraTrack = session.stream.getTracks().find(
      track => track.kind === 'video' && track !== session.track
    );
    if (cameraTrack) {
      session.stream.removeTrack(cameraTrack);
      cameraTrack.stop();
    }
    return null;
  }
}

/**
 * Изменение качества демонстрации
 */
export async function changeQuality(
  session: ScreenShareSession,
  quality: 'low' | 'medium' | 'high'
): Promise<void> {
  const track = session.track;
  
  if (!track.applyConstraints) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('applyConstraints not supported');
    }
    return;
  }

  const constraints: MediaTrackConstraints = {
    frameRate: quality === 'low' ? 15 : quality === 'medium' ? 24 : 30
  };

  if (quality === 'low') {
    constraints.width = { ideal: 640 };
    constraints.height = { ideal: 480 };
  } else if (quality === 'medium') {
    constraints.width = { ideal: 1280 };
    constraints.height = { ideal: 720 };
  } else {
    constraints.width = { ideal: 1920 };
    constraints.height = { ideal: 1080 };
  }

  await track.applyConstraints(constraints);
  if (process.env.NODE_ENV === 'development') {
    console.log('Screen share quality changed to:', quality);
  }
}

/**
 * Получение статистики демонстрации
 */
export function getScreenShareStats(session: ScreenShareSession): {
  duration: number;
  resolution: { width: number | null; height: number | null };
  frameRate: number | null;
  viewers: number;
} {
  const settings = session.track.getSettings();
  const duration = Date.now() - session.startedAt;

  return {
    duration,
    resolution: {
      width: settings.width || null,
      height: settings.height || null
    },
    frameRate: settings.frameRate || null,
    viewers: session.viewers.length
  };
}

/**
 * Компонент React для демонстрации экрана
 */
export interface ScreenShareComponentProps {
  onShareStart?: (session: ScreenShareSession) => void;
  onShareStop?: (sessionId: string) => void;
  onError?: (error: Error) => void;
  chatId: string;
  userId: string;
}

export function createScreenShareHook() {
  let session: ScreenShareSession | null = null;

  return {
    async start(config?: ScreenShareConfig): Promise<ScreenShareSession> {
      session = await startScreenShare(config);
      return session;
    },

    stop(): void {
      if (session) {
        stopScreenShare(session);
        session = null;
      }
    },

    getSession(): ScreenShareSession | null {
      return session;
    },

    isActive(): boolean {
      return session !== null;
    }
  };
}

/**
 * Проверка поддержки демонстрации экрана
 */
export function isScreenShareSupported(): boolean {
  return !!(
    navigator.mediaDevices &&
    navigator.mediaDevices.getDisplayMedia
  );
}

/**
 * Получение доступных источников для демонстрации
 */
export async function getAvailableSources(): Promise<{
  monitors: boolean;
  windows: boolean;
  tabs: boolean;
  audio: boolean;
}> {
  const supports = {
    monitors: true,
    windows: true,
    tabs: true,
    audio: false
  };

  // Проверка поддержки аудио
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: false
    } as any);
    supports.audio = true;
    stream.getTracks().forEach(track => track.stop());
  } catch {
    supports.audio = false;
  }

  return supports;
}
