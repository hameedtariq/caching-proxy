import express from 'express';
import redisClient from './config/redis';
import parseArguments from './utils/arguments';
import axios, { AxiosError } from 'axios';
import errorHandler from './middlewares/error-handler';
import 'express-async-errors';
import ApiError from './utils/api-error';

const { port, origin } = parseArguments();

const api = axios.create({
  baseURL: origin,
});

const app = express();

app.get('*', async (req, res) => {
  const path = req.path;
  console.log('Requesting path:', path);
  let response = null;
  const value = await redisClient.get(path);
  if (value) {
    response = JSON.parse(value);
    console.log('Cache hit');
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
      EX: 30,
    });
    console.log('Cache miss');
  }
  res.send(response);
});

app.use(errorHandler);

app.listen(port, async () => {
  await redisClient.connect();
  console.log('Server is running on http://localhost:3000');
});
