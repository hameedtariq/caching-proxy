import express from 'express';
import redisClient from './config/redis';
const app = express();

app.get('/api', async (req, res) => {
  let response = null;
  const value = await redisClient.get('response');
  if (value) {
    response = JSON.parse(value);
    console.log('Cache hit');
  } else {
    response = 'Hello World';
    redisClient.set('response', JSON.stringify(response), {
      EX: 5,
    });
    console.log('Cache miss');
  }
  res.send(response);
});

app.listen(3000, async () => {
  await redisClient.connect();
  console.log('Server is running on http://localhost:3000');
});
