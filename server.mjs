import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/quiz-data', async (req, res) => {
    try {
        const response = await fetch('https://api.jsonserve.com/Uw5CrX');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching quiz data:', error);
        res.status(500).json({ error: 'Failed to fetch quiz data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
