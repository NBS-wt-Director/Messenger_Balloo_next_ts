'use client';

import { FC, useEffect, useState, useRef } from 'react';
import { useAlert } from '@/hooks/useAlert';
import { 
  Phone, 
  PhoneOff, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Monitor,
  Settings
} from 'lucide-react';
import './CallInterface.css';

interface CallInterfaceProps {
  callId: string;
  type: 'audio' | 'video';
  peerId: string;
  peerName: string;
  peerAvatar?: string;
  isInitiator: boolean;
  onEnd: (callId: string, duration: number) => void;
  onSignal: (callId: string, data: any) => Promise<void>;
}

export const CallInterface: FC<CallInterfaceProps> = ({
  callId,
  type,
  peerId,
  peerName,
  peerAvatar,
  isInitiator,
  onEnd,
  onSignal
}) => {
  const { alert, AlertComponent } = useAlert();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(type === 'audio');
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    startCall();
    
    return () => {
      cleanup();
    };
  }, []);

  const startCall = async () => {
    try {
      // Запрос доступа к медиа
      const constraints: MediaStreamConstraints = {
        audio: true,
        video: type === 'video' ? { width: 1280, height: 720 } : false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Инициализация WebRTC
      await initializePeerConnection();

      if (isInitiator) {
        await createOffer();
      }

    } catch (error: any) {
      console.error('[Call] Error:', error);
      alert({ 
        message: error.name === 'NotAllowedError' 
          ? 'Нет доступа к камере/микрофону' 
          : 'Ошибка подключения', 
        type: 'error' 
      });
      endCall();
    }
  };

  const initializePeerConnection = async () => {
    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    const pc = new RTCPeerConnection(configuration);
    peerConnectionRef.current = pc;

    // Добавляем треки
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    // Обработка ICE кандидатов
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        onSignal(callId, { type: 'ice-candidate', candidate: event.candidate });
      }
    };

    // Обработка удалённого потока
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        setIsConnected(true);
        setIsConnecting(false);
        startTimeRef.current = Date.now();
        
        // Таймер длительности
        const timer = setInterval(() => {
          setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }, 1000);

        return () => clearInterval(timer);
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        endCall();
      }
    };
  };

  const createOffer = async () => {
    if (!peerConnectionRef.current) return;

    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      
      await onSignal(callId, { type: 'offer', offer });
    } catch (error) {
      console.error('[Call] Create offer error:', error);
    }
  };

  const createAnswer = async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return;

    try {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      
      await onSignal(callId, { type: 'answer', answer });
    } catch (error) {
      console.error('[Call] Create answer error:', error);
    }
  };

  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    if (!peerConnectionRef.current) return;

    try {
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('[Call] ICE candidate error:', error);
    }
  };

  const endCall = () => {
    const callDuration = startTimeRef.current 
      ? Math.floor((Date.now() - startTimeRef.current) / 1000)
      : 0;

    cleanup();
    onEnd(callId, callDuration);
  };

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    // В реальности нужно переключать устройство вывода
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="call-interface">
      <div className="call-video-container">
        {/* Remote video */}
        <video
          ref={remoteVideoRef}
          className="call-remote-video"
          autoPlay
          playsInline
        />

        {/* Local video (picture-in-picture) */}
        {type === 'video' && (
          <div className="call-local-video-container">
            <video
              ref={localVideoRef}
              className="call-local-video"
              autoPlay
              muted
              playsInline
            />
            {isVideoOff && (
              <div className="call-video-off-overlay">
                <VideoOff size={32} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Call info overlay */}
      <div className="call-info-overlay">
        <div className="call-peer-info">
          {peerAvatar ? (
            <img src={peerAvatar} alt={peerName} className="call-peer-avatar" />
          ) : (
            <div className="call-peer-avatar-placeholder">
              {peerName[0]}
            </div>
          )}
          <div className="call-peer-details">
            <span className="call-peer-name">{peerName}</span>
            <span className="call-status">
              {isConnecting ? 'Подключение...' : isConnected ? formatDuration(duration) : 'Звонок...'}
            </span>
          </div>
        </div>
      </div>

      {/* Call controls */}
      <div className="call-controls">
        <button
          className={`call-control-btn ${isMuted ? 'active' : ''}`}
          onClick={toggleMute}
          title={isMuted ? 'Включить микрофон' : 'Выключить микрофон'}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>

        {type === 'video' && (
          <button
            className={`call-control-btn ${isVideoOff ? 'active' : ''}`}
            onClick={toggleVideo}
            title={isVideoOff ? 'Включить камеру' : 'Выключить камеру'}
          >
            {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
          </button>
        )}

        <button
          className={`call-control-btn ${!isSpeakerOn ? 'active' : ''}`}
          onClick={toggleSpeaker}
          title={isSpeakerOn ? 'Выключить динамик' : 'Включить динамик'}
        >
          {!isSpeakerOn ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>

        <button
          className="call-control-btn end-call"
          onClick={endCall}
          title="Завершить звонок"
        >
          <PhoneOff size={28} />
        </button>
      </div>

      {AlertComponent}
    </div>
  );
};
