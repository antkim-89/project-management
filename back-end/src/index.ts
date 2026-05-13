import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Project Management API is running' });
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`
  🚀 Server is running on http://localhost:${PORT}
  🛠️  Mode: ${process.env.NODE_ENV || 'development'}
  `);
});
