import express from 'express'
import PointsController from './controllers/pointsControllers'
import ItensController from './controllers/itensController'
import multer from 'multer'
import multerconfig from './config/multer'

const routes = express.Router()
const pointController = new PointsController()
const itensController = new ItensController()
const upload = multer(multerconfig)

routes.get('/itens', itensController.index)


routes.post('/points',upload.single('image'),pointController.create)




routes.get('/points',pointController.index)
routes.get('/points/:id',pointController.show)


export default routes;

