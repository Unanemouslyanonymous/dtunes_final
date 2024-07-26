"use client";
import { useState } from 'react';
import dotenv from 'dotenv';

dotenv.config();

const AddMusic = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [formData, setFormData] = useState({
    artist: '',
    album: '',
    duration: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData();
    if (files) {
      Array.from(files).forEach((file) => {
        data.append('files', file);
      });
    }
    data.append('artist', formData.artist);
    data.append('album', formData.album);
    data.append('duration', formData.duration);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/songs', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (result.success) {
        alert('Songs uploaded successfully!');
      } else {
        alert('Failed to upload songs');
      }
    } catch (error) {
      console.error('Error uploading songs:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        required
      />
      <input
        type="text"
        name="artist"
        value={formData.artist}
        onChange={handleChange}
        placeholder="Artist"
        required
      />
      <input
        type="text"
        name="album"
        value={formData.album}
        onChange={handleChange}
        placeholder="Album"
        required
      />
      <input
        type="text"
        name="duration"
        value={formData.duration}
        onChange={handleChange}
        placeholder="Duration"
        required
      />
      <button type="submit">Upload Songs</button>
    </form>
  );
};

export default AddMusic;
