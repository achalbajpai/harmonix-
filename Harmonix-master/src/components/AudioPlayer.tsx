import React, { useEffect, useRef, useState, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  Volume,
  VolumeX,
  Loader2,
} from "lucide-react";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";

interface AudioPlayerProps {
  audioUrl: string;
  className?: string;
  waveColor?: string;
  progressColor?: string;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

interface PlayerState {
  isReady: boolean;
  isLoading: boolean;
  hasError: boolean;
  volume: number;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
}

const initialState: PlayerState = {
  isReady: false,
  isLoading: true,
  hasError: false,
  volume: 1,
  duration: 0,
  currentTime: 0,
  isPlaying: false,
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  className = "",
  waveColor = "#e5e7eb",
  progressColor = "#3b82f6",
  onReady,
  onError,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>(initialState);
  const prevVolume = useRef<number>(1);

  const updatePlayerState = useCallback((updates: Partial<PlayerState>) => {
    setPlayerState((prev) => ({ ...prev, ...updates }));
  }, []);

  const VolumeIcon = useCallback(() => {
    if (playerState.volume === 0)
      return <VolumeX className="w-6 h-6 text-gray-600" />;
    if (playerState.volume < 0.33)
      return <Volume className="w-6 h-6 text-gray-600" />;
    if (playerState.volume < 0.67)
      return <Volume1 className="w-6 h-6 text-gray-600" />;
    return <Volume2 className="w-6 h-6 text-gray-600" />;
  }, [playerState.volume]);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      const wavesurfer = WaveSurfer.create({
        container: containerRef.current,
        waveColor,
        progressColor,
        height: 100,
        normalize: true,
        cursorWidth: 0,
        barWidth: 2,
        barGap: 1,
        barRadius: 3,
        url: audioUrl,
        mediaControls: false,
      });

      wavesurferRef.current = wavesurfer;

      wavesurfer.on("ready", () => {
        updatePlayerState({
          isReady: true,
          isLoading: false,
          duration: wavesurfer.getDuration(),
        });
        onReady?.();
      });

      wavesurfer.on("loading", (percent: number) => {
        updatePlayerState({ isLoading: percent < 100 });
      });

      wavesurfer.on("error", (error: Error) => {
        updatePlayerState({ hasError: true, isLoading: false });
        onError?.(error);
      });

      wavesurfer.on("audioprocess", () => {
        updatePlayerState({ currentTime: wavesurfer.getCurrentTime() });
      });

      wavesurfer.on("play", () => updatePlayerState({ isPlaying: true }));
      wavesurfer.on("pause", () => updatePlayerState({ isPlaying: false }));
      wavesurfer.on("finish", () => updatePlayerState({ isPlaying: false }));

      wavesurfer.setVolume(playerState.volume);

      return () => {
        wavesurfer.destroy();
      };
    } catch (error) {
      updatePlayerState({ hasError: true, isLoading: false });
      onError?.(error as Error);
    }
  }, [audioUrl, waveColor, progressColor, onReady, onError, updatePlayerState]);

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      if (playerState.isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
    }
  };

  const handleVolumeToggle = () => {
    if (wavesurferRef.current) {
      if (playerState.volume === 0) {
        const newVolume = prevVolume.current || 1;
        wavesurferRef.current.setVolume(newVolume);
        updatePlayerState({ volume: newVolume });
      } else {
        prevVolume.current = playerState.volume;
        wavesurferRef.current.setVolume(0);
        updatePlayerState({ volume: 0 });
      }
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(newVolume);
      updatePlayerState({ volume: newVolume });
      if (newVolume > 0) {
        prevVolume.current = newVolume;
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (playerState.hasError) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
        <p className="text-red-500">Error loading audio file</p>
      </div>
    );
  }

  return (
    <div
      className={`w-full max-w-4xl mx-auto p-4 bg-background rounded-lg shadow-md ${className}`}
    >
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant={"ghost"}
          onClick={handlePlayPause}
          className="p-3 rounded-full disabled:opacity-50"
          disabled={!playerState.isReady || playerState.isLoading}
          aria-label={playerState.isPlaying ? "Pause" : "Play"}
        >
          {playerState.isLoading ? (
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          ) : playerState.isPlaying ? (
            <Pause className="w-6 h-6 text-primary" />
          ) : (
            <Play className="w-6 h-6 text-primary" />
          )}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant={"ghost"}
            onClick={handleVolumeToggle}
            className="p-3 rounded-full"
            aria-label={playerState.volume === 0 ? "Unmute" : "Mute"}
          >
            <VolumeIcon />
          </Button>
          <Slider
            defaultValue={[0.8]}
            max={1}
            step={0.01}
            value={[playerState.volume]}
            onValueChange={handleVolumeChange}
            className="w-24"
          />
        </div>

        <span className="text-sm text-gray-600">
          {formatTime(playerState.currentTime)} /{" "}
          {formatTime(playerState.duration)}
        </span>
      </div>

      <div
        ref={containerRef}
        className={`w-full ${playerState.isLoading ? "opacity-50" : ""}`}
      />
    </div>
  );
};

export default AudioPlayer;
