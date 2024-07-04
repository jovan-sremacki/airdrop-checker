// src/index.ts
import express, { Application, Request, Response } from 'express';
// import addressRoutes from './routes/addressRoutes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// app.use('/api/addresses', addressRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Airdrop Checker Backend');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
