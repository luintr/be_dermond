import path from 'path'
import bodyParser from 'body-parser'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors';
import connectDB from './src/config/db';
import productRoute from './src/routes/productRoute'
import userRoute from './src/routes/userRoute'
import orderRoute from './src/routes/orderRoute'
import { errorHandler, notFound } from './src/middleware/errorHandler';
import http from 'http';

require('dotenv').config()
const app = express()

connectDB()

app.use(cors());
// app.set("port", process.env.PORT);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use('/api/products', productRoute)
app.use('/api/users', userRoute)
app.use('/api/orders', orderRoute)

app.get('api/config/paypal', (req, res) => res.send({ clientId: process.env.PAYPAL_CLIENT_ID }))

app.use(notFound)
app.use(errorHandler)

const httpApp = new http.Server(app);

httpApp.listen(process.env.PORT, () => { })

export default httpApp;
