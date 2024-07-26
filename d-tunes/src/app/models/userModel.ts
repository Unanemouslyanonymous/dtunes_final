import mongoose from 'mongoose';


export interface userModel {
    _id: string;
    username: string;
    email: string;
    password: string;
    role: 'user' | 'artist';
    playlists: Playlist[];
    friends: mongoose.Types.ObjectId[];
    friendRequests: mongoose.Types.ObjectId[];
    recentlyPlayed: mongoose.Types.ObjectId[];
    currentlyPlaying: any;
}

export interface Playlist {
    _id: string;
    thumbnail: string,
    name: string;
    songs: mongoose.Types.ObjectId[];
    isPrivate: boolean;
    totalDuration: number;
    currentlyPlaying: any;
}