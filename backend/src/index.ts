import express from 'express';
import routes from './routes/endpoint';

const app = express();

app.use(express.json()); // Parse JSON bodies
app.use('/', routes);    // Mount your routes

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
