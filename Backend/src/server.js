import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// [WIP] Temporary healthcheck endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend scaffold running in mock mode' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
