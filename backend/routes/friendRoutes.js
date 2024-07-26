import express from 'express';
import {
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getFriends,
  searchUsers,
  getFriendPlaylists,
  getFriendsCurrentlyPlaying
} from '../controllers/friendController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/send', auth, sendFriendRequest);
router.post('/accept', auth, acceptFriendRequest);
router.get('/requests', auth, getFriendRequests);
router.get('/', auth, getFriends);
router.get('/search', auth, searchUsers);
router.get('/playlists',auth, getFriendPlaylists);
router.get('/:userId/currently-playing',auth,getFriendsCurrentlyPlaying);
export default router;
