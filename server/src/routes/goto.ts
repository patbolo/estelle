import * as express from 'express';
import got from 'got';
import * as FormData from 'form-data';

const router = express.Router();

export class GoToRoutes {  
  static set(app: express.Application) {
    app.use('/goto', router.post('/', async (req, res, next) => {
      let object = req.body.object;
      console.log(object);
      const form = new FormData();
      const options = {  
        method: 'POST',
        uri: 'http://10.8.0.6:8889',
        json: true,
        formData: {}
      }
      if (object == 'Saturn') {
        form.append('ra', '260.35');
        form.append('dec', '-21.55');
      }
      if (object == 'Jupiter') {
        form.append('ra', '197.70');
        form.append('dec', '-6.16');
      }
      if (object == 'M20') {
        form.append('ra', '270.5958');
        form.append('dec', '-23.01');
      }
      if (object == 'M8') {
        form.append('ra', '270.9042');
        form.append('dec', '-24.23');
      }
      console.log(options);
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