'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward, Settings, Download } from 'lucide-react';

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  showControls?: boolean;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  className?: string;
}

export function VideoPlayer({
  src,
  poster,
  title,
  autoPlay = false,
  loop = false,
  muted = false,
  showControls = true,
  onTimeUpdate,
  onEnded,
  className = ''
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControlsOverlay, setShowControlsOverlay] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration;

    setCurrentTime(current);
    onTimeUpdate?.(current, dur);
  };

  // Handle loaded metadata
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;

    setDuration(videoRef.current.duration);
    setIsLoading(false);

    if (autoPlay) {
      videoRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  // Handle video end
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    onEnded?.();
  };

  // Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Volume control
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      setIsMuted(vol === 0);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (!videoRef.current) return;

    if (isMuted) {
      videoRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = async () => {
    if (!playerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await playerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  // Change playback rate
  const changePlaybackRate = () => {
    const rates = [0.5, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    
    setPlaybackRate(nextRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextRate;
    }
  };

  // Download video
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = src;
    a.download = title || 'video.mp4';
    a.click();
  };

  // Skip forward/backward
  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
  };

  // Show controls on mouse move
  const handleMouseMove = () => {
    setShowControlsOverlay(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControlsOverlay(false);
      }
    }, 3000);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Progress percentage
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={playerRef}
      className={`video-player ${className} ${isFullscreen ? 'fullscreen' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControlsOverlay(false)}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop={loop}
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onClick={togglePlay}
        className="video-element"
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="video-loading">
          <div className="loading-spinner"></div>
        </div>
      )}

      {/* Play button overlay */}
      {!isPlaying && !isLoading && (
        <div className="video-play-overlay" onClick={togglePlay}>
          <div className="play-button-large">
            <Play size={48} />
          </div>
        </div>
      )}

      {/* Controls overlay */}
      {showControls && (
        <div className={`video-controls-overlay ${showControlsOverlay ? 'visible' : ''}`}>
          {/* Top bar */}
          {title && (
            <div className="video-top-bar">
              <span className="video-title">{title}</span>
            </div>
          )}

          {/* Center controls */}
          <div className="video-center-controls">
            <button className="video-control-btn" onClick={() => skip(-10)}>
              <SkipBack size={24} />
            </button>
            <button className="video-control-btn play-btn" onClick={togglePlay}>
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>
            <button className="video-control-btn" onClick={() => skip(10)}>
              <SkipForward size={24} />
            </button>
          </div>

          {/* Bottom bar */}
          <div className="video-bottom-bar">
            {/* Progress bar */}
            <div className="video-progress-container">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="video-progress-bar"
                style={{
                  background: `linear-gradient(to right, #0066FF ${progressPercent}%, #ccc ${progressPercent}%)`
                }}
              />
            </div>

            {/* Controls row */}
            <div className="video-controls-row">
              {/* Left controls */}
              <div className="video-controls-left">
                <button className="video-control-btn" onClick={togglePlay}>
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                {/* Volume */}
                <div className="video-volume-control">
                  <button className="video-control-btn" onClick={toggleMute}>
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="video-volume-bar"
                  />
                </div>

                {/* Time */}
                <span className="video-time">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Right controls */}
              <div className="video-controls-right">
                {/* Playback rate */}
                <button className="video-control-btn" onClick={changePlaybackRate}>
                  {playbackRate}x
                </button>

                {/* Download */}
                <button className="video-control-btn" onClick={handleDownload}>
                  <Download size={20} />
                </button>

                {/* Fullscreen */}
                <button className="video-control-btn" onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
