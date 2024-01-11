import path from 'path';
import bodyParser from 'body-parser';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db';
import productRoute from './routes/productRoute';
import userRoute from './routes/userRoute';
import orderRoute from './routes/orderRoute';
import { errorHandler, notFound } from './middleware/errorHandler';
import http from 'http';

require('dotenv').config();
const app = express();

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('API Running');
});

app.use('/api/products', productRoute);
app.use('/api/users', userRoute);
app.use('/api/orders', orderRoute);

app.use(notFound);
app.use(errorHandler);

const httpApp = http.createServer(app);

const PORT = process.env.PORT || 3000;
httpApp.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default httpApp;