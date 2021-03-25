import { createServer, Server } from 'http';

import * as express from 'express';
import * as socketIo from 'socket.io';
import * as bodyParser from 'body-parser';
import { StaticRoutes } from './routes/static';
import { GoToRoutes } from './routes/goto';

//import { Message } from './model';

export class AppServer {
  public static readonly PORT:number = 3000;
  private app: express.Application;
  private server: Server;
  private io: SocketIO.Server;
  private port: string | number;

  constructor() {
    this.createApp();
    this.config();
    this.createServer();
    this.sockets();
    this.listen();
  }

  private createApp(): void {
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private createServer(): void {
    this.server = createServer(this.app);
  }

  private config(): void {
    this.port = process.env.PORT || AppServer.PORT;
  }

  private sockets(): void {
    this.io = socketIo(this.server);
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
      //this.app.use('/', express.static(path.join(__dirname, '../../client/dist/')));
      StaticRoutes.set(this.app);
      GoToRoutes.set(this.app);
    });

    this.io.on('connect', (socket: any) => {
      console.log('Connected client on port %s.', this.port);
      socket.on('message', (m: object) => {
        console.log('[server](message): %s', JSON.stringify(m));
        this.io.emit('message', m);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });      
  }

  public getApp(): express.Application {
    return this.app;
  }
}