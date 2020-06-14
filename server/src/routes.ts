import express from 'express'
import PointsController from './controllers/pointsControllers'
import ItensController from './controllers/itensController'
import multer from 'multer'
import multerconfig from './config/multer'
import {celebrate, Joi} from  'celebrate'

const routes = express.Router()
const pointController = new PointsController()
const itensController = new ItensController()
const upload = multer(multerconfig)

routes.get('/itens', itensController.index)


routes.post('/points',
              upload.single('image'),
              celebrate({
                body: Joi.object().keys({
                  name: Joi.string().required(),
                  email: Joi.string().required().email(),
                  whatsapp: Joi.number().required(),
                  latitude: Joi.number().required(),
                  longitude: Joi.number().required(),
                  city: Joi.string().required(),
                  uf: Joi.string().required().max(2),
                  itens: Joi.string().required(),

                })
              },{
                abortEarly:false
              }),
              pointController.create)




routes.get('/points',pointController.index)
routes.get('/points/:id',pointController.show)


export default routes;

