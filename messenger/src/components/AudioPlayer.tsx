'use client';

import { FC, useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import './AudioPlayer.css';

interface AudioPlayerProps {
  src: string;
  duration?: number;
  fileName?: string;
}

export const AudioPlayer: FC<AudioPlayerProps> = ({ src, duration = 0, fileName = 'Audio message' }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setIsLoading(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const duration = audioRef.current.duration;

    const newTime = (clickX / width) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="audio-player-content">
        {/* Иконка */}
        <div className="audio-player-icon">
          <Volume2 size={20} />
        </div>

        {/* Контролы */}
        <div className="audio-player-controls">
          <button
            className="audio-play-btn"
            onClick={togglePlay}
            disabled={isLoading}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          {/* Прогресс бар */}
          <div 
            className="audio-progress-bar" 
            ref={progressRef}
            onClick={handleProgressClick}
          >
            <div 
              className="audio-progress-fill" 
              style={{ width: `${progressPercent}%` }}
            />
            <div className="audio-progress-thumb" style={{ left: `${progressPercent}%` }} />
          </div>

          {/* Время */}
          <div className="audio-time">
            <span className="audio-current-time">{formatTime(currentTime)}</span>
            <span className="audio-duration">/{formatTime(duration)}</span>
          </div>
        </div>

        {/* Громкость */}
        <button
          className="audio-mute-btn"
          onClick={toggleMute}
          title={isMuted ? 'Включить звук' : 'Выключить звук'}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {/* Название файла */}
      <div className="audio-file-name">{fileName}</div>

      {isLoading && (
        <div className="audio-loading-overlay">
          <div className="audio-spinner" />
        </div>
      )}
    </div>
  );
};
