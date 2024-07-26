import { User } from '../models/User.js';
import Song from '../models/Song.js';
import multer from 'multer';
export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });

export const updatePlaylistThumbnail = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const playlist = user.playlists.id(req.params.id);
    if (!playlist) {
      return res.status(404).json({ msg: 'Playlist not found' });
    }

    if (req.file) {
      playlist.thumbnail = `/uploads/${req.file.filename}`;
    } else if (req.body.thumbnail) {
      playlist.thumbnail = req.body.thumbnail;
    }

    await user.save();
    res.json(playlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const uploader = upload.single('thumbnail');
export const createPlaylist = async (req, res) => {
  try {
    const { name, songs, isPrivate, currentUser} = req.body;
    const totalDuration = await Song.aggregate([
      { $match: { _id: { $in: songs } } },
      { $group: { _id: null, totalDuration: { $sum: "$duration" } } }
    ]); 
    console.log('totalduration', totalDuration);
    const playlist = {
      name,
      songs,
      isPrivate,
      totalDuration: totalDuration[0]?.totalDuration || 0
    };
console.log('playlist', playlist)

    const user = await User.findById(currentUser._id);
    console.log("user",user);
    user.playlists.push(playlist);
    await user.save();
    res.status(201).json({ success: true, data: playlist });
  } catch (error) {
    res.status(400).json({ success: false, error });
  } 
};
export const getPlaylists = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('playlists.songs').populate('favorites');

    let favoritesPlaylist = user.playlists.find(playlist => playlist.name === 'Favorites');

    if (!favoritesPlaylist) {
      favoritesPlaylist = {
        name: 'Favorites',
        songs: user.favorites,
        isPrivate: true
      };
      user.playlists.push(favoritesPlaylist);
      await user.save();
    } else {
      favoritesPlaylist.songs = user.favorites;
      await user.save();
    }

    res.status(200).json({ success: true, data: user.playlists });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};
export const getPlaylistById = async (req, res) => {
  try {
    const playlistId = req.params.id;
    console.log("req query", req.params.id)
    const user = await User.findOne({ 'playlists._id': playlistId }, { 'playlists.$': 1 }).populate('playlists.songs');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }
    res.status(200).json({ success: true, data: user.playlists[0] });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};
export const addSongToPlaylist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { playlistId, songId } = req.body;
    console.log(playlistId,songId)
    const playlist = user.playlists.id(playlistId);
    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }
    playlist.songs.push(songId);
    await user.save();
    res.status(200).json({ success: true, data: playlist });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

export const removeSongFromPlaylist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { playlistId, songId } = req.body;
    const playlist = user.playlists.id(playlistId);
    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }
    playlist.songs = playlist.songs.filter(id => id.toString() !== songId);
    await user.save();
    res.status(200).json({ success: true, data: playlist });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

