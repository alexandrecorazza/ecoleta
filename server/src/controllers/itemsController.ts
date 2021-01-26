import { Request, Response } from 'express';
import knex from '../database/connection';

class ItemsController {
    async index(request: Request, response: Response) {
        const items = await knex('items').select('*');    //seria a mesma coisa que fazermos SELECT * FROM items
        //devemos usar o await para dar tempo da query terminar. E quando usamos o await, somos obrigados a usar o async, senão dá erro 
        //SELECT * FROM users WHERE name = 'Diego'
        //Knex('users').where('name', 'Diego').select('*')

        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://localhost:3333/uploads/${item.image}`,
            };
        })
        return response.json(serializedItems)
        /*obs: sempre que formos devolver uma resposta ao nosso usuário
        é interessante usar o return antes do response, pq se tiver algum código
        depois do response ele vai continuar executando.*/
    }
}

export default ItemsController;