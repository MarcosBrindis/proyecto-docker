import express, { Application } from 'express';
import cors from 'cors';
import { createUserRoutes } from './routes/userRoutes';
import { UserService } from '../../domain/services/UserService';

export class Server {
  private app: Application;
  private port: number;

  constructor(port: number, userService: UserService) {
    this.app = express();
    this.port = port;
    this.setupMiddlewares();
    this.setupRoutes(userService);
  }

  private setupMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(userService: UserService): void {
    this.app.use('/api', createUserRoutes(userService));
  }

  start(): void {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en puerto ${this.port}`);
      console.log(`API disponible en http://localhost:${this.port}/api`);
    });
  }
}