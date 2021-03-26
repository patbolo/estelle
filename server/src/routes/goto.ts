import * as express from 'express';
import got from 'got';
import * as FormData from 'form-data';

const router = express.Router();

export class GoToRoutes {  
  static set(app: express.Application) {
    app.use('/mount/radec', router.get('/', async (req, res, next) => {
      try {
        const response = await got.get('http://10.8.0.6:8889');
        return res.send(response.body);
        //=> '<!doctype html> ...'
      } catch (error) {
          console.log(error.response.body);
          //=> 'Internal server error ...'
      }
    }));

    app.use('/mount/radec', router.post('/', async (req, res, next) => {
      let object = req.body;
      console.log(object);
      const form = new FormData();
      form.append('ra', object.ra);
      form.append('dec', object.dec);
      try {
        const response = await got.post('http://10.8.0.6:8889', { body: form });
        console.log(response.body);
        return res.send('Ok');
        //=> '<!doctype html> ...'
      } catch (error) {
          console.log(error.response.body);
          //=> 'Internal server error ...'
      }
    }));
  }
}