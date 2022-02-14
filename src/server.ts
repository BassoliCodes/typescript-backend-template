import 'reflect-metadata';
import 'express-async-errors';
import './shared/container';
import express, { NextFunction, Request, Response } from 'express';
import { routes } from './routes';
import { AppError } from './errors/AppError';
import dotenv from 'dotenv';

dotenv.config();

const server = express();

server.use(express.json());
server.use(routes);

server.use((err: Error, request: Request, response: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });
  }

  return response.status(500).json({
    status: 500,
    message: `Internal Server Error - ${err.message}`,
  });
});

server.listen(3333, () => console.log('Server is running'));
