import knex from '../database/connection'
import {Request,Response} from 'express'


class itensControllers{
  async index (request:Request,response:Response){
    const itens = await knex('itens').select('*')
  
    const serializedItens = itens.map(item =>{
      return {
        id:item.id,
        titulo: item.titulo,
        imagem_url: `http://192.168.0.15:3333/uploads/${item.image}`
      }
    })
  
    return response.json(serializedItens) 
  }

}

export default itensControllers