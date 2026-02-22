const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
dotenv.config();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { sequelize } = require('./models');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',')
  : ['http://localhost:5173'];

const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true },
});

app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// Health-check endpoint (Render pings this)
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

app.use('/api', routes);
app.use(errorHandler);

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('join', (room) => socket.join(room));
  socket.on('leave', (room) => socket.leave(room));
  socket.on('message', (payload) => {
    io.to(payload.conversationId).emit('message', payload);
  });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    server.listen(PORT, () => console.log(`Server running on ${PORT}`));
  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
};

start();
