import express from 'express';
import multer from 'multer';
import { addFavorite, addSongs, getFavorites, getSongs, removeFavorite, logRecentlyPlayed, getRecentlyPlayed, playSong } from '../controllers/songController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.route('/').post(upload.array('files'), addSongs).get(getSongs);
router.post('/favorites/add/:userId',auth, addFavorite);
router.post('/favorites/remove/:userId',auth, removeFavorite);
router.get('/favorites/:userId', getFavorites);
router.get('/recent/:id',getRecentlyPlayed);
router.post('/recent', auth,logRecentlyPlayed);
router.post('/play',auth,playSong)

export default router;
