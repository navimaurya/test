import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from 'path'
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import AppError from './utils/appError'
import patientsRoutes from './routes/patients.routes'
import hospitalsRoutes from './routes/hospital.routes'
import doctorRoutes from './routes/doctors.routes'
import errorController from "./Controllers/errorController";

// APP
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('*', cors());

mongoose
  .connect(process.env.DB_HOST)
  .then((con) => {
    console.log('DB Connected succesfull!');
  }).catch(() => {
    console.log('DB Connected Failed!');
  });

app.use(express.static(path.join(__dirname, 'public')));

// View

// API
app.get('/api/v1', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'You are connected succesfully.'
  })
});

app.use('/api/v1', patientsRoutes)
app.use('/api/v1', hospitalsRoutes)
app.use('/api/v1', doctorRoutes)

app.all('*', (req, res, next) => {
  next(new AppError("Con't find the " + req.originalUrl + ' url', 404))
})

// Error
app.use(errorController)


const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  if (!['development', 'production'].includes(process.env.NODE_ENV)) {
    console.error("Please provide server environment, ['development'or 'production']")
    process.exit(1);
  }
  if (!process.env.DB_HOST) {
    console.error("Please server environment")
    process.exit(1);
  }
  console.log(`Server running on ${process.env.NODE_ENV}`);
  console.log(`Server started 0.0.0.0:${port}/tcp`);
});

process.on('unhandledRejection', (err: any) => {
  console.log(err.name, err.message);
});

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
});
