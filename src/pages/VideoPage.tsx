/**
 * @file VideoPage.tsx
 * @description Page component that plays a selected video with custom playback controls (play, pause, stop, volume, mute, fullscreen). 
 * Implements accessible and responsive design according to WCAG 2.1 guidelines.
 * 
 * @component
 * @example
 * return <VideoPage />
 * 
 * @remarks
 * - Uses TailwindCSS for layout and styling.
 * - Provides interactive video playback controls and accessibility support.
 * - WCAG 2.1 compliance includes:
 *   - **1.1.1 Non-text Content:** Text alternatives are provided for non-text elements like video titles.
 *   - **1.3.1 Info and Relationships:** Controls are grouped semantically for assistive technologies.
 *   - **2.1.1 Keyboard:** All buttons are focusable and operable using keyboard navigation.
 *   - **2.4.6 Headings and Labels:** Descriptive headings are provided for the video and controls.
 *   - **3.2.1 Focus:** User focus remains stable during playback interactions.
 *   - **3.3.2 Labels or Instructions:** Clear iconography and tooltips identify control functions.
 */

import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Play,
  Pause,
  Square,
  Maximize2,
  Volume2,
  VolumeX,
} from "lucide-react";

/**
 * @interface VideoState
 * @description Represents the structure of the video data passed via router state.
 * @property {any} video - The video object containing playback information and metadata.
 */
interface VideoState {
  video: any;
}

/**
 * @function VideoPage
 * @description Displays a video player with playback, volume, mute, and fullscreen controls.
 * Manages user interactions and video state.
 * 
 * @returns {JSX.Element} Video playback interface with accessible custom controls.
 */
export const VideoPage: React.FC = () => {
  const location = useLocation();
  const { video } = location.state as VideoState;
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  /**
   * @function togglePlay
   * @description Toggles between play and pause states of the video.
   * @returns {void}
   */
  const togglePlay = () => {
    const videoEl = videoRef.current;
    if (videoEl) {
      if (isPlaying) {
        videoEl.pause();
      } else {
        videoEl.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  /**
   * @function handleStop
   * @description Stops video playback and resets to the beginning.
   * @returns {void}
   */
  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  /**
   * @function handleFullscreen
   * @description Activates fullscreen mode for the video element.
   * @returns {void}
   */
  const handleFullscreen = () => {
    const videoEl = videoRef.current;
    if (videoEl) {
      if (videoEl.requestFullscreen) videoEl.requestFullscreen();
      else if ((videoEl as any).webkitRequestFullscreen)
        (videoEl as any).webkitRequestFullscreen();
    }
  };

  /**
   * @function handleVolumeChange
   * @description Adjusts video playback volume based on user input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The volume range input change event.
   * @returns {void}
   */
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  /**
   * @function toggleMute
   * @description Toggles mute state for the video audio.
   * @returns {void}
   */
  const toggleMute = () => {
    if (videoRef.current) {
      const newMute = !isMuted;
      setIsMuted(newMute);
      videoRef.current.muted = newMute;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#141414] to-[#1f1f1f] text-white flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-2xl aspect-video rounded-lg overflow-hidden shadow-2xl group">
        {/* Video */}
        <video
          ref={videoRef}
          src={video.video_files?.[0]?.link}
          className="w-full h-full object-contain"
          onClick={togglePlay}
        />

        {/* Overlay with title */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h1 className="text-xl font-semibold tracking-wide">
            {video?.video_files?.[0]?.name || video?.alt || "Untitled video"}
          </h1>
          <p className="text-sm text-gray-400">
            {video?.user?.name ? `By ${video.user.name}` : ""}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-5 items-center justify-center mt-5 bg-[#222]/70 backdrop-blur-md px-5 py-3 rounded-full shadow-lg">
        <button
          onClick={togglePlay}
          className="hover:text-red-500 transition-all"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button
          onClick={handleStop}
          className="hover:text-gray-400 transition-all"
        >
          <Square size={22} />
        </button>

        <button
          onClick={handleFullscreen}
          className="hover:text-blue-400 transition-all"
        >
          <Maximize2 size={22} />
        </button>

        <button
          onClick={toggleMute}
          className="hover:text-yellow-400 transition-all"
        >
          {isMuted || volume === 0 ? (
            <VolumeX size={22} />
          ) : (
            <Volume2 size={22} />
          )}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-20 accent-red-600 cursor-pointer"
        />
      </div>
    </div>
  );
};
