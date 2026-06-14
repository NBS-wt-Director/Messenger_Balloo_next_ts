'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Square, Send, X, Play, Pause, Trash2, AlertTriangle } from 'lucide-react';

export interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob, duration: number) => void;
  maxDuration?: number; // seconds (default: 30)
  minDuration?: number; // seconds (default: 1)
  autoSend?: boolean;
  className?: string;
}

export function VoiceRecorder({
  onRecordingComplete,
  maxDuration = 30,
  minDuration = 1,
  autoSend = false,
  className = ''
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Timer for recording duration
  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setDuration(prev => {
        if (prev >= maxDuration) {
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  }, [maxDuration]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Start recording
  const startRecording = async () => {
    try {
      setError(null);
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);
      setAudioBlob(null);
      setAudioUrl(null);

      startTimer();
    } catch (err: any) {
      setError('Не удалось получить доступ к микрофону: ' + err.message);
      console.error('Recording error:', err);
    }
  };

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      stopTimer();
      setIsRecording(false);
      setIsPaused(false);
    }
  }, [isRecording, stopTimer]);

  // Pause/Resume recording
  const togglePause = () => {
    if (!mediaRecorderRef.current) return;

    if (isPaused) {
      mediaRecorderRef.current.resume();
      startTimer();
      setIsPaused(false);
    } else {
      mediaRecorderRef.current.pause();
      stopTimer();
      setIsPaused(true);
    }
  };

  // Cancel recording
  const cancelRecording = () => {
    stopRecording();
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
  };

  // Send recording
  const sendRecording = () => {
    if (audioBlob && duration >= minDuration) {
      onRecordingComplete(audioBlob, duration);
      
      if (autoSend) {
        cancelRecording();
      }
    } else if (duration < minDuration) {
      setError(`Минимальная длительность: ${minDuration} сек`);
    }
  };

  // Play/Stop playback
  const togglePlayback = () => {
    if (!audioUrl || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Handle audio playback end
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, [audioUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, []);

  // Format duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Visualizer bars (simulated)
  const renderVisualizer = () => {
    if (!isRecording) return null;

    return (
      <div className="voice-visualizer">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`visualizer-bar ${isPaused ? 'paused' : ''}`}
            style={{
              height: isPaused
                ? '4px'
                : `${Math.random() * 24 + 4}px`,
              animationDelay: `${i * 0.05}s`
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`voice-recorder ${className}`}>
      {/* Error message */}
      {error && (
        <div className="voice-error">
          <AlertTriangle size={16} />
          <span>{error}</span>
          <button onClick={() => setError(null)}><X size={14} /></button>
        </div>
      )}

      {/* Recording state */}
      {isRecording ? (
        <div className="voice-recording-state">
          {/* Timer */}
          <div className={`voice-timer ${duration > maxDuration * 0.8 ? 'warning' : ''}`}>
            {formatDuration(duration)} / {formatDuration(maxDuration)}
          </div>

          {/* Visualizer */}
          {renderVisualizer()}

          {/* Controls */}
          <div className="voice-controls">
            {/* Cancel */}
            <button className="voice-btn voice-btn-cancel" onClick={cancelRecording}>
              <X size={24} />
            </button>

            {/* Pause/Resume */}
            <button className="voice-btn voice-btn-pause" onClick={togglePause}>
              {isPaused ? <Mic size={24} /> : <Pause size={24} />}
            </button>

            {/* Stop */}
            <button className="voice-btn voice-btn-stop" onClick={stopRecording}>
              <Square size={24} />
            </button>
          </div>

          {/* Recording indicator */}
          <div className="recording-indicator">
            <div className="recording-dot"></div>
            <span>{isPaused ? 'На паузе' : 'Запись...'}</span>
          </div>
        </div>
      ) : audioBlob ? (
        /* Preview state */
        <div className="voice-preview-state">
          {/* Audio player */}
          <div className="voice-player">
            <button className="voice-btn voice-btn-play" onClick={togglePlayback}>
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <div className="voice-player-info">
              <span className="voice-duration">{formatDuration(duration)}</span>
              <span className="voice-format">WebM Audio</span>
            </div>

            {/* Hidden audio element */}
            <audio
              ref={audioRef}
              src={audioUrl || undefined}
              preload="metadata"
            />
          </div>

          {/* Controls */}
          <div className="voice-controls">
            {/* Discard */}
            <button className="voice-btn voice-btn-cancel" onClick={cancelRecording}>
              <Trash2 size={24} />
            </button>

            {/* Send */}
            <button 
              className={`voice-btn voice-btn-send ${duration < minDuration ? 'disabled' : ''}`}
              onClick={sendRecording}
              disabled={duration < minDuration}
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      ) : (
        /* Idle state */
        <button className="voice-btn voice-btn-record" onClick={startRecording}>
          <Mic size={24} />
          <span>Записать голосовое</span>
        </button>
      )}

      {/* Max duration warning */}
      {duration > maxDuration * 0.8 && isRecording && (
        <div className="voice-warning">
          <AlertTriangle size={16} />
          <span>Почти достигнут лимит</span>
        </div>
      )}
    </div>
  );
}
