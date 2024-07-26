import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'artist'], default: 'user' },
  favorites:[{type: mongoose.Schema.ObjectId, ref:'Song'}],

  playlists: [{
    name: String,
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    isPrivate: { type: Boolean, default: true },
    totalDuration: { type: Number, default: 0 },
    thumbnail: {
      type: String,
      default: 'https://picsum.photos/seed/picsum/200',
    },
    currentlyPlaying: {type: mongoose.Schema.Types.ObjectId,ref: 'Song'},
  }],
  
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  recentlyPlayed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song'}],
  currentlyPlaying: {type: mongoose.Schema.Types.ObjectId, ref:'Song'}
});

export const User = mongoose.model("User", UserSchema);
