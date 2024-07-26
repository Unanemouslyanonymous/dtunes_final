"use client";
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '@/context/authContext';
import { Playlist } from '@/app/models/userModel';
import { useRouter } from 'next/navigation';
import MusicPlaybar from "@/components/MusicPlaybar";
import dotenv from "dotenv";
import { Play, ChevronDown, ChevronUp } from 'lucide-react';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

dotenv.config();

const PlaylistsPage = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  const { user, isAuthenticated } = authContext;
  const router = useRouter();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [accordionOpen, setAccordionOpen] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) router.push('/login?origin=playlists');
  }, [router, isAuthenticated]);

  useEffect(() => {
    fetchPlaylists();
  }, []);

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

  const handlePlaylistClick = async (playlistId: string) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/playlists/play/${playlistId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCurrentPlaylist(res.data.data);
      setCurrentSong(res.data.data.songs[0]);
    } catch (error) {
      console.error('Error fetching playlist:', error);
    }
  };

  const handleNext = () => {
    if (currentPlaylist && currentSong) {
      const currentIndex = currentPlaylist.songs.findIndex((song: { _id: any; }) => song._id === currentSong._id);
      const nextIndex = (currentIndex + 1) % currentPlaylist.songs.length;
      setCurrentSong(currentPlaylist.songs[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (currentPlaylist && currentSong) {
      const currentIndex = currentPlaylist.songs.findIndex((song: { _id: any; }) => song._id === currentSong._id);
      const previousIndex = (currentIndex - 1 + currentPlaylist.songs.length) % currentPlaylist.songs.length;
      setCurrentSong(currentPlaylist.songs[previousIndex]);
    }
  };

  const handleAddToFavorites = async (song: any) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/songs/favorites/add/${user?._id}`, { songId: song._id }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      song.isFavorite = true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const handleRemoveFromFavorites = async (song: any) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/songs/favorites/remove/${user?._id}`, { songId: song._id }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      song.isFavorite = false;
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleThumbnailUpload = async (playlistId: string) => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = async () => {
      const base64String = reader.result;
      setUploadStatus('Uploading...');
      try {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/playlists/${playlistId}/thumbnail`, { thumbnail: base64String }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        fetchPlaylists();
        setPreview(null);
        setSelectedFile(null);
        setAccordionOpen(null);
        setErrorMessage(null); 
        setUploadStatus('Upload successful');
      } catch (error) {
        console.error('Error uploading thumbnail:', error);
        setErrorMessage('Error uploading thumbnail. Please try again.');
        setAccordionOpen(null);
        setUploadStatus(null);
      }
    };
  };

  const toggleAccordion = (playlistId: string) => {
    setAccordionOpen(accordionOpen === playlistId ? null : playlistId);
  };

  return (
    <MaxWidthWrapper>
      <div className="container mx-auto p-4">
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
            {errorMessage}
          </div>
        )}
        {uploadStatus && (
          <div className="mb-4 p-4 bg-blue-100 text-blue-800 rounded">
            {uploadStatus}
          </div>
        )}
        <h1 className="text-2xl font-bold mb-4">Your Playlists</h1>
        <div className="flex flex-wrap -mx-2">
          {playlists.map((playlist) => (
            <div key={playlist._id} className="relative w-full md:w-1/2 lg:w-1/3 px-2 mb-4">
              <div className="p-4 border rounded shadow hover:shadow-lg transition cursor-pointer flex flex-col justify-between h-full">
                <div onClick={() => handlePlaylistClick(playlist._id)}>
                  {playlist.thumbnail && (
                    <img src={playlist.thumbnail} alt="Playlist Thumbnail" className="w-full h-48 object-cover mb-4 rounded" />
                  )}
                  <h2 className="text-xl font-bold mb-2">{playlist.name}</h2>
                  <p className="text-gray-600">Songs: {playlist.songs.length}</p>
                </div>
                <div className="flex justify-end mt-4">
                  <Play size={20} strokeWidth={2} className="text-blue-500" />
                </div>
                <div className="mt-4">
                  <button 
                    onClick={() => toggleAccordion(playlist._id)} 
                    className="flex items-center justify-between w-full bg-gray-100 p-2 rounded"
                  >
                    <span>Change Thumbnail</span>
                    {accordionOpen === playlist._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {accordionOpen === playlist._id && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded p-4 mt-2 z-50">
                      <input type="file" accept="image/*" onChange={handleFileChange} />
                      {preview && (
                        <div>
                          <img src={preview} alt="Preview" className="w-full h-48 object-cover mt-4 rounded" />
                          <button onClick={() => handleThumbnailUpload(playlist._id)} className="mt-2 p-2 bg-blue-500 text-white rounded">
                            Upload Thumbnail
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {currentSong && (
          <div className="flex items-center justify-center">
            <MusicPlaybar
              song={currentSong}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onAddToFavorites={handleAddToFavorites}
              onRemoveFromFavorites={handleRemoveFromFavorites}
            />
          </div>
        )}
      </div>
    </MaxWidthWrapper>
  );
};

export default PlaylistsPage;
