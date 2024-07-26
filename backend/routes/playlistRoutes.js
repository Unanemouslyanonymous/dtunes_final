import express from 'express';
import { createPlaylist, getPlaylists, addSongToPlaylist, removeSongFromPlaylist, getPlaylistById, updatePlaylistThumbnail, uploader } from '../controllers/playlistController.js';
import auth from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/create').post(auth,createPlaylist);
router.route('/:userId').get(auth,getPlaylists);
router.route('/play/:id').get(auth,getPlaylistById);
router.route('/add-song').post(auth,addSongToPlaylist);
router.route('/remove-song').post(auth,removeSongFromPlaylist);
router.route('/:id/thumbnail').put(auth,uploader,updatePlaylistThumbnail)

export default router;
