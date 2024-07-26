import React, { useState, useEffect, useRef } from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { ClassValue } from "clsx";
import { FaBackwardStep, FaForwardStep } from "react-icons/fa6";
import { Pause, Play, SkipBack, SkipForward, Repeat } from "lucide-react";

interface Song {
  _id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  url: string;
}

interface MusicPlaybarProps {
  className?: ClassValue;
  songs: Song[];
}

const MusicPlaybar: React.FC<MusicPlaybarProps> = ({ className, songs }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleNext = () => {
    setCurrentTrack((currentTrack + 1) % songs.length);
    
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handlePrevious = () => {
    setCurrentTrack((currentTrack - 1 + songs.length) % songs.length);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleLoopToggle = () => {
    setIsLooping(!isLooping);
  };
console.log(currentTrack);
  return (
    <MaxWidthWrapper className={`flex items-center justify-center min-w-2xl max-w-7xl border-1 rounded-t-full bg-violet-950/90 shadow-[0px_0px_63px_51px_rgba(162,_13,_220,_0.2)] absolute bottom-0 ${className}`}>
      <audio ref={audioRef} src={songs[currentTrack].url} autoPlay={isPlaying} className="hidden" />
      <button onClick={handlePrevious} className="m-3 rounded-full text-white">
        <SkipBack size={42} strokeWidth={0.75} absoluteStrokeWidth />
      </button>
      <button onClick={handlePlayPause} className="m-3 rounded-full text-white">
        {isPlaying ? (
          <Pause size={48} strokeWidth={0.75} absoluteStrokeWidth />
        ) : (
          <Play size={48} strokeWidth={0.75} absoluteStrokeWidth />
        )}
      </button>
      <button onClick={handleNext} className="m-3 rounded-full text-white">
        <SkipForward size={42} strokeWidth={0.75} absoluteStrokeWidth />
      </button>
      <button onClick={handleLoopToggle} className="m-3 rounded-full text-white">
        <Repeat size={42} strokeWidth={0.75} absoluteStrokeWidth className={isLooping ? 'text-yellow-500' : 'text-white'} />
      </button>
    </MaxWidthWrapper>
  );
};

export default MusicPlaybar;
