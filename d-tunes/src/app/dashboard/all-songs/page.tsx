"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { AuthContext } from "@/context/authContext";
import { Heart, HeartCrack, Plus, ChevronLeft, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import dotenv from "dotenv";
import MusicPlaybar from "@/components/MusicPlaybar";
import axios from "axios";

dotenv.config();

const AllSongsPage = () => {
  const authContext: any = useContext(AuthContext);
  if (!authContext) return null;
  const { user, isAuthenticated } = authContext;
  const router = useRouter();
  const searchParams = useSearchParams();
  const playlistIdFromQuery = searchParams.get("playlistId");
  const [songs, setSongs] = useState<any[]>([]);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<any>(null);
  const [songsInPlaylist, setSongsInPlaylist] = useState<any[]>([]);
  const [sortOption, setSortOption] = useState<string>("");
  const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({});

  if (!isAuthenticated || !user) {
    router.push("/login?origin=all-songs");
    return null;
  }

  useEffect(() => {
    const getSongs = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/songs`);
        setSongs(response.data.data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    const getFavorites = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/songs/favorites/${user._id}`);
        setFavorites(response.data.data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    const getPlaylist = async () => {
      if (playlistIdFromQuery) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/playlists/play/${playlistIdFromQuery}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const data = response.data;
          if (data.success) {
            setCurrentPlaylist(data.data);
            setSongsInPlaylist(data.data.songs);
          } else {
            console.error("Playlist not found");
          }
        } catch (error) {
          console.error("Error fetching playlist:", error);
        }
      }
    };

    getSongs();
    getFavorites();
    getPlaylist();
  }, [playlistIdFromQuery, user._id]);

  const handleAddToFavorites = async (song: any) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/songs/favorites/add/${user._id}`,
        { songId: song._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      song.isFavorite = true;
      setFavorites([...favorites, song]);
      setSongs([...songs]);
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  const handleRemoveFromFavorites = async (song: any) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/songs/favorites/remove/${user._id}`,
        { songId: song._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      song.isFavorite = false;
      setFavorites(favorites.filter((fav) => fav._id !== song._id));
      setSongs([...songs]);
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  const handleAddSongToPlaylist = async (playlistId: string, song: any) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/playlists/add-song`,
        { playlistId, songId: song._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const updatedPlaylist = { ...currentPlaylist, songs: [...currentPlaylist.songs, song] };
      setCurrentPlaylist(updatedPlaylist);
      setSongsInPlaylist(updatedPlaylist.songs);
    } catch (error) {
      console.error("Error adding song to playlist:", error);
    }
  };

  const handleRemoveSongFromPlaylist = async (playlistId: string, song: any) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/playlists/remove-song`,
        { playlistId, songId: song._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const updatedPlaylist = {
        ...currentPlaylist,
        songs: currentPlaylist.songs.filter((s: any) => s._id !== song._id),
      };
      setCurrentPlaylist(updatedPlaylist);
      setSongsInPlaylist(updatedPlaylist.songs);
    } catch (error) {
      console.error("Error removing song from playlist:", error);
    }
  };

  const handleAddToPlaylist = (song: any) => {
    if (!currentPlaylist) {
      console.error("No playlist selected");
      return;
    }
    handleAddSongToPlaylist(currentPlaylist._id, song);
  };

  const handleRemoveFromPlaylist = (song: any) => {
    if (!currentPlaylist) {
      console.error("No playlist selected");
      return;
    }
    handleRemoveSongFromPlaylist(currentPlaylist._id, song);
  };

  const isSongInPlaylist = (songId: string) => {
    return songsInPlaylist.some((song) => song._id === songId);
  };

  const handleNext = () => {
    if (currentPlaylist && currentSong) {
      const currentIndex = currentPlaylist.songs.findIndex((song: { _id: any }) => song._id === currentSong._id);
      const nextIndex = (currentIndex + 1) % currentPlaylist.songs.length;
      setCurrentSong(currentPlaylist.songs[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (currentPlaylist && currentSong) {
      const currentIndex = currentPlaylist.songs.findIndex((song: { _id: any }) => song._id === currentSong._id);
      const previousIndex = (currentIndex - 1 + currentPlaylist.songs.length) % currentPlaylist.songs.length;
      setCurrentSong(currentPlaylist.songs[previousIndex]);
    }
  };

  const handleSort = (option: string) => {
    setSortOption(option);
  };

  const sortedSongs = () => {
    switch (sortOption) {
      case "favorites":
        return favorites;
      case "artist":
        return groupBy(songs, "artist");
      case "genre":
        return groupBy(songs, "genre");
      default:
        return songs;
    }
  };

  const groupBy = (array: any[], key: string) => {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
      return result;
    }, {});
  };

  const toggleAccordion = (group: string) => {
    setIsOpen((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <MaxWidthWrapper>
      <div className="relative min-h-[60vh] w-90vh flex flex-col justify-start sm:gap-12 p-4 md:p-10">
        <div className="flex justify-between items-center text-center">
          <h1 className="text-2xl font-bold">All Songs</h1>
          <button
            className="flex items-center text-gray-200 bg-violet-950 rounded-full p-2 hover:bg-purple-900/50 transition-all duration-300"
            onClick={() => router.push("/dashboard")}
          >
            <ChevronLeft size={20} strokeWidth={2} className="mr-1" />
            Back to Dashboard
          </button>
        </div>
        <div className="flex flex-row justify-evenly items-center "><label>Sort By:
        </label>
          <select
            onChange={(e) => handleSort(e.target.value)}
            value={sortOption}
            className="p-2 border rounded-md w-[60vw]"
          >
            <option value="">All</option>
            <option value="favorites">Favorites</option>
            <option value="artist">Artist</option>
            <option value="genre">Genre</option>
          </select>
        </div>
        <div className="flex flex-col mt-4">
          {sortOption === "artist" || sortOption === "genre" ? (
            Object.entries(sortedSongs()).map(([group, songs]: any) => (
              <div key={group} className="mb-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleAccordion(group)}
                >
                  <h2 className="text-xl font-bold">{group}</h2>
                  {isOpen[group] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                {isOpen[group] && (
                  <div className="mt-2">
                    {songs.map((song: any) => (
                      <div
                        key={song._id}
                        className="flex items-center justify-between p-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 rounded-lg"
                      >
                        <div className="flex items-center">
                          <span
                            className="cursor-pointer text-lg font-semibold"
                            onClick={() => setCurrentSong(song)}
                          >
                            {song.title}
                          </span>
                          {favorites.some((fav) => fav._id === song._id) ? (
                            <button onClick={() => handleRemoveFromFavorites(song)}>
                              <HeartCrack
                                size={20}
                                strokeWidth={2}
                                className="ml-2 text-pink-500 hover:text-red-600 transition duration-300"
                              />
                            </button>
                          ) : (
                            <button onClick={() => handleAddToFavorites(song)}>
                              <Heart
                                size={20}
                                strokeWidth={2}
                                className="ml-2 text-gray-500 hover:text-pink-500 transition duration-300"
                              />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center">
                          {isSongInPlaylist(song._id) ? (
                            <button onClick={() => handleRemoveFromPlaylist(song)}>
                              <CheckCircle size={20} strokeWidth={2} className="text-green-500 ml-2 hover:text-red-600 transition duration-300" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAddToPlaylist(song)}
                              className="text-white bg-violet-950 rounded-full px-2 py-1 hover:bg-violet-700 transition duration-300"
                            >
                              <Plus size={20} strokeWidth={2} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            sortedSongs().map((song: any) => (
              <div
                key={song._id}
                className="flex items-center justify-between p-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 rounded-lg"
              >
                <div className="flex items-center">
                  <span
                    className="cursor-pointer text-lg font-semibold"
                    onClick={() => setCurrentSong(song)}
                  >
                    {song.title}
                  </span>
                  {favorites.some((fav) => fav._id === song._id) ? (
                    <button onClick={() => handleRemoveFromFavorites(song)}>
                      <HeartCrack
                        size={20}
                        strokeWidth={2}
                        className="ml-2 text-pink-500 hover:text-red-600 transition duration-300"
                      />
                    </button>
                  ) : (
                    <button onClick={() => handleAddToFavorites(song)}>
                      <Heart
                        size={20}
                        strokeWidth={2}
                        className="ml-2 text-gray-500 hover:text-pink-500 transition duration-300"
                      />
                    </button>
                  )}
                </div>
                <div className="flex items-center">
                  {isSongInPlaylist(song._id) ? (
                    <button onClick={() => handleRemoveFromPlaylist(song)}>
                      <CheckCircle size={20} strokeWidth={2} className="text-green-500 ml-2 hover:text-red-600 transition duration-300" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToPlaylist(song)}
                      className="text-white bg-violet-950 rounded-full px-2 py-1 hover:bg-violet-700 transition duration-300"
                    >
                      <Plus size={20} strokeWidth={2} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {currentSong && (
        <div className="flex justify-center mt-4">
          <MusicPlaybar
            song={currentSong}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onAddToFavorites={handleAddToFavorites}
            onRemoveFromFavorites={handleRemoveFromFavorites}
          />
        </div>
      )}
    </MaxWidthWrapper>
  );
};

export default AllSongsPage;
