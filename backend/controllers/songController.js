import Song from '../models/Song.js';
import { User } from '../models/User.js';
import { uploadFile } from '../utils/s3.js';
import axios from 'axios';

export const getSongs = async (req, res) => {
  try {
    const songs = await Song.find({});
    res.status(200).json({ success: true, data: songs });
  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(400).json({ success: false });
  }
};
export const playSong = async (req, res) => {
  try {
    const { songId } = req.body;
    const userId = req.user.id;

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ msg: 'Song not found' });
    }

    const user = await User.findById(userId);
    user.currentlyPlaying = song;
    await user.save();

    res.status(200).json({ success: true, song });
  } catch (error) {
    console.error('Error playing song:', error);
    res.status(500).json({ success: false, error });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const { songId } = req.body;
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user.favorites.includes(songId)) {
      user.favorites.push(songId);
      await user.save();
    }

    res.status(200).json({ success: true, data: user.favorites });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { songId } = req.body;
    const userId = req.params.userId;
    const user = await User.findById(userId);

    user.favorites = user.favorites.filter(favoriteId => favoriteId.toString() !== songId);
    await user.save();

    res.status(200).json({ success: true, data: user.favorites });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};
export const logRecentlyPlayed = async (req, res) => {
  try {
    const { userId, songId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });


    user.recentlyPlayed.push(songId);

    if (user.recentlyPlayed.length > 10) {
      user.recentlyPlayed.shift();
    }
    await user.save();
    res.status(200).json({ success: true, data: user.recentlyPlayed });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};
export const getRecentlyPlayed = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate('recentlyPlayed');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const recentlyPlayedSongs = await Song.find({ _id: { $in: user.recentlyPlayed } });
    res.status(200).json({ success: true, data: recentlyPlayedSongs });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};
export const getFavorites = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('favorites');

    res.status(200).json({ success: true, data: user.favorites });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

export const addSongs = async (req, res) => {
  try {
    const files = req.files;
    const uploadResults = await Promise.all(files.map(file => uploadFile(file)));
    const songs = await Promise.all(uploadResults.map((result, index) => {
      const file = files[index];
      return Song.create({
        title: file.originalname.split('.')[0], 
        artist: req.body.artist, 
        album: req.body.album, 
        duration: req.body.duration, 
        url: result.Location,
      });
    }));

    res.status(201).json({ success: true, data: songs });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Error uploading files' });
  }
};
