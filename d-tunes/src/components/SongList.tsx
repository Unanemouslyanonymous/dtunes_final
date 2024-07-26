"use client";
import { useEffect, useState } from 'react';
import CustomAudioPlayer from './AudioPlayer';
import dotenv from 'dotenv';
dotenv.config();
interface Song {
  _id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  url: string;
}

const SongList = () => {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL+'/songs');
        const data = await res.json();
        if (data.success) {
          setSongs(data.data);
        } else {
          console.error('Failed to fetch songs');
        }
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };

    fetchSongs();
  }, []);

  return (
    <div>
      {songs.length > 0 && <CustomAudioPlayer songs={songs} />}
      <div>
        {songs.map((song) => (
          <div key={song._id}>
            <h3>{song.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongList;
