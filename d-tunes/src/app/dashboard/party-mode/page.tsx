"use client";
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '@/context/authContext';
import { Playlist } from '@/app/models/userModel';
import { useRouter } from 'next/navigation';
import { FaChampagneGlasses } from 'react-icons/fa6';

const PartyModePage = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  const { user,isAuthenticated } = authContext;
  const [playlists, setPlaylists] = useState([]);
  const [friendPlaylists, setFriendPlaylists] = useState([]);
  const [selectedPlaylist1, setSelectedPlaylist1] = useState('');
  const [selectedPlaylist2, setSelectedPlaylist2] = useState('');
  const [partyPlaylist, setPartyPlaylist] = useState<Playlist | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated || !user) router.push('/login?origin=party-mode');
  },[isAuthenticated,router])
  useEffect(() => {
    
    fetchPlaylists();
    fetchFriendPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {console.log(user,isAuthenticated)
      if(user != undefined || user!= null){
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/playlists/${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPlaylists(res.data.data);}
      else{
        console.error('Auth Error, pls logout and login');  
      }
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const fetchFriendPlaylists = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/friends/playlists`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFriendPlaylists(res.data.data);
    } catch (error) {
      console.error('Error fetching friend playlists:', error);
    }
  };

  const createPartyPlaylist = async () => {
    if (!selectedPlaylist1 || !selectedPlaylist2) {
      alert('Please select two playlists');
      return;
    }
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/party-mode/create`, {
        playlistId1: selectedPlaylist1,
        playlistId2: selectedPlaylist2,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPartyPlaylist(res.data.data);
    } catch (error) {
      console.error('Error creating party playlist:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Party Mode</h1>

      <div className="mb-4">
        <h2 className="text-xl font-bold">Select Playlists</h2>
        <select
          value={selectedPlaylist1}
          onChange={(e) => setSelectedPlaylist1(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">Select First Playlist</option>
          {playlists.map((playlist: Playlist) => (
            <option key={playlist._id} value={playlist._id}>
              {playlist.name} (You)
            </option>
          ))}
          {friendPlaylists.map((playlist: any) => (
            <option key={playlist._id} value={playlist._id}>
              {playlist.name} ({playlist.owner.username})
            </option>
          ))}
        </select>
        <select
          value={selectedPlaylist2}
          onChange={(e) => setSelectedPlaylist2(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">Select Second Playlist</option>
          {playlists.map((playlist: Playlist) => (
            <option key={playlist._id} value={playlist._id}>
              {playlist.name} (You)
            </option>
          ))}
          {friendPlaylists.map((playlist: any) => (
            <option key={playlist._id} value={playlist._id}>
              {playlist.name} ({playlist.owner.username})
            </option>
          ))}
        </select>
        <button onClick={createPartyPlaylist} className="bg-blue-500 text-white p-2 rounded-md ml-2">
          Create Party Playlist
        </button>
      </div>

      {partyPlaylist && (
        <div>
          <h2 className="text-xl font-bold">{partyPlaylist.name} has been added to your playlist.. <br /> Enjoy the partyyy <FaChampagneGlasses className='text-primary' size={100}/></h2>
          <ul>
            {partyPlaylist.songs.map((song: any) => (
              <li key={song._id}>{song.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PartyModePage;
