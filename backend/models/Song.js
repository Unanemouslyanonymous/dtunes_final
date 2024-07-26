import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  album: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  genre:{
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.Song || mongoose.model('Song', SongSchema);
