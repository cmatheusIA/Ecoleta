import express from 'express'
import PointsController from './controllers/pointsControllers'
import ItensController from './controllers/itensController'

const routes = express.Router()
const pointController = new PointsController()
const itensController = new ItensController()

routes.get('/itens', itensController.index)


routes.post('/points',pointController.create)
routes.get('/points',pointController.index)
routes.get('/points/:id',pointController.show)


export default routes;

