import * as express from 'express';
import * as path from 'path';

export class StaticRoutes {
  static set(app: express.Application) {
    app.use('/', express.static(path.join(__dirname, '../../../client/dist/app/')));
  }
}