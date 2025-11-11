import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import healthRoutes from './routes/health';
import symptomsRoutes from './routes/symptoms';
import emergencyRoutes from './routes/emergency';
import educationRoutes from './routes/education';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/', (req, res) => {
  res.json({ message: 'AVC Alerta API' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/symptoms', symptomsRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/education', educationRoutes);

app.listen(PORT, () => {
  console.log('Server rodando na porta ' + PORT);
});

export default app;
