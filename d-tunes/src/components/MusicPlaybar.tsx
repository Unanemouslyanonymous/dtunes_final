"use client";
import React, { useEffect, useRef, useState, useContext } from "react";
import { ClassValue } from "clsx";
import { Pause, Play, SkipBack, SkipForward, Repeat, Heart, HeartCrack, Plus, Minus } from "lucide-react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import axios from "axios";
import { AuthContext } from "@/context/authContext";
import { Playlist } from "@/app/models/userModel";

interface Song {
  _id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  url: string;
  isFavorite: boolean;
}

interface MusicPlaybarProps {
  className?: ClassValue;
  song: Song;
  onNext: () => void;
  onPrevious: () => void;
  onAddToFavorites: (song: Song) => void;
  onRemoveFromFavorites: (song: Song) => void;
}

const MusicPlaybar: React.FC<MusicPlaybarProps> = ({ className, song, onNext, onPrevious, onAddToFavorites, onRemoveFromFavorites }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  const { user } = authContext;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
      audioRef.current.addEventListener("timeupdate", () => {
        setCurrentTime(audioRef.current!.currentTime);
      });
      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current!.duration);
      });
      audioRef.current.addEventListener("ended", () => {
        onNext();
      });
    }
  }, [isLooping]);

  useEffect(() => {
    const handleCanPlayThrough = () => {
      audioRef.current!.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error('Error playing audio:', error);
        });
    };

    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      audioRef.current.load();
      audioRef.current.addEventListener('canplaythrough', handleCanPlayThrough, { once: true });

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
        }
      };
    }
  }, [song]);


  useEffect(() => {
    const logRecentlyPlayed = async () => {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/songs/recent`, { userId: user?._id ,songId: song._id }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      } catch (error) {
        console.error('Error logging recently played song:', error);
      }
    };

    if (song) {
      logRecentlyPlayed();
    }
  }, [song, user?._id]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error('Error playing audio:', error);
          });
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(event.target.value);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoopToggle = () => {
    setIsLooping(!isLooping);
  };

  const fetchPlaylists = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/playlists/${user?._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPlaylists(res.data.data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const addSongToPlaylist = async (playlistId: string) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/playlists/add-song`, { playlistId, songId: song._id }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Song added to playlist successfully!');
    } catch (error) {
      console.error('Error adding song to playlist:', error);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      fetchPlaylists();
    }
  }, [showDropdown]);
  useEffect(() => {
    if (song) {
      updateCurrentlyPlayingSong(song._id);
    }
  }, [song]);

  const updateCurrentlyPlayingSong = async (songId: string) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/songs/play`, { songId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (error) {
      console.error('Error updating currently playing song:', error);
    }
  };
  return (
    <MaxWidthWrapper
      className={`flex items-center flex-col justify-center min-w-2xl max-w-7xl border-1 rounded-t-full bg-violet-950/90 shadow-[0px_0px_63px_51px_rgba(162,_13,_220,_0.2)] fixed bottom-0 ${className}`}
    >
      <div className="w-full flex items-center justify-center">
        <audio ref={audioRef} src={song.url} />
        <button onClick={onPrevious} className="m-3 rounded-full text-white">
          <SkipBack size={42} strokeWidth={0.75} absoluteStrokeWidth />
        </button>
        <button onClick={handlePlayPause} className="m-3 rounded-full text-white">
          {isPlaying ? (
            <Pause size={48} strokeWidth={0.75} absoluteStrokeWidth />
          ) : (
            <Play size={48} strokeWidth={0.75} absoluteStrokeWidth />
          )}
        </button>
        <button onClick={onNext} className="m-3 rounded-full text-white">
          <SkipForward size={42} strokeWidth={0.75} absoluteStrokeWidth />
        </button>
        <button onClick={handleLoopToggle} className="m-3 rounded-full text-white">
          <Repeat size={42} strokeWidth={0.75} absoluteStrokeWidth className={isLooping ? 'text-yellow-500' : 'text-white'} />
        </button>
        {song.isFavorite ? 
        <button onClick={() => onRemoveFromFavorites(song)} className="m-3 rounded-full text-white">
          <HeartCrack size={42} strokeWidth={0.75} absoluteStrokeWidth color="pink"/>
        </button>
        : 
        <button onClick={() => onAddToFavorites(song)} className="m-3 rounded-full text-white">
          <Heart size={42} strokeWidth={0.75} absoluteStrokeWidth />
        </button>
        }
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="m-3 rounded-full text-white"
          >{
            showDropdown ? <Minus size={42} strokeWidth={0.75} absoluteStrokeWidth /> : <Plus size={42} strokeWidth={0.75} absoluteStrokeWidth />
          }
          </button>
          {showDropdown && (
            <div className="absolute bottom-full mb-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md z-50">
              <ul className="py-1">
                {playlists.map((playlist: Playlist) => (
                  <li
                    key={playlist._id}
                    className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => addSongToPlaylist(playlist._id)}
                  >
                    {playlist.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="w-full flex justify-between items-center">
        <div className="time-info flex justify-center text-white">
          <span>
            {new Date(currentTime * 1000).toISOString().substr(11, 8)}
          </span>
        </div>
        <div className="seek-bar w-full flex items-center">
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full"
          />
        </div>
        <div className="time-info flex justify-center text-white">
          <span>{new Date(duration * 1000).toISOString().substr(11, 8)}</span>
        </div>
      </div>
      <div className="text-white mt-2">
        <h3>Now Playing: {song.title} by {song.artist}</h3>
      </div>
    </MaxWidthWrapper>
  );
};

export default MusicPlaybar;
