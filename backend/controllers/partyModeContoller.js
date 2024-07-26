import { User } from '../models/User.js';

export const createPartyModePlaylist = async (req, res) => {
  try {
    const { playlistId1, playlistId2 } = req.body;
    const user1 = await User.findOne({ 'playlists._id': playlistId1 });
    const user2 = await User.findOne({ 'playlists._id': playlistId2 });
    
    const playlist1 = user1.playlists.id(playlistId1);
    const playlist2 = user2.playlists.id(playlistId2);
console.log(playlist1,playlist2)
    const combinedSongs = [...playlist1.songs, ...playlist2.songs];
    const totalDuration = combinedSongs.reduce((sum, song) => sum + song.duration, 0);

    const partyPlaylist = {
      name: `Party Playlist (${playlist1.name} + ${playlist2.name})`,
      songs: combinedSongs,
      isPrivate: false,
    };
    user1.playlists.push(partyPlaylist);
    user2.playlists.push(partyPlaylist);
    await user1.save();
    await user2.save();
    res.status(200).json({ success: true, data: partyPlaylist });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};
