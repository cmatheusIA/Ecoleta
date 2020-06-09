import knex from '../database/connection'
import {Request,Response} from 'express'


class pointsControllers{
  async create (request:Request,response:Response){
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      itens
    } = request.body
  
    
    const trx = await knex.transaction()

    const point = {
      image:'fake-https://images.unsplash.com/photo-1540661116512-12e516d30ce4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    }
  
    const insertedIds = await trx('points').insert(point)
  
    const point_id = insertedIds[0]
  
    const pointItens = itens.map((itens_id:Number)=>{
        return{
          point_id,
          itens_id
        }
    })
  
    await trx('point_itens').insert(pointItens)
  
    await trx.commit();
  
    return response.json({
      id:point_id,
      ...point
    })
  
  }

  async show(request:Request,response:Response){
    const { id } = request.params;
    const point  = await knex('points').where('id',id).first()

    if(!point){
      return response.status(400).json({deu:"ruim"})
    } 

    const itens = await knex('itens')
                      .join('point_itens','itens.id','=','point_itens.itens_id')
                      .where('point_itens.point_id',id)
                      .select('itens.titulo')

    return response.json({point,itens})

  }

  async index(request:Request, response:Response){
    const {city,uf,itens} = request.query;

    const parsedItens = String(itens)
                      .split(',')
                      .map(item => Number(item.trim()))

    const points = await knex('points')
                        .join('point_itens','points.id','=', 'point_itens.point_id')
                        .whereIn('point_itens.itens_id',parsedItens)
                        .where('city',String(city))
                        .where('uf',String(uf))
                        .distinct()
                        .select('points.*')

    return response.json(points)
     
  }
}

export default pointsControllers