"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { AuthContext } from "@/context/authContext";
import { Heart, HeartCrack, List, Plus, Search, ChevronRight, Clock3, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState, useCallback } from "react";
import dotenv from "dotenv";
import MusicPlaybar from "@/components/MusicPlaybar";
import axios from "axios";
import { Playlist, userModel } from "../models/userModel";

dotenv.config();

const Dashboard = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  const { user, isAuthenticated } = authContext;
  const router = useRouter();
  const [songs, setSongs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredSongs, setFilteredSongs] = useState<any[]>([]);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [playlistName, setPlaylistName] = useState<string>("");
  const [recentSongs, setRecentSongs] = useState<any>([]);
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated || !user) router.push("/login?origin=dashboard");
  }, [isAuthenticated, router]);

  const fetchSongs = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/songs`);
      setSongs(response.data.data);
      setFilteredSongs(response.data.data);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/songs/favorites/${user?._id}`);
      setFavorites(response.data.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  }, [user?._id]);

  const fetchPlaylists = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/playlists/${user?._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPlaylists(response.data.data);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  }, [user?._id]);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/songs/recent/${user?._id}`);
        console.log(response.data.data);
        setRecentSongs(response.data.data);
      } catch (error) {
        console.error("Error fetching recent songs:", error);
      }
    };

    fetchRecent();
  }, [user?._id]);

  useEffect(() => {
    fetchSongs();
    fetchFavorites();
    fetchPlaylists();
  }, [fetchSongs, fetchFavorites, fetchPlaylists]);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredSongs(songs);
    } else {
      const results = songs.filter((song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSongs(results);
    }
  }, [searchQuery, songs]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSongClick = (song: any) => {
    setCurrentPlaylist(null);
    setCurrentSong(song);
    setSearchQuery("");
  };

  const handleAddToFavorites = async (song: any) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/songs/favorites/add/${user?._id}`, { songId: song._id }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      song.isFavorite = true;
      setFavorites((prevFavorites) => [...prevFavorites, song]);
      setSongs((prevSongs) => prevSongs.map((s) => (s._id === song._id ? song : s)));
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  const handleRemoveFromFavorites = async (song: any) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/songs/favorites/remove/${user?._id}`, { songId: song._id }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      song.isFavorite = false;
      setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav._id !== song._id));
      setSongs((prevSongs) => prevSongs.map((s) => (s._id === song._id ? song : s)));
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  const handleNext = () => {
    if (currentPlaylist && currentSong) {
      const currentIndex = currentPlaylist.songs.findIndex(
        (song: { _id: any }) => song._id === currentSong._id
      );
      const nextIndex = (currentIndex + 1) % currentPlaylist.songs.length;
      const nextSong = currentPlaylist.songs[nextIndex];
      setCurrentSong(nextSong);
    } else if (currentSong) {
      const currentIndex = songs.findIndex(
        (song) => song._id === currentSong._id
      );
      const nextIndex = (currentIndex + 1) % songs.length;
      setCurrentSong(songs[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (currentPlaylist && currentSong) {
      const currentIndex = currentPlaylist.songs.findIndex(
        (song: { _id: any }) => song._id === currentSong._id
      );
      const previousIndex =
        (currentIndex - 1 + currentPlaylist.songs.length) %
        currentPlaylist.songs.length;
      const prevSong = currentPlaylist.songs[previousIndex];
      setCurrentSong(prevSong);
    } else if (currentSong) {
      const currentIndex = songs.findIndex(
        (song) => song._id === currentSong._id
      );
      const previousIndex = (currentIndex - 1 + songs.length) % songs.length;
      setCurrentSong(songs[previousIndex]);
    }
  };

  const handleCreatePlaylist = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/playlists/create`, { name: playlistName, songs: [], isPrivate: true, currentUser: user }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      setPlaylists([...playlists, data.data]);
      setPlaylistName("");

      await fetchPlaylists();
      handleSelectPlaylist(data.data);
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };

  const handleAddSongToPlaylist = async (playlistId: string, song: any) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/playlists/add-song`, { playlistId, songId: song._id }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((playlist) => {
          if (playlist._id === playlistId) {
            return { ...playlist, songs: [...playlist.songs, song] };
          }
          return playlist;
        })
      );
    } catch (error) {
      console.error("Error adding song to playlist:", error);
    }
  };

  const handleRemoveSongFromPlaylist = async (playlistId: string, song: any) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/playlists/remove-song`, { playlistId, songId: song._id }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((playlist) => {
          if (playlist._id === playlistId) {
            return {
              ...playlist,
              songs: playlist.songs.filter((s: any) => s._id !== song._id),
            };
          }
          return playlist;
        })
      );
    } catch (error) {
      console.error("Error removing song from playlist:", error);
    }
  };

  const handleSelectPlaylist = async (playlist: Playlist) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/playlists/play/${playlist._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const fullPlaylist = response.data.data;
      setCurrentPlaylist(fullPlaylist);
      if (fullPlaylist.songs.length > 0) {
        setCurrentSong(fullPlaylist.songs[0]);
      }
    } catch (error) {
      console.error("Error fetching full playlist:", error);
    }
  };

  const handleGoToPlaylist = (playlist: Playlist) => {
    router.push(`/dashboard/all-songs?playlistId=${playlist._id}`);
  };

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  return (
    <MaxWidthWrapper>
      <div
        className="container mx-auto p-4 flex flex-col items-center overflow-y-auto"
        style={{ minHeight: "calc(100vh - 80px)" }}
      >
        <div className="relative w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-center mb-4">
            Welcome, {user?.username}!
          </h1>
          {user?.role === "artist" && (
            <button
              className="absolute top-4 right-4 bg-white text-purple-700 px-4 py-2 rounded-full shadow-md hover:bg-gray-200 transition"
              onClick={() => router.push("/dashboard/add-music")}
            >
              <Plus size={20} className="mr-2" /> Add Music
            </button>
          )}
        </div>

        <div className="relative w-full mt-8">
          <div className="relative flex items-center w-full bg-gray-200 dark:bg-gray-800 rounded-full shadow-lg p-2">
            <Search
              size={24}
              className="ml-4 text-gray-600 dark:text-gray-300"
            />
            <input
              type="text"
              placeholder="Search Your Song"
              value={searchQuery}
              onChange={handleSearchChange}
              className="flex-grow bg-transparent focus:outline-none ml-4 text-gray-900 dark:text-gray-100"
            />
            {searchQuery && (
              <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg overflow-y-auto max-h-60 z-10">
                {filteredSongs.length > 0 ? (
                  filteredSongs.map((song) => (
                    <div
                      key={song._id}
                      onClick={() => handleSongClick(song)}
                      className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      {song.title}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500">No songs found</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-8 h-[40vh]">
          <div className="relative bg-white dark:bg-gray-800 p-6 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
            <div className="relative flex flex-row items-center justify-center">
              <Heart size={32} className="absolute left-0 text-purple-700" />
              <h2 className="text-xl font-bold ml-2">Favourites</h2>
            </div>

            <div className="flex flex-col w-full h-48 mt-4 overflow-y-auto">
              {favorites.length > 0 ? (
                favorites.map((song) => (
                  <div
                    key={song._id}
                    className="flex items-center justify-between p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition"
                  >
                    <span
                      className="cursor-pointer"
                      onClick={() => setCurrentSong(song)}
                    >
                      {song.title}
                    </span>
                    <button onClick={() => handleRemoveFromFavorites(song)}>
                      <HeartCrack
                        size={20}
                        className="text-red-500 hover:text-red-700 transition"
                      />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No favorites yet</p>
              )}
            </div>
          </div>

          <div className="relative bg-white dark:bg-gray-800 p-6 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
            <div className=" relative flex flex-row items-cente justify-center">
              <List size={32} className="absolute text-purple-700 left-0" />

              <h2 className="text-xl font-bold ml-2">Your Playlists</h2>
            </div>

            <div className="flex flex-col w-full h-48 mt-4 overflow-y-auto">
              <button
                onClick={toggleAccordion}
                className="w-full flex items-center justify-between bg-purple-700 text-white px-4 py-2 rounded-full mt-2 hover:bg-purple-500 transition"
              >
                Create Playlist
                {isAccordionOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {isAccordionOpen && (
                <div className="w-full bg-gray-100 dark:bg-gray-900 p-4 mt-2 rounded-md">
                  <input
                    type="text"
                    placeholder="New playlist name"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    className="bg-transparent focus:outline-none w-full p-2 border-b border-gray-500"
                  />
                  <button
                    onClick={handleCreatePlaylist}
                    className="bg-purple-700 text-white px-4 py-2 rounded-full mt-2 hover:bg-purple-500 transition"
                  >
                    Create Playlist
                  </button>
                </div>
              )}
              {playlists && playlists.length > 0 ? (
                playlists.map((playlist) => (
                  <div
                    key={playlist._id}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition"
                  >
                    <span
                      className="cursor-pointer"
                      onClick={() => handleSelectPlaylist(playlist)}
                    >
                      {playlist.name}
                    </span>
                    <ChevronRight
                      size={20}
                      className="text-gray-500 hover:text-gray-700 transition cursor-pointer"
                      onClick={() => handleGoToPlaylist(playlist)}
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No playlists yet</p>
              )}
            </div>
          </div>

          <div className="relative bg-white dark:bg-gray-800 p-6 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
            <div className="relative flex flex-row items-center justify-center">
              <Clock3 size={32} className="absolute left-0 text-purple-700" />
              <h2 className="text-xl font-bold ml-2">Recently Played</h2>
            </div>

            <div className="flex flex-col w-full h-48 mt-4 overflow-y-auto">
              {recentSongs.slice(0, 5).map((song: any) => (
                <div
                  key={song._id}
                  className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition"
                >
                  <span
                    className="cursor-pointer"
                    onClick={() => setCurrentSong(song)}
                  >
                    {song.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {currentSong && (
        <div className="flex justify-center w-full">
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

export default Dashboard;
