import { User } from "../models/User.js";
import Song from "../models/Song.js";
export const sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    const currentUser = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (currentUser.friends.includes(userId)) {
      return res.status(400).json({ msg: "User is already your friend" });
    }

    if (user.friendRequests.includes(req.user.id)) {
      return res.status(400).json({ msg: "Friend request already sent" });
    }

    user.friendRequests.push(req.user.id);
    await user.save();
    res.status(200).json({ msg: "Friend request sent" });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(req.user.id);
    const friend = await User.findById(userId);

    if (!friend) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (!user.friendRequests.includes(userId)) {
      return res.status(400).json({ msg: "Friend request not found" });
    }

    user.friends.push(userId);
    friend.friends.push(req.user.id);
    user.friendRequests = user.friendRequests.filter(
      (reqId) => reqId.toString() !== userId
    );

    await user.save();
    await friend.save();

    res.status(200).json({ msg: "Friend request accepted" });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

export const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "friends",
      "username email"
    );
    res.status(200).json({ success: true, friends: user.friends });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "friendRequests",
      "username email"
    );
    res.status(200).json({ success: true, requests: user.friendRequests });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      username: { $regex: query, $options: "i" },
      _id: { $ne: req.user.id },
    }).select("username email");

    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

export const getFriendPlaylists = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("friends");
    const friendPlaylists = [];

    for (const friend of user.friends) {
      const playlists = friend.playlists.map((playlist) => ({
        ...playlist.toObject(),
        owner: {
          _id: friend._id,
          username: friend.username,
        },
      }));
      friendPlaylists.push(...playlists);
    }

    res.status(200).json({ success: true, data: friendPlaylists });
  } catch (error) {
    console.error("Error fetching friend playlists:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
export const getFriendsCurrentlyPlaying = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends');
    const friendsCurrentlyPlaying = [];

    for (const friend of user.friends) {
      const currentlyPlayingSong = friend.currentlyPlaying ? await Song.findById(friend.currentlyPlaying).select('title') : null;
      friendsCurrentlyPlaying.push({
        friend: {
          _id: friend._id,
          username: friend.username,
        },
        currentlyPlaying: currentlyPlayingSong ? currentlyPlayingSong.title : 'No song playing',
      });
    }

    res.status(200).json({ success: true, data: friendsCurrentlyPlaying });
  } catch (error) {
    console.error('Error fetching friends currently playing songs:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
