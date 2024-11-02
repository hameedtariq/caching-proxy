import express from 'express';
import redisClient from './config/redis';
import parseArguments from './utils/arguments';
import axios, { AxiosError } from 'axios';
import errorHandler from './middlewares/error-handler';
import 'express-async-errors';
import ApiError from './utils/api-error';
import pino from 'pino';

const { port, origin } = parseArguments();

const api = axios.create({
  baseURL: origin,
});

const logger = pino({
  level: 'info',
});

const app = express();

app.get('*', async (req, res) => {
  const path = req.originalUrl;
  logger.info('Requesting path:', path);
  let response = null;
  const value = await redisClient.get(path);
  if (value) {
    response = JSON.parse(value);
    res.setHeader('X-Cache', 'HIT');
    res.status(200).send(response);
  } else {
    try {
      response = await api.get(path);
    } catch (error) {
      throw ApiError.serviceUnavailable(
        'Service unavailable: ' + (error as AxiosError).message
      );
    }
    response = response.data;
    redisClient.set(path, JSON.stringify(response), {
      EX: 150,
    });
    res.setHeader('X-Cache', 'MISS');
    res.status(200).send(response);
  }
});

app.use(errorHandler);

const server = app.listen(port, async () => {
  await redisClient.connect();
  logger.info('Server is running on http://localhost:3000');
});

// Graceful shutdown handling
const gracefulShutdown = async () => {
  logger.info('Shutting down gracefully...');
  await redisClient.disconnect();
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
