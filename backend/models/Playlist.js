import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
  }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Playlist = mongoose.model('Playlist', PlaylistSchema);
export default Playlist;
