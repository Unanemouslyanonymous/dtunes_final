import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import songRoutes from './routes/songRoutes.js';
import playlistRoutes from './routes/playlistRoutes.js';
import dAuthRoutes from './routes/dAuthRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import partyModeRoutes from './routes/partyModeRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();


connectDB();

const app = express();


app.use(cors({ origin: 'http://localhost:3000' , credentials: true }));

app.use(express.json());

app.use('/api/dauth', dAuthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/friends', friendRoutes)
app.use('/api/party-mode', partyModeRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
